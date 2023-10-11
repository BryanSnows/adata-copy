import { HttpService } from '@nestjs/axios';
import {  BadRequestException, ConflictException, HttpException, Injectable, NotFoundException, OnModuleInit, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { map, firstValueFrom } from 'rxjs';
import { convertMesApiResponse, hasErrorOnMesApiResponse } from 'src/shared/helpers/convert-mes-api-response.helper';
import { getDateTimeWithTimezone } from 'src/shared/helpers/date-time-with-timezone.helper';
import { WorkOrderInterface } from 'src/shared/interfaces/work-order.interface';
import { WorkOrderSerialEntity } from 'src/travel-card/entities/workorder-serial.entity';
import { TravelCardService } from 'src/travel-card/travel-card.service';
import { Repository } from 'typeorm';
import { ApprovedSerialsDto } from './dto/approved-serials.dto';
import { CreateSerialExceptionDto } from './dto/create-serial-exception.dto';
import { FilterSerialException } from './dto/filter-serial-exception.dto';
import { SerialExceptionEntity } from './entities/serial-exception.entity';
import { ApprovedSerialsInterface } from './interface/approved-serials.interface';
import { ErroResponse } from 'src/common/error-response';
import { CodeError, CodeObject } from 'src/common/Enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MesConsumeService implements OnModuleInit {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(SerialExceptionEntity)
        private readonly serialExceptionRepository: Repository<SerialExceptionEntity>,
        @InjectRepository(WorkOrderSerialEntity)
        private readonly workOrderSerialRepository: Repository<WorkOrderSerialEntity>,
        private readonly travelCardService: TravelCardService,
        private readonly configService: ConfigService
    ) {}

    private isMocked = false;
    
    private mesApiUrls = {
        approved_serials: 'approved-serials',
        get_work_order: 'get-work-order',
        get_mes_user_by_id: 'get-mes-user-by-id',
        get_work_order_info: 'get-work-order-info'
    }

    onModuleInit() {
        const baseUrlArray = this.configService.get('mes.api_url').split('/');
        this.isMocked = baseUrlArray.includes('mes-api');
    }
    
    async addApprovedSerials(approvedSerialDto: ApprovedSerialsDto, isAutomated: boolean): Promise<ApprovedSerialsInterface> {
        const { approved_serials, user_mes_id } = approvedSerialDto;
        const success_approved_serials: string[] = [];
        const serial_exceptions: string[] = [];

        await Promise.all(
            approved_serials.map(async (serial_number) => {
                const workorder_serial = await this.getWorkOrderAndSerialByNumber(serial_number);

                if (!workorder_serial) {
                    throw new NotFoundException('Serial não encontrado!');
                }

                const testedSerial = await this.travelCardService.testedSerial(serial_number);

                if (!testedSerial) {
                    throw new BadRequestException(new ErroResponse(CodeError.NOT_TEST, `Serial ${serial_number} ainda não foi testado!`, CodeObject.SERIAL));
                }

                if (!testedSerial.status) {
                    throw new ConflictException(`Serial ${serial_number} Reprovado`);
                }

                const serial_exception = await this.getSerialExceptionBySerial(serial_number);

                if (serial_exception) {
                    await this.changeStatusSerialException(serial_number, true);
                }
                
                if (!serial_exception && !isAutomated) {
                    throw new ConflictException(`Serial ${serial_number} não faz parte da lista de exceções!`);
                }

                return await firstValueFrom(
                    this.httpService.get<string>(this.isMocked ? `${this.mesApiUrls.approved_serials}`: '', { params: {
                        name: 'TEST',
                        value: `IN_IP:${testedSerial?.mst?.mst_ip}@IN_SN:${serial_number}@IN_USERID:${user_mes_id}@IN_RESULT:OK`
                    }}).pipe(map((response) => convertMesApiResponse(response.data)))
                )
                .then((response) => {

                    if (hasErrorOnMesApiResponse(response)) {
                        serial_exceptions.push(serial_number);
                    }
                    else {
                        success_approved_serials.push(serial_number);
                    }
                })
                .catch(() => {
                    serial_exceptions.push(serial_number);
                });
            })
        );

        if (serial_exceptions.length) {
            await this.createSerialException({ serial_numbers: serial_exceptions });
        }

        return {
            success_approved_serials: success_approved_serials,
            serial_exceptions: serial_exceptions
        }

    }

    async getWorkOrderBySerial(serial_number: string): Promise<WorkOrderInterface> {

        return await firstValueFrom(
            this.httpService.get<string>(this.isMocked ? `${this.mesApiUrls.get_work_order}` : '', { params: {
                name: 'GET_WO_BY_SN',
                value: `IN_SN:${serial_number}`
            }})
            .pipe(map((response) => convertMesApiResponse(response.data)))
        )
        .then(async (response) => {

            if (hasErrorOnMesApiResponse(response)) {
                throw new ConflictException(`${response['MES_ERROR']}`);
            }

            const work_order_number: number = Number(response);
            return await this.getWorkOrderInfo(work_order_number);
        })
        .catch((error: AxiosError) => {
            throw new HttpException(error?.response?.data, error?.response?.status);
        });
    }

    async getMesUserById(user_mes_id: number): Promise<string> {

        return await firstValueFrom(
            this.httpService.get<string>(this.isMocked ? `${this.mesApiUrls.get_mes_user_by_id}` : '', { params: {
                name: 'GET_EMPNAME',
                value: `IN_EMPNO:${user_mes_id}`
            }})
            .pipe(map((response) => convertMesApiResponse(response.data)))
        )
        .then((response) => {

            if (hasErrorOnMesApiResponse(response)) {
                throw new ConflictException(`${response['MES_ERROR']}`);
            }

            return String(response);
        })
        .catch((error: AxiosError) => {
            throw new HttpException(error?.response?.data, error?.response?.status);
        });
    }

    async getWorkOrderInfo(work_order_number: number): Promise<WorkOrderInterface> {

        return await firstValueFrom(
                this.httpService.get<string>(this.isMocked ? `${this.mesApiUrls.get_work_order_info}` : '', { params: {
                    name: 'GET_SSD_TEST_INFO',
                    value: `IN_WO:${work_order_number}`
                }})
                .pipe(map((response) => convertMesApiResponse(response.data)))
                .pipe(map((response) => {

                    if (hasErrorOnMesApiResponse(response)) {
                        throw new ConflictException(`${response['MES_ERROR']}`);
                    }

                    return {
                        work_order_number: work_order_number,
                        model_name: response["MODEL"],
                        rdt_time: response["RDT_TIME"],
                        fw: response["FW"],
                        customer: response["CUSTOMER_NAME"],
                        pn3: response["PN3"]
                    }
                }))
        )
        .catch((error: AxiosError) => {
            throw new HttpException(error?.response?.data, error?.response?.status);
        });
    }

    async getWorkOrderAndSerialByNumber(serial_number: string) {
      return this.workOrderSerialRepository.createQueryBuilder('workorder_serial')
      .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
      .leftJoinAndSelect('workorder_serial.serial', 'serial')
      .where('serial.serial_number = :serial_number', { serial_number: serial_number })
      .getOne();
    } 

    async createSerialException(createSerialExceptionDto: CreateSerialExceptionDto) {
        const { serial_numbers } = createSerialExceptionDto;

        const serialExceptionsToSave = await Promise.all(
            serial_numbers.map(async (serial_number) => {
                const workorder_serial = await this.getWorkOrderAndSerialByNumber(serial_number);

                if (!workorder_serial) {
                    throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND, `Serial não encontrado`, CodeObject.SERIAL));
                }

                const testedSerial = await this.travelCardService.testedSerial(serial_number);

                if (!testedSerial) {
                    throw new BadRequestException(new ErroResponse(CodeError.NOT_TEST, `Serial ainda não foi testado!`, CodeObject.SERIAL));
                }

                if (!testedSerial.status) {
                    throw new ConflictException(new ErroResponse(CodeError.IS_REPROVED, `Serial reprovado!`, CodeObject.SERIAL));
                }

                let serial_exception_obj = {
                    workorder_serial_id: workorder_serial.workorder_serial_id,
                    serial_exception_created_at: getDateTimeWithTimezone()
                };

                let serial_exception = await this.getSerialExceptionBySerial(serial_number);

                if (!serial_exception) {
                    serial_exception = this.serialExceptionRepository.create(serial_exception_obj);
                }
                
                serial_exception.serial_exception_resent = false;

                return serial_exception;
            })
        );
        return this.serialExceptionRepository.save(serialExceptionsToSave);
    }

    async changeStatusSerialException(serial_number: string, status: boolean) {
        const serial_exception = await this.getSerialExceptionBySerial(serial_number);

        if (!serial_exception) {
            throw new BadRequestException(new ErroResponse(CodeError.NOT_TEST, 'Serial {[serial_number]} ainda não foi testado!', CodeObject.SERIAL));
        }

        serial_exception.serial_exception_resent = status;
        return this.serialExceptionRepository.save(serial_exception);
    }

    async getSerialExceptionBySerial(serial_number: string) {
        return await this.serialExceptionRepository.createQueryBuilder('serial_exception')
        .leftJoinAndSelect('serial_exception.workorder_serial', 'workorder_serial')
        .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
        .leftJoinAndSelect('workorder_serial.serial', 'serial')
        .andWhere('serial.serial_number = :serial_number', { serial_number: serial_number })
        .getOne();
    }

    async getAllSerialExceptions(filter: FilterSerialException): Promise<Pagination<SerialExceptionEntity> | SerialExceptionEntity[]> {
        const { search, resent, page, sort } = filter;

        const queryBuilder = this.serialExceptionRepository.createQueryBuilder('serial_exception')
        .leftJoinAndSelect('serial_exception.workorder_serial', 'workorder_serial')
        .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
        .leftJoinAndSelect('workorder_serial.serial', 'serial')
        .orderBy('serial_exception.serial_exception_id', sort === 'ASC' ? 'ASC' : 'DESC');

        if (resent) {
            queryBuilder
            .andWhere('serial_exception.serial_exception_resent = :resent', { resent: resent })
        }

        if (search) {
            queryBuilder
            .andWhere('serial.serial_number = :search', { search })
        }

        if (!page) {
            return queryBuilder.getMany();
        }

        return await paginate<SerialExceptionEntity>(queryBuilder, filter);
    }
}
