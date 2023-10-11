import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CodeError, CodeObject } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Repository } from 'typeorm';
import { FpyOccupationMstDto } from './dto/filter-occupationMst.dto';
import { FilterProductivityDateMst } from './dto/filter-productivity-date';
import { FilterProductivityHourMst } from './dto/filter-productivity-hour-mst';
import { FilterSnListDto } from './dto/filter.dto';
import { SnList } from './entities/sn-list.entity';

@Injectable()
export class SnListService {

  constructor(
    @InjectRepository(SnList)
     private readonly snListRepository: Repository<SnList>,
  ) { }


  
  async findAll(filter: FilterSnListDto): Promise<any| Pagination<SnList>> {
    const {serial_number, created_at, mst_name, status, start_hour, end_hour} =  filter

    const queryBuilder = this.snListRepository.createQueryBuilder('sn_list_history')
 
    if (created_at) {
      queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATETIME2)) = :created_at", { created_at: created_at });
    };

    if (mst_name) {
      queryBuilder
      .andWhere('sn_list_history.mst_name = :mst_name', { mst_name })
    }

    if (serial_number) {
      queryBuilder
      .andWhere('sn_list_history.serial_number like :serial_number', {serial_number: `%${serial_number}%`})
    }

    if (status) {
      queryBuilder
      .andWhere('sn_list_history.status = :status', {status}) 
    }

    if (start_hour && !end_hour || !start_hour && end_hour) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de hora`,  CodeObject.SN_LIST))
    }

    if (start_hour || end_hour) {
      if (start_hour) {
        queryBuilder.andWhere("DATEPART(HOUR, created_at) >= :start_hour", { start_hour });
      }
      if (end_hour) {
        queryBuilder.andWhere("DATEPART(HOUR, created_at) <= :end_hour", { end_hour });
      }
    };

    if (start_hour > end_hour) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A hora inicial não pode ser maior que a hora final`,  CodeObject.SN_LIST))
    }

    queryBuilder
    .andWhere((qb) => {
    const subQuery = qb.subQuery()
      .select('MAX(sh.created_at)')
      .from('sn_list_history', 'sh')
      .where('sh.serial_number = sn_list_history.serial_number')
      .getQuery();
      return `sn_list_history.created_at = ${subQuery}`;
    });
    
    filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;
    
    let {items, meta}= await paginate<SnList>(queryBuilder, filter)

    if(meta.totalItems === 0) {
      return {
        message : 'Sem Dados Cadastrados',
        items, 
        meta
      }
    } 

   return await paginate<SnList>(queryBuilder, filter)
  }


  findBySerial(serial: string): Promise<SnList[]> {
    return this.snListRepository.find({where: {serial_number: serial}})
  }

  async findApprovedSerialNumber(serial_number: string) {
    return this.snListRepository.createQueryBuilder('sn_list')
    .where('sn_list.serial_number = :serial_number', { serial_number: serial_number })
    .andWhere('sn_list.status = :status', { status: 1 })
    .getOne();
  }

  async getProductivityHour(filter: FilterProductivityHourMst): Promise<any>{
    
    const {mst_name, created_at, start_hour, end_hour} = filter
    const queryBuilder = this.snListRepository.createQueryBuilder('sn_list')

    if (mst_name) {
      queryBuilder
      .andWhere('sn_list.mst_name = :mst_name', { mst_name })
    }

    
    if (created_at) {
      queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATETIME2)) = :created_at", { created_at: created_at });
    };

    if (start_hour || end_hour) {
      if (start_hour) {
        queryBuilder.andWhere("DATEPART(HOUR, created_at) >= :start_hour", { start_hour });
      }
      if (end_hour) {
        queryBuilder.andWhere("DATEPART(HOUR, created_at) <= :end_hour", { end_hour });
      }
    }

    if (start_hour > end_hour) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A hora inicial não pode ser maior que a hora final`,  CodeObject.SN_LIST))
    }

    if (start_hour && !end_hour || !start_hour && end_hour) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de hora`,  CodeObject.SN_LIST))
    }

    let sn_list = await queryBuilder.getMany();
    let final = []

    final.push(
      sn_list.reduce((accumulator, current) => {
       
        const date = current.created_at.getUTCHours()     
        if(!accumulator[date]) {
          accumulator[date] = {
            hour_test: date,  
            seriais_aproved: current.status ? 1 : 0,
            seriais_reproved: current.status ? 0 : 1,
          }
        } else {
          accumulator[date].seriais_aproved += current.status ? 1 : 0
          accumulator[date].seriais_reproved += current.status ? 0 : 1
        }        
        return accumulator
      }, {})
    )

    final = final.map((item) => {
      return Object.values(item)
    })[0];    
    
    return final;
  }

  async getProductivityMst(filter: FilterProductivityDateMst): Promise<SnList[]>{

    const {mst_name, start_date, end_date} = filter

    const queryBuilder = this.snListRepository.createQueryBuilder('sn_list')
    .orderBy('sn_list.mst_name', 'ASC')

    
    
    if (mst_name) {
      queryBuilder
      .andWhere('sn_list.mst_name = :mst_name', { mst_name })
    }

    if (start_date > end_date) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A data inicial não pode ser maior que a data final`,  CodeObject.SN_LIST))
    }

    if (start_date && !end_date || !start_date && end_date) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de data`,  CodeObject.SN_LIST))
    }

    if (start_date || end_date) {
      if (start_date) {
        queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) >= :start_date", { start_date });
      }
      if (end_date) {
        queryBuilder.andWhere("CONVERT(date, CAST(created_at AS DATE)) <= :end_date", { end_date });
      }
    };


   

    let sn_list = await queryBuilder.getMany()
    let final = [];

    final.push(
      sn_list.reduce((accumulator, current) => {
        let data = new Date(current.created_at);    
        let date = (new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric',}).format(data))              
        if(!accumulator[current.mst_name]){
          accumulator[current.mst_name] = {
          mst: current.mst_name,
          aprovedSeriais: current.status === true ? 1 : 0,
          reprovedSeriais: current.status === true ? 0 : 1, 
          totalSeriais: 1
        
          }
    } else {
      accumulator[current.mst_name].aprovedSeriais += current.status === true ? 1 : 0
      accumulator[current.mst_name].reprovedSeriais += current.status === false ? 1 : 0 
      accumulator[current.mst_name].totalSeriais = accumulator[current.mst_name].aprovedSeriais + accumulator[current.mst_name].reprovedSeriais

    }
        return accumulator
    }, {}));


    final = final.map((item) => {
     return Object.values(item)
     })[0];    
  
    return final;    
  }


  async group_data_occupation(filter: FpyOccupationMstDto): Promise<any|SnList[]> {

    const { mst_name} = filter
    const countHistory =  this.snListRepository.createQueryBuilder('sn_list')
    .orderBy('sn_list.mst_name', 'ASC')
    
    if (mst_name) {
      countHistory
      .andWhere('sn_list.mst_name = :mst_name', {mst_name})
    }

    let newList = []
    
    let tags = []
    

    let allList = await countHistory.getMany();


    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'});
    
      allList = allList.sort((a, b) => {
      return collator.compare(a.mst_name, b.mst_name)
    })


    const mstAllTags = allList.map(data => {
      return data.mst_name
    })

    for (let itemTag of mstAllTags) {
      
      const isMatch = tags.some((el, i) => {
        return itemTag === el
      })
      
      if (tags.length === 0) {
        tags.push(itemTag)
      } else {
        if (!isMatch) {
          tags.push(itemTag)
        }
      }
      
    }
    
    for (let itemTag of tags) {           

      let Mst = {}
      
     
      const partialRes = await this.getData(itemTag, filter)
      const partialCount = await partialRes.reduce((acc: number, item: any) => (acc + item.quantity), 0)     

      
      Mst = {
        quantity_without_cappacity_total: partialCount,
        cabinet_history: partialRes,
      }

      newList.push(Mst) 
 
    }    



    return {
      MST: newList
    }

  }


  async getData(mst: string, filter: FpyOccupationMstDto) {
    const { start_date, end_date} = filter
    const TOTAL_ITEMS = 360
    const query_one = await this.snListRepository.query(`
    SELECT mst_name,
    cabinet_name,
    CASE
        WHEN COUNT(h.created_at) < ${TOTAL_ITEMS} THEN 1
        WHEN COUNT(h.created_at) = ${TOTAL_ITEMS} THEN 0
    END AS quantity,
    created_at
    FROM MST_ADATA.dbo.SN_LIST_HISTORY h
    WHERE mst_name='${mst}'
    GROUP BY mst_name, cabinet_name, created_at
    ORDER BY created_at DESC
`);

    let final_result = []
    
    for (let item of query_one) {

      let temp = {
        mst_name: item.mst_name,        
        cabinet: item.cabinet_name,
        quantity: item.quantity,
        created_at: item.created_at
      }


      final_result.push(temp)


    }

    if (start_date > end_date) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`A data inicial não pode ser maior que a data final`,  CodeObject.SN_LIST))
    }
    if (start_date && !end_date || !start_date && end_date) {
      throw new NotFoundException(new ErroResponse(CodeError.INVALID_DATA_RANGER,`Selecione um intervalo de data`,  CodeObject.SN_LIST))
    }

    if (start_date || end_date) {
      final_result = final_result.filter((history) => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        
        end.setUTCHours(23, 59, 59);
    
        if (history.created_at >= start && history.created_at <= end) {
          return history;
        }
      });
    }
    
    return final_result;
    
  }

  async clearSnList() {
    const snLists = await this.snListRepository.createQueryBuilder('sn_list').getMany();
    return snLists.map(async (sn_list) => {
       return await this.snListRepository.delete({ sn_list_history_id: sn_list.sn_list_history_id });
    });
  }

}
