import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateSlotDefectDto } from './dtos/create-slot-defect.dto';
import { FilterSlot } from './dtos/filter-slot-defect.dto';
import { UpdateStatusSlotDefectDto } from './dtos/update-status-slot-defect.dto';
import { SlotDefectEntity } from './entities/slot-defect.entity';
import { getDateTimeWithTimezone } from 'src/shared/helpers/date-time-with-timezone.helper';
import { CabinetById } from './dtos/filter-cabinetById.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ErroResponse } from 'src/common/error-response';
import { CodeError, CodeObject } from 'src/common/Enums';
import { CabinetService } from 'src/cabinet/cabinet.service';

@Injectable()
export class SlotDefectService { 
    constructor(
        @InjectRepository(SlotDefectEntity)
        private readonly slotDefectRepository: Repository<SlotDefectEntity>,
        private readonly cabinetService: CabinetService,
    ) {}

    async create({ slot_defects }: CreateSlotDefectDto, isAutomated: boolean) {
        const slotDefectsToSave = await Promise.all(
            slot_defects.map(async (slot_defect) => {

                let cabinet_name = String(slot_defect.cabinet_name);
                let position = Number(slot_defect.position);

                if (slot_defect.user_name.trim() == '' || slot_defect.user_name== undefined) {
                    throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O nome do usuário não pode estar vazio`, CodeObject.NAME))
                }

                if (!cabinet_name) {
                    throw new BadRequestException(new ErroResponse(CodeError.NOT_FOUND, 'Painel precisa ser informado na requisição', CodeObject.CABINET));
                }

                if (position > 360  || position < 1) {
                    throw new BadRequestException(new ErroResponse(CodeError.NOT_FOUND, 'Posição não Existe', CodeObject.POSITION));
                }

                const isRegisteredCabinetName = await this.cabinetService.findByName(cabinet_name);

                if (!isRegisteredCabinetName) {
                    throw new NotFoundException(new ErroResponse(CodeError.IS_REGISTERED, `Painel: ${cabinet_name} não encontrado!`, CodeObject.SLOT_DEFECT));
                }

                let slot = await this.getByCabinetNameAndPosition(cabinet_name, position);

                if (!slot) {
                    slot = this.slotDefectRepository.create(slot_defect);
                }

                const isRegistered = await this.cabinetService.findAvailableCabinetByName(cabinet_name);

                if (!isRegistered) {
                    throw new BadRequestException('Painel não existe ou desativado');
                }

                if (!isAutomated) {
                    if (slot.count === 3 && slot.status === false) {
                        throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED, 'Defeito já Registrado', CodeObject.SLOT_DEFECT));
                    }
                    
                    slot.count = 3;
                    slot.status = false;                    
                } 
                else {
                    slot.status =  slot_defect.status
                    slot.count = slot_defect.count
                }

                slot.cabinet_id = isRegistered.cabinet_id;
                slot.created_at = getDateTimeWithTimezone();
                return slot;
            })
        );
        return this.slotDefectRepository.save(slotDefectsToSave);
    }

    async listItems(items, pageActual, limitItems, filter:FilterSlot){  
        const { page, limit } =  filter
        let result = [];  
        let totalPage = Math.ceil( items.length / limitItems );    
        let count = ( pageActual * limitItems ) - limitItems;    
        let delimiter = count + limitItems;        
         if(pageActual <= totalPage){        
             for(let i=count; i<delimiter; i++){            
                if(items[i] != null){            
                    result.push(items[i]);            
                }            
                 count++;        
                }    
            } if (items.length===0) {
                return {
                    message: "Sem Dados Cadastrados",
                    data: result,
                    "meta": {
                        "totalItems": items.length,
                        "itemCount":  result.length,
                        "itemsPerPage": Number(limit),
                        "totalPages": totalPage,
                        "currentPage": Number(page)
                    }   
                }
            }else return {
                data: result,
                "meta": {
                    "totalItems": items.length,
                    "itemCount":  result.length,
                    "itemsPerPage": Number(limit),
                    "totalPages": totalPage,
                    "currentPage": Number(page)
                }
            }
        }
    ;  

    async getAll(filter: FilterSlot): Promise<any|Pagination<SlotDefectEntity>>{

        const { search, page, limit } =  filter
        const queryBuilder = this.slotDefectRepository.createQueryBuilder('slot_defect')
        .leftJoinAndSelect('slot_defect.cabinet', 'cabinet')
        .where('slot_defect.status = :status', {status: 0})

        if (search) {
            queryBuilder
            .andWhere('cabinet.cabinet_name like :cabinet_name', {cabinet_name: `%${search}%`})
        }


        let slot = await queryBuilder.getMany()
       
        let final = [];

        final.push(
            slot.reduce((accumulator, current) => {             
            if(!accumulator[current.cabinet_id]){
              accumulator[current.cabinet_id] = {
              id: current.cabinet.cabinet_id,
              cabinet: current.cabinet.cabinet_name,
              count: 1,
              position: [current.position]     
              }
        } else {
            accumulator[current.cabinet_id].position.push(current.position)
            accumulator[current.cabinet_id].count = accumulator[current.cabinet_id].position.length
        }
            return accumulator
        }, {}));
    
    
        final = final.map((item) => {return Object.values(item)})[0];  
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'});
          
        final = final.sort((a, b) => {
            return collator.compare(a.cabinet, b.cabinet)
          }) 

        return this.listItems(final, page, limit, filter)
        
    }

    async findByCabinet(filter: CabinetById): Promise<any | Pagination<SlotDefectEntity>> {
        const {cabinet_name, search} = filter
        const queryBuilder = this.slotDefectRepository.createQueryBuilder('cabinet_by_id')
        .leftJoinAndSelect('cabinet_by_id.cabinet', 'cabinet')
        .where('cabinet_by_id.status = :status', {status: 0})
        .orderBy('cabinet_by_id.position', 'ASC')

        if (cabinet_name) {
            queryBuilder
            .andWhere('cabinet.cabinet_name = :cabinet_name', {cabinet_name})
        }

        if (search) {
            queryBuilder
            .andWhere('cabinet_by_id.position = :position', {position: search})
        }


        filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;
        const {items, meta } = await paginate<SlotDefectEntity>(queryBuilder, filter)
        
        if (meta.totalItems === 0) {
            return {
              message: "Sem Dados Cadastrados",
              items,
              meta
            }
        }

        return await paginate<SlotDefectEntity>(queryBuilder, filter)

        
    }

    async getByCabinetAndPosition(cabinet_id: number, position: number)  {
        return this.slotDefectRepository.createQueryBuilder('slot_defect')
        .leftJoinAndSelect('slot_defect.cabinet', 'cabinet')
        .where('slot_defect.cabinet_id = :cabinet_id', { cabinet_id: cabinet_id })
        .andWhere('slot_defect.position = :position', { position: position })
        .getOne();
    }

    async getByCabinetNameAndPosition(cabinet_name: string, position: number)  {
        return this.slotDefectRepository.createQueryBuilder('slot_defect')
        .leftJoinAndSelect('slot_defect.cabinet', 'cabinet')
        .where('cabinet.cabinet_name = :cabinet_name', { cabinet_name: cabinet_name })
        .andWhere('slot_defect.position = :position', { position: position })
        .getOne();
    }

    async getDefectsByCabinet(cabinet_id: number)  {
        return this.slotDefectRepository.createQueryBuilder('slot_defect')
        .leftJoinAndSelect('slot_defect.cabinet', 'cabinet')
        .where('slot_defect.cabinet_id = :cabinet_id', { cabinet_id: cabinet_id })
        .andWhere('slot_defect.status = :status', { status: 0 })
        .getMany();
    }

    async updateStatus(cabinet_id: number, { position }: UpdateStatusSlotDefectDto) {
        const slot_defect = await this.getByCabinetAndPosition(cabinet_id, position);

        if (!slot_defect) {
            throw new NotFoundException("Armário e/ou posição não contém defeitos no slot!");
        }
        
        slot_defect.status = !slot_defect.status;

        if (slot_defect.status === true) {
            slot_defect.count = 0;
        }
        
        return this.slotDefectRepository.save(slot_defect);
    }
}