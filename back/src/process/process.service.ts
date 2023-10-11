import { BadRequestException, CACHE_MANAGER, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MstService } from 'src/mst/mst.service';
import { RedisService } from 'src/config/cache/redis.service';
import { TravelCardService } from 'src/travel-card/travel-card.service';
import { PutOnCabinetDto } from './dto/put-ssd-on-cabinet.dto';
import { hasRegisteredCabinetAndPositionsOnProcess, hasRegisteredSerialsOnProcess } from './helpers/has-registered-serials-on-process.helper';
import { SetMstStatusDto } from './dto/set-mst-status.dto';
import { SituationEnum } from './enums/situation.enum';
import { CachedProcessInterface, CachedSlots } from 'src/shared/interfaces/cached-process.interface';
import { DefectsRegisterDto } from './dto/defects-register.dto';
import { MesConsumeService } from 'src/mes-consume/mes-consume.service';
import { CachedRetestInterface } from 'src/shared/interfaces/cached-retest.interface';
import { SlotDefectService } from 'src/slot-defect/slot-defect.service';
import { CabinetService } from 'src/cabinet/cabinet.service';
import { SnListService } from 'src/sn-list/sn-list.service';
import { getDateTimeWithTimezone } from 'src/shared/helpers/date-time-with-timezone.helper';
import { getMinutesFromRdtTime } from 'src/websocket/helpers/get-minutes-from-rdt-time.helper';
import { getMillisecondsOfMinutes } from 'src/websocket/helpers/get-milliseconds-of-minutes.helper';
import { getTemperatureFromRdtTime } from 'src/websocket/helpers/get-temperature-from-rdt-time';
import { orderArrayByKey } from 'src/shared/helpers/order-array-by-key.helper';
import { SlotDefectInterface } from 'src/slot-defect/interfaces/slot-defect.interface';
import { WorkOrderInProgressEnum } from './enums/work-order-in-progress.enum';
import { CachedCabinetQueueInterface } from 'src/shared/interfaces/cached-cabinet-queue.interface';
import { ErroResponse } from 'src/common/error-response';
import { CodeError, CodeObject } from 'src/common/Enums';
import { removeDuplicates } from 'src/shared/helpers/remove-duplicates.helper';
import { VerifySerialException } from './enums/verify-serial-exception.enum';

@Injectable()
export class ProcessService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly redisService: RedisService,
        private readonly mstService: MstService,
        private readonly cabinetService: CabinetService,
        private readonly travelCardService: TravelCardService,
        private readonly mesConsumeService: MesConsumeService,
        private readonly slotDefectService: SlotDefectService,
        private readonly snListService: SnListService,
    ) { }

    private processes_queue_prefix = 'processes-queue';
    private cabinet_queue_prefix = 'cabinet-queue';

    async cachedProcesses() {
        return this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
    }

    async cachedQueue() {
        return this.cacheManager.get<string[]>('adata:queue');
    }

    async verifyValidSerials(serials_on_request: string[]) {
        
        if (!serials_on_request.length) {
            throw new BadRequestException('Os seriais precisam ser enviados na requisição!');
        }

        let work_orders: number[] = [];

        return await Promise.all(
            serials_on_request.map(async (serial, index) => {
                const work_order = await this.mesConsumeService.getWorkOrderBySerial(serial).catch(() => {});

                if (!work_order) {
                    work_orders.push(null);
                    return {
                        work_order_number: null,
                        serial: serial,
                        exception_type: VerifySerialException.INVALID
                    };
                }
                else {
                    const testedSerial = await this.travelCardService.testedSerial(serial);

                    if (testedSerial) {
                        return {
                            work_order_number: null,
                            serial: serial,
                            exception_type: VerifySerialException.TESTED
                        };
                    }

                    work_orders.push(work_order?.work_order_number);
                    let last_work_order = await this.getLastWorkOrder();
                    const first_work_order = work_orders.find(value => value);

                    if (!last_work_order && first_work_order === work_order?.work_order_number) {
                        return {
                            work_order_number: work_order?.work_order_number,
                            serial: serial,
                            exception_type: VerifySerialException.VALID_SAME_WO
                        };
                    }

                    if (work_order?.work_order_number !== last_work_order?.work_order.work_order_number) {
                        return {
                            work_order_number: work_order?.work_order_number,
                            serial: serial,
                            exception_type: VerifySerialException.VALID_ANOTHER_WO
                        };
                    }
                    else {
                        return {
                            work_order_number: work_order?.work_order_number,
                            serial: serial,
                            exception_type: VerifySerialException.VALID_SAME_WO
                        };
                    }
                }
            })
        );
    }

    async getWorkOrderByValidSerial(serials_on_request: string[]) {

        if (!serials_on_request.length) {
            throw new BadRequestException('Os seriais precisam ser enviados na requisição!');
        }
        
        return await Promise.all(
            serials_on_request.map(async (serial_request, index) => {
                const work_order = await this.mesConsumeService.getWorkOrderBySerial(serial_request).catch(() => {});

                if (!work_order) {
                    throw new NotFoundException(`Serial ${serial_request} inválido!`);
                }

                return work_order;
            })
        ).then((response) => response[0]);
     
    }

    async setOnCabinet(putOnCabinetDto: PutOnCabinetDto) {

        let { cabinet_name, slots, user_mes_id, is_filled_cabinet } = putOnCabinetDto;

        if (!user_mes_id) {
            throw new BadRequestException('O id do usuário do MES precisa ser passado na requisição!');
        }

        const mes_user = await this.verifyMesUserById(user_mes_id);

        if (!mes_user.status) {
            throw new NotFoundException(`Usuário com id ${user_mes_id} não encontrado!`);
        }

        if (!cabinet_name) {
            throw new BadRequestException('Painel não foi passado na requisição!');
        }

        const is_used_cabinet = await this.isUsedCabinetOrMstByKeyValue('cabinet_name', cabinet_name);

        if (is_used_cabinet) {
            throw new ConflictException(`Painel: ${cabinet_name} já está em uso!`);
        }

        const serials_on_request = slots.filter((slot) => slot.serial_number).map(slot => slot.serial_number);
        const positions_on_request = slots.filter((slot) => slot.position).map(slot => slot.position);
        const has_invalid_position = slots.some(slot => slot.position < 1 || slot.position > 360);

        if (has_invalid_position) {
            throw new BadRequestException('As posições aceitas são de 1 à 360!');
        }

        if (!serials_on_request.length) {
            throw new BadRequestException('Seriais não foram passados na requisição!');
        }

        if (!positions_on_request.length) {
            throw new BadRequestException('Posições não foram passadas na requisição!');
        }

        const cabinet = await this.cabinetService.findByName(cabinet_name);

        if (!cabinet) {
            throw new NotFoundException(`Painel: ${cabinet_name} inexistente!`);
        }

        if (cabinet.cabinet_status === false) {
            throw new ConflictException(`Painel: ${cabinet_name} desativado!`);
        }

        const work_order = await this.getWorkOrderByValidSerial(serials_on_request);

        const is_work_order_in_progress = await this.isWorkOrderInProgress(work_order?.work_order_number, WorkOrderInProgressEnum.PUT_ON_CABINET);

        if (is_work_order_in_progress) {
            throw new ConflictException(`Work order ${work_order?.work_order_number} já foi totalmente preenchida e está em progresso!`);
        }

        slots = await Promise.all(
            slots?.map(async (slot: CachedSlots) => {

                const duplicate_serials = serials_on_request.filter((item, index) => serials_on_request.indexOf(item) !== index);
                const duplicate_positions = positions_on_request.filter((item, index) => positions_on_request.indexOf(item) !== index);
                const approved_serial_number = await this.snListService.findApprovedSerialNumber(slot.serial_number);

                if (duplicate_serials.length) {
                    throw new BadRequestException(`Serial(s) ${duplicate_serials.join(", ")} duplicado(s) na requisição!`);
                }

                if (duplicate_positions.length) {
                    throw new BadRequestException(`Posição(s) ${duplicate_positions.join(", ")} duplicada(s) na requisição!`);
                }
                
                const registered_slot_defect = await this.slotDefectService.getByCabinetAndPosition(cabinet.cabinet_id, slot.position);
    
                if (registered_slot_defect && registered_slot_defect.status === false) {
                    throw new ConflictException(`Slot na posição ${slot.position} com defeito!`);
                }

                if (approved_serial_number) {
                    throw new ConflictException(`Serial ${slot.serial_number} já foi aprovado!`);
                }

                const last_failed_serial = await this.travelCardService.getLastFailedSerial(slot.serial_number);
                let test_serial_count = last_failed_serial ? last_failed_serial.test_serial_count + 1 : 1;
                
                return {
                    ...slot,
                    work_order_number: work_order.work_order_number,
                    cabinet_name: cabinet_name,
                    situation_id: SituationEnum.SDD_ON_CABINET,
                    created_at: getDateTimeWithTimezone(),
                    status: null,
                    test_serial_count: test_serial_count
                }
            })
        );

        let processes =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        let cached_work_order = processes.find(process => process.work_order.work_order_number === work_order.work_order_number);

        processes.forEach(process => {
            let without_is_filled_cabinet = process.slots.find((slot) => (!slot.is_filled_cabinet && slot.cabinet_name !== cabinet_name));

            if (without_is_filled_cabinet) {
                throw new ConflictException(`Painel: ${without_is_filled_cabinet?.cabinet_name} ainda não finalizou o processo de inserção!`);
            }
            process.slots.forEach((slot) => {
                if (slot.work_order_number !== work_order.work_order_number && slot.cabinet_name === cabinet_name) {
                    throw new ConflictException(`Não pode haver duas work orders no mesmo painel!`);
                }
            })
        });

        if (processes.length) {
            let last_work_order = await this.getLastWorkOrder();

            if (work_order.work_order_number !== last_work_order.work_order.work_order_number && !last_work_order?.is_ended) {
                throw new ConflictException(`Work order ${last_work_order?.work_order.work_order_number} ainda não foi totalmente inserida!`);
            }
        }

        if (!cached_work_order) {
            let process: CachedProcessInterface = {
                work_order: work_order,
                user_mes_id: user_mes_id,
                slots: slots,
                created_at: getDateTimeWithTimezone()
            }

            if (is_filled_cabinet) {
                process.slots = process.slots?.map((slot: CachedSlots) => (
                    {
                        ...slot,
                        is_filled_cabinet: true
                    }
                ));
                
                await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${process.work_order.work_order_number}`, process);
                await this.addCabinetToQueue(cabinet_name);
                return this.travelCardService.createTravelCard(process?.work_order, cabinet_name);
            }

            await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${work_order.work_order_number}`, process);
            await this.addCabinetToQueue(cabinet_name);
            return process;
        }

        const registered_serials = cached_work_order.slots.map(slot => slot.serial_number);

        const registered_cabinet_and_positions = cached_work_order.slots.map(slot => ({
            cabinet_name: slot.cabinet_name,
            position: slot.position
        }));

        const cabinet_and_positions_on_request = slots.map(slot => ({
            cabinet_name: cabinet_name,
            position: slot.position
        }));

        hasRegisteredSerialsOnProcess(registered_serials, serials_on_request);
        hasRegisteredCabinetAndPositionsOnProcess(registered_cabinet_and_positions, cabinet_and_positions_on_request);

        const cabinet_usage = cached_work_order.slots.filter(slot => slot.cabinet_name === cabinet_name).length;
        const cabinet_total_capacity = await this.cabinetService.getTotalCabinetCapacity(cabinet.cabinet_id);

        if ((cabinet_usage + slots.length) > cabinet_total_capacity) {
            throw new ConflictException(`O Painel: ${cabinet_name} está 100% em uso!`);
        }

        cached_work_order.slots.push(...slots);

        if (!cached_work_order?.slots?.length) {
            cached_work_order.user_mes_id = user_mes_id;
        }

        if (is_filled_cabinet) {
            cached_work_order.slots = cached_work_order.slots?.map((slot: CachedSlots) => (
                {
                    ...slot,
                    is_filled_cabinet: true
                }
            ));
            
            await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);
            await this.addCabinetToQueue(cabinet_name);
            return this.travelCardService.createTravelCard(cached_work_order?.work_order, cabinet_name);
        }

        await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);
        await this.addCabinetToQueue(cabinet_name);

        return cached_work_order;
    }

    async availableMst(mst_side: number) {

        let processes =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        let registered_cabinet_queue = await this.cacheManager.get<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`);

        if (!registered_cabinet_queue) {
            throw new ConflictException(`Nenhum painel em fila!`);
        }

        let queue_cabinet = registered_cabinet_queue.find(cabinet => cabinet.cabinet_side === mst_side);

        if (!queue_cabinet) {
            const sides = ['esquerdo', 'direito'];
            throw new NotFoundException(`Nenhum painel do lado ${sides[mst_side]} aguardando para ser atrelado!`);
        }

        let cached_work_order = processes.find(process => process.slots.find(slot => slot.cabinet_name === queue_cabinet.cabinet_name));
        
        if (!cached_work_order) {
            throw new NotFoundException('Nenhum painel aguardando para ser atrelado à alguma mst!');
        }

        cached_work_order.slots.forEach(slot => {
            if (slot.cabinet_name === queue_cabinet.cabinet_name && !slot.is_filled_cabinet) {
                throw new ConflictException(`Inserções no Painel: ${queue_cabinet.cabinet_name} ainda não foram finalizadas!`);
            }
        });

        const cabinet_with_mst = cached_work_order.slots.some(slot => slot.cabinet_name === queue_cabinet.cabinet_name && slot.mst_name);

        if (cabinet_with_mst) {
            throw new ConflictException(`O painel: ${queue_cabinet.cabinet_name} já está atrelado a alguma mst!`);
        }

        const msts = await this.mstService.getAll();

        let available_msts = await Promise.all(
            msts.map(async (mst) => {
                const is_used_mst = await this.isUsedCabinetOrMstByKeyValue('mst_name', mst.mst_name);
                if (!is_used_mst && mst.mst_status && Number(mst.mst_side) === mst_side) {
                    return mst.mst_name;
                }
            })
        ).then(msts => msts.filter(value => value !== undefined));

        if (!available_msts.length) {
            const sides = ['esquerdo', 'direito'];
            throw new NotFoundException(`Nenhuma mst do lado ${sides[mst_side]} disponível no momento!`);
        }
        
        let merged_cabinet_mst = {
            [queue_cabinet.cabinet_name]: available_msts[0]
        };

        cached_work_order = {
            ...cached_work_order,
            slots: cached_work_order.slots.map((slot) => ({
                ...slot,
                mst_name: slot.mst_name ? slot.mst_name : merged_cabinet_mst[slot.cabinet_name]
            }))
        }

        await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);
        await this.removeCabinetToQueue(queue_cabinet.cabinet_name);

        const rdt_time_minutes = getMinutesFromRdtTime(cached_work_order.work_order.rdt_time);
        
        return {
            ...cached_work_order,
            merged_cabinet_mst,
            test_temperature: getTemperatureFromRdtTime(cached_work_order.work_order.rdt_time),
            test_time_in_milliseconds: getMillisecondsOfMinutes(rdt_time_minutes)
        };
    }

    async setMstStatus(mst_name: string, setMstStatusDto: SetMstStatusDto) {

        const { status } = setMstStatusDto;
        let processes =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        let cached_work_order = processes.find(process => process.slots.find(slot => slot.mst_name === mst_name));

        if (!cached_work_order) {
            throw new NotFoundException(`Nenhuma work order atrelada à ${mst_name}!`);
        }

        const msts_on_process = cached_work_order.slots.map((slot) => slot.mst_name);

        if (!msts_on_process.includes(mst_name)) {
            throw new ConflictException(`Mst ${mst_name} não foi atrelada à nenhuma work order até o momento!`);
        }

        let slots = cached_work_order.slots.map((slot) => {
            if (slot.mst_name === mst_name) {
                if (slot.situation_id >= 3) {
                    throw new ConflictException(`Mst ${mst_name} já foi finalizada!`);
                }

                if (status === true) {
                    if (slot.situation_id === 2) {
                        throw new ConflictException(`Mst ${mst_name} já foi iniciada!`);
                    }
                }
                else {
                    if (slot.situation_id < 2) {
                        throw new ConflictException(`Mst ${mst_name} ainda não foi iniciada!`);
                    }
                }
            }
            
            return {
                ...slot,
                status: null,
                situation_id: slot.mst_name !== mst_name ? slot.situation_id : (status === true ? SituationEnum.SDD_INIT_TESTING : SituationEnum.SSD_END_TESTING),
                created_at: slot.mst_name !== mst_name ? slot.created_at : getDateTimeWithTimezone()
            }
        });

        cached_work_order.slots = slots;
        await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);

        return this.travelCardService.createTravelCard(cached_work_order.work_order, undefined, mst_name);
    }

    async defectsRegister(cabinet_name: string, defectsRegisterDto: DefectsRegisterDto) {

        const { defect_serials } = defectsRegisterDto;

        let cached_work_order = await this.redisService.getByKeyValueArray<CachedProcessInterface>('processes*', 'slots', 'cabinet_name', cabinet_name);

        if (!cached_work_order) {
            throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND_CABINET_ON_WORK_ORDER, `O painel: ${cabinet_name} não foi atrelado a nenhuma work order até o momento!`, CodeObject.CABINET));
        }

        const cached_serials = cached_work_order.slots.map(slot => slot.serial_number);

        defect_serials.forEach(serial => {
            if (!cached_serials.includes(serial)) {
                throw new ConflictException(new ErroResponse(CodeError.NOT_FOUND_SERIAL_ON_CACHE, `O serial ${serial} não está em uso ou não existe!`, CodeObject.SERIAL));
            }
        });

        let approved_serials: string[] = [];
        let reproved_serials: string[] = [];
        let slot_defects: SlotDefectInterface[] = [];

        let slots = await Promise.all(
            cached_work_order.slots.map(async (slot) => {

                if (slot.cabinet_name === cabinet_name) {

                    if (slot.situation_id < 3) {
                        throw new ConflictException(new ErroResponse(CodeError.NOT_ENDED_MST_TEST, "A mst precisa finalizar os testes antes do processo de aprovação!", CodeObject.MST));
                    }

                    const cabinet = await this.cabinetService.findAvailableCabinetByName(slot.cabinet_name);
                    const registered_slot_defect = await this.slotDefectService.getByCabinetAndPosition(cabinet.cabinet_id, slot.position);
                    const status = !defect_serials.length ? true : (defect_serials?.includes(slot.serial_number) ? false : true);
                    const user_name = "Célula";
                    
                    if (status === true) {
                        approved_serials.push(slot.serial_number);

                        if (registered_slot_defect && registered_slot_defect?.count < 3) {
                            slot_defects.push({
                                slot_defect_id: registered_slot_defect.slot_defect_id,
                                cabinet_name: registered_slot_defect.cabinet.cabinet_name,
                                position: registered_slot_defect.position,
                                count: 0,
                                status: true,
                                user_name: user_name
                            });
                        }
                    }
                    else {
                        reproved_serials.push(slot.serial_number);

                        if (!registered_slot_defect) {
                            slot_defects.push({
                                slot_defect_id: undefined,
                                cabinet_name: slot.cabinet_name,
                                position: slot.position,
                                count: 1,
                                status: true,
                                user_name: user_name
                            });
                        }
                        else {
                            slot_defects.push({
                                slot_defect_id: registered_slot_defect.slot_defect_id,
                                cabinet_name: registered_slot_defect.cabinet.cabinet_name,
                                position: registered_slot_defect.position,
                                count: registered_slot_defect.count + 1,
                                status: (registered_slot_defect.count + 1 >= 3)  ? false : true,
                                user_name: user_name
                            });
                        }
                    }                
                    return {
                        ...slot,
                        status: status,
                        situation_id: SituationEnum.SSD_DEFECTS_REGISTER,
                        created_at: getDateTimeWithTimezone()
                    }
                }
                
                return slot;
            })
        );

        cached_work_order.slots = slots;
        await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);

        const registeredTravelCard = await this.travelCardService.createTravelCard(cached_work_order.work_order, cabinet_name);

        if (slot_defects.length) {
            await this.slotDefectService.create({ slot_defects: slot_defects}, true);
        }
        
        if (approved_serials.length) {
            await this.mesConsumeService.addApprovedSerials({ 
                approved_serials: approved_serials,
                user_mes_id: cached_work_order?.user_mes_id
            }, true);
        }

        if (reproved_serials.length) {
            let cached_reproved_serials = await this.cacheManager.get<CachedRetestInterface>(`adata:retest:${cached_work_order.work_order.work_order_number}`);

            if (!cached_reproved_serials) {
                let retest = {
                    work_order_number: cached_work_order.work_order.work_order_number,
                    serials: reproved_serials
                }
                await this.cacheManager.set(`adata:retest:${cached_work_order.work_order.work_order_number}`, retest);
            } 
            else {
                cached_reproved_serials.serials.push(...reproved_serials);
                await this.cacheManager.set(`adata:retest:${cached_work_order.work_order.work_order_number}`, cached_reproved_serials);
            }
        }

        
        cached_work_order.slots = cached_work_order.slots.filter(slot => slot.cabinet_name !== cabinet_name);

        if (!cached_work_order.slots.length) {
            await this.cacheManager.del(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`);
        }
        else {
            await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${cached_work_order.work_order.work_order_number}`, cached_work_order);
        }

        const cached_exception_processes = await this.getExceptionProcesses();

        if (!cached_exception_processes?.length) {
            await this.pauseAllProgressWorkOrders(false);
        }

        return registeredTravelCard;

    }

    async defectPositions(cabinet_name: string) {

        const cabinet = await this.cabinetService.findByName(cabinet_name);

        if (!cabinet) {
            throw new NotFoundException(`Painel: ${cabinet_name} inexistente!`);
        }

        if (cabinet.cabinet_status === false) {
            throw new ConflictException(`Painel: ${cabinet_name} desativado!`);
        }

        const defects = await this.slotDefectService.getDefectsByCabinet(cabinet.cabinet_id);

        let defect_positions = defects.map(defect => defect.position).sort((a, b) => a - b)

        return removeDuplicates(defect_positions);
    }

    async addCabinetToQueue(cabinet_name: string) {

        let registered_queue = await this.cacheManager.get<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`);
        let cabinet = await this.cabinetService.findAvailableCabinetByName(cabinet_name);

        if (!cabinet) {
            throw new NotFoundException(`Painel: ${cabinet_name} inexistente!`);
        }

        const cabinet_to_save = {
            cabinet_name: cabinet_name,
            cabinet_side: cabinet.cabinet_side
        }

        if (!registered_queue) {
            const queue: CachedCabinetQueueInterface[]= [cabinet_to_save];
            return await this.cacheManager.set<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`, queue);
        }

        if (!registered_queue.includes(cabinet_to_save)) {
            registered_queue.push(cabinet_to_save);
        }

        return await this.cacheManager.set<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`, registered_queue);
    }

    async removeCabinetToQueue(cabinet_name: string) {

        let registered_queue = await this.cacheManager.get<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`);

        if (!registered_queue) {
            throw new ConflictException("Nenhum processo em fila!");
        }

        const newQueue = registered_queue.filter(registered_cabinet => registered_cabinet.cabinet_name !== cabinet_name);
        
        return await this.cacheManager.set<CachedCabinetQueueInterface[]>(`adata:${this.cabinet_queue_prefix}`, newQueue);
    }

    async allowNewWorkOrder() {

        let last_work_order = await this.getLastWorkOrder();

        const has_unfilled_cabinets = last_work_order?.slots.some(slot => !slot.is_filled_cabinet);

        if (has_unfilled_cabinets || !last_work_order?.slots.length) {
            throw new ConflictException(`Painéis da Work order ${last_work_order?.work_order?.work_order_number} precisam ser totalmente preenchidos antes de liberar uma nova Work order!`);
        }
        
        if (last_work_order?.is_exception) {
            last_work_order.is_ended_exception = true;
        }
        else {
            last_work_order.is_ended = true;
        }

        if (last_work_order.is_exception && last_work_order.is_ended_exception) {
            await this.pauseAllProgressWorkOrders(false);
        }
        
        return await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${last_work_order.work_order.work_order_number}`, last_work_order);
    }

    async createNewWorkOrderExceptionQueue(work_order_number: number) {
        const cached_exception_processes =  await this.getExceptionProcesses();

        if (cached_exception_processes.length) {
            throw new ConflictException(`Work order: ${cached_exception_processes[0]?.work_order?.work_order_number} já se encontra na fila de exceção!`);
        }

        const work_order = await this.mesConsumeService.getWorkOrderInfo(work_order_number);

        if (!work_order) {
            throw new NotFoundException(`Work order ${work_order_number} não existe!`);
        }

        const is_work_order_in_progress = await this.isWorkOrderInProgress(work_order_number, WorkOrderInProgressEnum.CREATE_WORK_ORDER_EXCEPTION);

        if (is_work_order_in_progress) {
            throw new ConflictException(`Work order ${work_order_number} já está em progresso!`);
        }

        const is_not_filled_cabinets = await this.isNotFilledCabinets();

        if (is_not_filled_cabinets) {
            throw new ConflictException(`Painéis não foram totalmente inseridos!`);
        }

        await this.pauseAllProgressWorkOrders(true);

        const exception_process: CachedProcessInterface = {
            work_order: work_order,
            slots: [],
            is_exception: true,
            created_at: getDateTimeWithTimezone()
        }

        return await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${work_order_number}`, exception_process);
    }

    async getExceptionProcesses(): Promise<CachedProcessInterface[]> {
        const processes = await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        return processes.filter(process => process?.is_exception && !process.is_ended_exception);
    }


    async isUsedCabinetOrMstByKeyValue(key: string, value: string): Promise<boolean> {
        let processes_queue =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        return processes_queue.some((process) => process.slots.some((slot) => slot[key] === value && slot.is_filled_cabinet));
    }

    async isNotFilledCabinets(): Promise<boolean> {
        let processes_queue =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        return processes_queue.some((process) => !process.is_exception && process.slots.some((slot) => !slot.is_filled_cabinet));
    }

    async isWorkOrderInProgress(work_order_number: number, method: WorkOrderInProgressEnum): Promise<boolean> {
        let processes_queue =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);

        switch (method) {
            case WorkOrderInProgressEnum.PUT_ON_CABINET:
                return processes_queue.some((process) => process.work_order.work_order_number === work_order_number && (process.is_ended || process.is_ended_exception));

            case WorkOrderInProgressEnum.CREATE_WORK_ORDER_EXCEPTION: 
                return processes_queue.some((process) => process.work_order.work_order_number === work_order_number);
        }
    }

    async pauseAllProgressWorkOrders(is_paused: boolean): Promise<void> {
        let processes =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        const processes_without_exception = processes.filter(process => !process.is_exception);

        return await Promise.all(
            processes_without_exception.map(process => ({
                ...process,
                is_paused: is_paused
            }))
        ).then((pausedProcesses) => {
            pausedProcesses?.forEach(async (process) => {
                return await this.cacheManager.set(`adata:${this.processes_queue_prefix}:${process.work_order.work_order_number}`, process);
            });
        });
    }

    async getLastWorkOrder() {
        let processes =  await this.redisService.getArrayBykeyPath<CachedProcessInterface>(`${this.processes_queue_prefix}*`);
        const orderedProcess = orderArrayByKey<CachedProcessInterface>(processes, "created_at");
        let cached_work_order = orderedProcess[processes.length - 1];

        const cached_exception_processes =  await this.getExceptionProcesses();

        if (!cached_exception_processes.length) {
            let processes_without_exception = orderedProcess.filter(process => !process.is_exception);
            cached_work_order = processes_without_exception[processes_without_exception.length - 1];  
        }

        return cached_work_order;
    }

    async verifyMesUserById(user_mes_id: number) {
        const mes_user = await this.mesConsumeService.getMesUserById(user_mes_id).catch(() => {});

        if (!mes_user) {
            return {
                status: 0,
                user: null
            };
        }

        return {
            status: 1,
            user: mes_user
        };
    }

    async getMappedTestPositions(cabinet_name: string) {
        let cached_work_order = await this.redisService.getByKeyValueArray<CachedProcessInterface>('processes*', 'slots', 'cabinet_name', cabinet_name);

        if (!cached_work_order) {
            throw new NotFoundException(`O painel: ${cabinet_name} não foi atrelado a nenhuma work order até o momento!`);
        }

        let has_untested_serials = cached_work_order.slots.some(slot => slot.situation_id < 3);

        if (has_untested_serials) {
            throw new ConflictException(`O painel: ${cabinet_name} não foi testado!`);
        }

        return cached_work_order.slots.map(slot => slot.position);
    }

    async clearProcesses() {
        await this.cacheManager.reset();
        await this.travelCardService.clearTravelCard();
        return await this.snListService.clearSnList();
    }
}
