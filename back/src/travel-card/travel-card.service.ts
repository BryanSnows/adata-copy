import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CabinetService } from 'src/cabinet/cabinet.service';
import { MstService } from 'src/mst/mst.service';
import { SerialService } from 'src/serial/serial.service';
import { CachedProcessInterface, CachedSlots } from 'src/shared/interfaces/cached-process.interface';
import { WorkOrderInterface } from 'src/shared/interfaces/work-order.interface';
import { Repository } from 'typeorm';
import { FpyFilterDto } from './dtos/filter-fpy.dto';
import { FilterTravelCardDto } from './dtos/filter-travel-card.dto';
import { TravelCardEntity } from './entities/travel-card.entity';
import { WorkOrderService } from 'src/work-order/work-order.service';
import { WorkOrderSerialEntity } from './entities/workorder-serial.entity';
import { CreateWorkOrderSerialDto } from './dtos/create-workorder-serial.dto';
import { SerialEntity } from 'src/serial/entities/serial.entity';
import { ErroResponse } from 'src/common/error-response';
import { CodeError, CodeObject } from 'src/common/Enums';
import { RedisService } from 'src/config/cache/redis.service';

@Injectable()
export class TravelCardService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectRepository(TravelCardEntity)
        private readonly travelCardRepository: Repository<TravelCardEntity>,
        @InjectRepository(WorkOrderSerialEntity)
        private readonly workOrderSerialRepository: Repository<WorkOrderSerialEntity>,
        private readonly workOrderService: WorkOrderService,
        private readonly serialService: SerialService,
        private readonly cabinetService: CabinetService,
        private readonly mstService: MstService,
        private readonly redisService: RedisService,
    ) {}

    private processes_queue_prefix = 'processes-queue';

    async createTravelCard(work_order: WorkOrderInterface, cabinet_name?: string, mst_name?: string) {
      
        if (!work_order) {
            throw new NotFoundException('Work Order não encontrada!');
        }

        let cached_work_order = await this.cacheManager.get<CachedProcessInterface>(`adata:${this.processes_queue_prefix}:${work_order.work_order_number}`);

        let registered_work_order = await this.workOrderService.getWorkOrderByNumber(cached_work_order.work_order.work_order_number);

        if (!registered_work_order) {
          registered_work_order = await this.workOrderService.createWorkOrder(cached_work_order.work_order);
        }

        const serials = await Promise.all(
          cached_work_order.slots.map(async (slot) => {
            const registered_serial = await this.serialService.getByNumber(slot.serial_number);
  
            if (registered_serial) {
              return {
                serial_id:  registered_serial.serial_id,
                serial_number: registered_serial.serial_number
              }
            }
  
            return {
              serial_id:  undefined,
              serial_number: slot.serial_number
            }
          })
        );

        const registered_serials = await this.serialService.create(serials);

        const workorder_serials_to_register = registered_serials.map((serial: SerialEntity) => {
          return {
            work_order_id: registered_work_order.work_order_id,
            serial_id: serial.serial_id
          }
        });

        const registered_workorder_serial = await this.createWorkOrderSerial(workorder_serials_to_register);

        let filtered_slots: CachedSlots[] = cached_work_order.slots;

        if (cabinet_name) {
          filtered_slots = cached_work_order.slots.filter(slot => slot.cabinet_name === cabinet_name);
        }

        if (mst_name) {
          filtered_slots = cached_work_order.slots.filter(slot => slot.mst_name === mst_name);
        }

        let travelCardsToRegister = await Promise.all(
          filtered_slots.map(async (slot) => {
            const mst = await this.mstService.findByName(slot.mst_name);
            const cabinet = await this.cabinetService.findByName(slot.cabinet_name);
            return {
              ...slot,
              workorder_serial_id: registered_workorder_serial.find((workorder_serial) => workorder_serial.serial.serial_number === slot.serial_number).workorder_serial_id,
              cabinet_id: cabinet.cabinet_id,
              mst_id: slot.mst_name ? mst.mst_id : null,
              created_at: slot.created_at
            }
            })
        );

        return this.travelCardRepository.save(travelCardsToRegister);
    }

    async createWorkOrderSerial(createWorkOrderSerialDto: CreateWorkOrderSerialDto[]) {
      const registeredWorkOrderSerial = await this.workOrderSerialRepository.save(createWorkOrderSerialDto);

      return await Promise.all(
        registeredWorkOrderSerial.map(async (workorder_serial) => {
          return await this.getWorkOrderAndSerialById(workorder_serial.serial_id);
        })
      );

    }

    async getWorkOrderAndSerialById(serial_id: number) {
      return this.workOrderSerialRepository.createQueryBuilder('workorder_serial')
      .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
      .leftJoinAndSelect('workorder_serial.serial', 'serial')
      .where('workorder_serial.serial_id = :serial_id', { serial_id: serial_id })
      .getOne();
    }

    async getLastFailedSerial(serial_number: string) {
        return this.travelCardRepository.createQueryBuilder('travel_card')
        .leftJoinAndSelect('travel_card.workorder_serial', 'workorder_serial')
        .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
        .leftJoinAndSelect('workorder_serial.serial', 'serial')
        .where('serial.serial_number = :serial_number', { serial_number: serial_number })
        .andWhere('travel_card.situation_id = :situation_id', { situation_id: 4 })
        .andWhere('travel_card.status = :status', { status: 0 })
        .orderBy('travel_card.travel_card_id', 'DESC')
        .getOne();
    }

    async testedSerial(serial_number: string): Promise<TravelCardEntity> {
        return await this.travelCardRepository.createQueryBuilder('travel_card')
        .leftJoinAndSelect('travel_card.mst', 'mst')
        .leftJoinAndSelect('travel_card.workorder_serial', 'workorder_serial')
        .leftJoinAndSelect('workorder_serial.work_order', 'work_order')
        .leftJoinAndSelect('workorder_serial.serial', 'serial')
        .orderBy('travel_card.created_at', 'DESC')
        .where('serial.serial_number = :serial_number', { serial_number: serial_number })
        .andWhere('travel_card.situation_id = :situation_id', { situation_id: 4 })
        .getOne();
    }

    async findAll(filter: FilterTravelCardDto): Promise<any | Pagination<TravelCardEntity>> {
    
        const { serial_number, start_date, end_date} = filter

        const queryBuilder = this.travelCardRepository.createQueryBuilder('travel_card') 
        .leftJoinAndSelect('travel_card.workorder_serial', 'workorder_serial') 
        .leftJoinAndSelect('workorder_serial.serial', 'serial') 
        .leftJoinAndSelect('travel_card.cabinet', 'cabinet')
        .leftJoinAndSelect('travel_card.mst', 'mst')
        .where('travel_card.situation_id = :situation_id', {situation_id : 4})
        .orderBy('travel_card.travel_card_id', 'DESC')

        if (start_date > end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A data inicial não pode ser maior que a data final`,  CodeObject.TRAVEL))
        }

        if (start_date && !end_date || !start_date && end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de data`,  CodeObject.TRAVEL))
        }

        
        if (start_date || end_date) {
          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          
          if (start_date || end_date) {
            if (start_date) {
              queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) >= :start_date", { start_date });
            }
            if (end_date) {
              queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) <= :end_date", { end_date });
            }
            queryBuilder.andWhere('travel_card.situation_id = :situation_id', { situation_id: 4 });
          }
        }

        if (serial_number) {
            queryBuilder
            .andWhere('serial.serial_number like :serial_number', { serial_number: `%${serial_number}%` })
          };
  
       
        filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;
    
        return  await paginate<TravelCardEntity>(queryBuilder, filter);  
      }

      async findAllMergedTravel(filter: FilterTravelCardDto): Promise<any | Pagination<TravelCardEntity>> {

        const { serial_number, start_date, end_date } = filter
    
        const queryBuilder = this.travelCardRepository.createQueryBuilder('travel_card')
          .leftJoinAndSelect('travel_card.workorder_serial', 'workorder_serial')
          .leftJoinAndSelect('workorder_serial.serial', 'serial')
          .leftJoinAndSelect('travel_card.cabinet', 'cabinet')
          .leftJoinAndSelect('travel_card.mst', 'mst')
          .where('travel_card.situation_id = :situation_id', { situation_id: 4 })
          .orderBy('travel_card.travel_card_id', 'DESC')
    
        if (start_date > end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER, `A data inicial não pode ser maior que a data final`, CodeObject.TRAVEL))
        }
    
        if (start_date && !end_date || !start_date && end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER, `Selecione um intervalo de data`, CodeObject.TRAVEL))
        }
    
    
        if (start_date || end_date) {
          if (start_date) {
            queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) >= :start_date", { start_date });
          }
          if (end_date) {
            queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) <= :end_date", { end_date });
          }
          queryBuilder.andWhere('travel_card.situation_id = :situation_id', { situation_id: 4 });
        }
    
    
        if (serial_number) {
          queryBuilder
            .andWhere('serial.serial_number like :serial_number', { serial_number: `%${serial_number}%` })
        }
    
        filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;
    
        const partialResult = await paginate<TravelCardEntity>(queryBuilder, filter);
        
        let result = []
        
        for (let data of partialResult.items) {
    
           data.test_serial_count
    
          const propertie_of_seriais = await this.findBySerialTwo(data.workorder_serial.serial.serial_number, data.test_serial_count)          
    
          result.push(data)

          data.workorder_serial.serial['situations'] = propertie_of_seriais
    
    
        }
    
        return result
    
    
      }
   
      async getFpyForMst(filter: FpyFilterDto): Promise<TravelCardEntity[]>{
        const { mst_id, start_date, end_date } = filter;
        const countHistory =  this.travelCardRepository.createQueryBuilder('travel_card')
        .leftJoinAndSelect('travel_card.mst', 'mst')
        .where('travel_card.situation_id = :situation_id', {situation_id : 4})
        .andWhere('mst.mst_status = :mst_status', {mst_status : 1});

        if (mst_id) {
          countHistory
          .andWhere('travel_card.mst_id = :mst_id', {mst_id})
        }

        if (start_date > end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A data inicial não pode ser maior que a data final`,  CodeObject.TRAVEL))
        }

        if (start_date && !end_date || !start_date && end_date) {
          throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de data`,  CodeObject.TRAVEL))
        }

        if (start_date || end_date) {
          if (start_date) {
            countHistory.andWhere("CONVERT(date, CAST(created_at AS DATE)) >= :start_date", { start_date });
          }
          if (end_date) {
            countHistory.andWhere("CONVERT(date, CAST(created_at AS DATE)) <= :end_date", { end_date });
          }
          countHistory.andWhere('travel_card.situation_id = :situation_id', { situation_id: 4 });
        }

        let finalResult =  await countHistory.getMany();
        let final = [];
        final.push(
          finalResult.reduce((acc, cur) => {
        let date = (new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric',}).format(new Date(cur.created_at)))
            
            if (!acc[date]) {
              acc[date] = {
                mst: [cur.mst_id],
                day: date,  
              }
            } else {
              acc[date].mst.push(cur.mst_id)
            } 
            return acc;
          }, {}),
        );
        final = final.map(item =>  { return Object.values(item); })[0]

        let history = [];
        history.push(
          finalResult.reduce((acc, cur) => {
            let arr = final.map((item) => {
              let firstApproved = finalResult.filter((items) => items.mst_id===cur.mst_id && items.test_serial_count===1 && items.status===true && (new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric',}).format(items.created_at))===item.day).length
              const hist = item.mst.filter((items) => items===cur.mst_id)
              if (hist.length > 0) {
                return { 
                  mst: cur.mst.mst_name, 
                  day: item.day,
                  firstApproved,
                  totalTested: hist.length,                    
                  fpy: Number(((firstApproved/hist.length)*100).toFixed(2))
                }
              }
            })
            if (!acc[cur.mst_id]) {
              acc[cur.mst_id] = {
                 mst: cur.mst.mst_name,
                 firstApproved: (cur.test_serial_count === 1 && cur.status === true ? 1 : 0 ),
                 totalTested: (cur.test_serial_count ? 1 : 0 ),
                 fpy: (cur.test_serial_count === 1 && cur.status === true ? 1 : 0 ) === 0 ? 0 : 100,
                 history: arr.filter(object => object !== undefined)
              }
            } else {
              acc[cur.mst_id].firstApproved += cur.test_serial_count === 1 && cur.status === true ? 1 : 0
              acc[cur.mst_id].totalTested += cur.test_serial_count ? 1 : 0
              acc[cur.mst_id].fpy = (acc[cur.mst_id].firstApproved / acc[cur.mst_id].totalTested).toFixed(4) 
              acc[cur.mst_id].fpy = Number(((acc[cur.mst_id].fpy)*100).toFixed(2))
              acc[cur.mst_id].history = arr.map((items) => items).filter(object => object !== undefined)
            }
            return acc; 
          }, {}),
        );

        history = history.map(item => { return Object.values(item) })[0]
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: 'base'});
        
        return history.sort((a, b) => {
          return collator.compare(b.fpy, a.fpy)
        })

    }

      async findBySerial(serial: string){
        return await this.travelCardRepository.createQueryBuilder('travel_card_serial')
        .leftJoinAndSelect('travel_card_serial.workorder_serial', 'workorder_serial')
        .leftJoinAndSelect('travel_card_serial.cabinet', 'cabinet')
        .leftJoinAndSelect('travel_card_serial.mst', 'mst')
        .leftJoinAndSelect('workorder_serial.serial', 'serial')
        .where('serial.serial_number = :serial_number', {serial_number: serial })
        .select(['travel_card_serial.situation_id', 
        'travel_card_serial.created_at',  
        'serial.serial_number', 
        'mst.mst_name', 
        'travel_card_serial.test_serial_count'])
        .orderBy('travel_card_serial.created_at', 'ASC')
        .getMany()
      }

      async findBySerialTwo(serial: string, test_serial_count: number) {
        return await this.travelCardRepository.createQueryBuilder('travel_card_serial')
          .leftJoinAndSelect('travel_card_serial.workorder_serial', 'workorder_serial')
          .leftJoinAndSelect('travel_card_serial.cabinet', 'cabinet')
          .leftJoinAndSelect('travel_card_serial.mst', 'mst')
          .leftJoinAndSelect('workorder_serial.serial', 'serial')
          .where('serial.serial_number = :serial_number', { serial_number: serial })
          .andWhere('travel_card_serial.test_serial_count = :test_serial_count', {test_serial_count: test_serial_count})
          .select(['travel_card_serial.situation_id',
            'travel_card_serial.created_at',
            'serial.serial_number',
            'mst.mst_name',
            'travel_card_serial.test_serial_count'])
          .orderBy('travel_card_serial.created_at', 'ASC')
          .getMany()
      }

      async clearTravelCard() {
        const travelCards = await this.travelCardRepository.createQueryBuilder('travel_card').getMany();
        return travelCards.map(async (travel_card) => {
           return await this.travelCardRepository.delete({ travel_card_id: travel_card.travel_card_id });
        });
      }
 }
