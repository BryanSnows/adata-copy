import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CodeError, CodeObject, ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Validations } from 'src/common/validations';
import { RedisService } from 'src/config/cache/redis.service';
import { CachedProcessInterface } from 'src/shared/interfaces/cached-process.interface';
import { Repository } from 'typeorm';
import { CreateMstDto } from './dto/create-mst.dto';
import { FilterMstDto } from './dto/filter-mst.dto';
import { UpdateMstDto } from './dto/update-mst.dto';
import { MstEntity } from './entities/mst.entity';

@Injectable()
export class MstService {
  constructor(
    @InjectRepository(MstEntity)
    private readonly mstRepository: Repository<MstEntity>,
    private readonly redisService: RedisService,
  ) {}
  async create(createMstDto: CreateMstDto): Promise<any | MstEntity> {
    
    const { mst_name, mst_side } = createMstDto

    if(mst_name.trim() == '' || mst_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY, 'O campo não pode estar vazio',  CodeObject.MST))
    }

    if (mst_side === undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY, `O campo ${CodeObject.MST_SIDE} não pode estar vazio!`,  CodeObject.MST_SIDE))
    }

    const mst = this.mstRepository.create(createMstDto)

    mst.mst_status = true;

    mst.mst_name = mst_name.toUpperCase().trim()
    Validations.getInstance().validateWithRegex(
      mst.mst_name, 'mst_name',
      ValidType.NO_SPACE,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE,
      ValidType.MST_IS_NUMBER,
      ValidType.MST_DIFERENT_OF_ZERO
    )

    Validations.getInstance().validateWithRegex(
      String(mst.mst_side),
      ValidType.NO_MANY_SPACE,
      ValidType.IS_NUMBER,
    )

    Validations.getInstance().validateWithRegex(
      String(mst.mst_ip),
      ValidType.NO_MANY_SPACE,
    )

    Validations.getInstance().verifyLength(
      mst.mst_name, 'mst_name', 1, 10
    )

    mst.mst_name = 'MST '+ mst.mst_name

    const isRegistered = await this.findByName
    (mst.mst_name)

    if(isRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED, `${mst.mst_name} já cadastrada!`, CodeObject.MST))
    }
    
    const alreadyExist = await this.mstRepository.save(mst)
    return {
      message: 'Mst Cadastrada com sucesso',
      data: alreadyExist
    }
  }

  async findById(id: number): Promise<MstEntity> {
    return await this.mstRepository.findOne({where: {mst_id: id}})
  }

  async findByMstId(id: number): Promise<any | MstEntity> {
    const mst = await this.mstRepository.findOne({where: {mst_id: id}})
    const isRegistered = await this.findById(id)
    if(!isRegistered) {
      return {
        message: 'Sem msts Cadastradaos',
        items: []
      }
    }
  }

  

  async findByName(name: string): Promise<MstEntity> {
    return await this.mstRepository.findOne({where: {mst_name: name}})
  }

  async findByNameDifferentId(mst_id: number, mst_name: string): Promise<MstEntity>{
    return this.mstRepository.createQueryBuilder('mst')
    .where('mst.mst_id != :mst_id', {mst_id})
    .andWhere('mst.mst_name like :mst_name', {mst_name: `%${mst_name}%`})
    .getOne()
  }

  async findByNameId(mst_id: number, mst_name: string): Promise<MstEntity> {
    return this.mstRepository
    .createQueryBuilder('mst') 
    .where('mst.mst_id = :mst_id', {mst_id})
    .andWhere('mst.mst_name = mst_name', {mst_name: `%${mst_name}%`})
    .getOne();
  }

  async getAll(): Promise<MstEntity[]> {
    const msts = await this.mstRepository
    .createQueryBuilder('mst')
    .orderBy('mst.mst_name', 'ASC')
    .getMany();

    return this.orderMst(msts);
  }

  async findAll(filter: FilterMstDto): Promise<any | Pagination<MstEntity>> { 

    const { mst_status, search_name, mst_side } = filter 
    const queryBuilder = this.mstRepository.createQueryBuilder('mst') 
    .orderBy("CAST (REPLACE(mst.mst_name, 'MST ', '') AS INTEGER)", 'ASC');

    if(search_name) { 
      queryBuilder 
      .where('mst.mst_name like :mst_name', {mst_name: `%${search_name}%`}) 
    } 

    if(mst_status) { 
      queryBuilder 
      .andWhere('mst.mst_status = :mst_status', {mst_status}) 
    } 

     if (mst_side) {
      queryBuilder 
      .andWhere('mst.mst_side = :mst_side', { mst_side: mst_side }) 
    }

    filter.limit = filter.limit ?? (await queryBuilder.getMany()).length; 

    let {items, meta}= await paginate<MstEntity>(queryBuilder, filter) 

    if(meta.totalItems === 0) {
       return { message : 'Sem Msts Cadastrados', items, meta } 
    }

    return { items, meta }
 }

 async update(id: number, updateMstDto: UpdateMstDto): Promise< any | MstEntity> {
    
    const { mst_name } = updateMstDto
    
    if(mst_name.trim() == '' || mst_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY, 'O campo não pode estar vazio', CodeObject.MST))
    }

    const isRegistered = await this.findById(id)
    if(!isRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_FOUND, 'Nenhuma mst cadastrada', CodeObject.MST))
    }

    const mst = await this.mstRepository.preload({
      mst_id: id,
      ...updateMstDto
    })

    mst.mst_name = mst_name.toUpperCase().trim()

    Validations.getInstance().validateWithRegex(
      mst.mst_name, 
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE,
      ValidType.MST_IS_NUMBER,
      ValidType.MST_DIFERENT_OF_ZERO
    )
    Validations.getInstance().verifyLength(
      mst.mst_name, 'mst_name', 1, 10
    )
    mst.mst_name = 'MST '+ mst.mst_name

    Validations.getInstance().validateWithRegex(
      String(mst.mst_side),
      ValidType.NO_MANY_SPACE,
      ValidType.IS_NUMBER,
    )

    Validations.getInstance().validateWithRegex(
      String(mst.mst_ip),
      ValidType.NO_MANY_SPACE,
    )

    let mst_on_process = await this.redisService.getByKeyValueArray<CachedProcessInterface>('processes*', 'slots', 'mst_name', isRegistered.mst_name);

    if (mst_on_process) {
      throw new ConflictException(new ErroResponse(CodeError.IN_PROCESS, `${isRegistered.mst_name} não pode ser editada pois se encontra em processo na work order ${mst_on_process.work_order.work_order_number}`, CodeObject.MST))
    }

    const alreadyExist = await this.findByName(mst.mst_name);

    if(alreadyExist && alreadyExist.mst_id !== mst.mst_id) {
      throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,  `${mst.mst_name} já registrada!!`, CodeObject.MST))
    };

    await this.mstRepository.save(mst)

    const item = await this.findById(id)

    return {
      message: 'Mst atualizada com Sucesso',
      item: item
    }
  }

  async changeStatus(id: number): Promise<MstEntity> {
    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER, 'Id inválido', CodeObject.ID))
    }

    const mstSaved = await this.findById(id)

    if(!mstSaved) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_FOUND, 'Nenhuma mst cadastrada', CodeObject.MST))
    }

    const processes = await this.redisService.getArrayBykeyPath<CachedProcessInterface>('processes*');

    if (processes) {
      processes.forEach((process) => {
        process.slots.forEach(slot => {
          if (slot.mst_name === mstSaved.mst_name) {
            throw new BadRequestException(new ErroResponse(CodeError.IN_PROCESS, `Mst não pode ser desativada pois se encontra em processo na work order ${process.work_order.work_order_number}`, CodeObject.MST))
          }
        })
      });
    }

    const { mst_status: status } = mstSaved

    mstSaved.mst_status = status === true ? false : true

    return this.mstRepository.save(mstSaved)
  }

  orderMst(items: MstEntity[]): MstEntity[] {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'});
    
    return items.sort((a, b) => {
      return collator.compare(a.mst_name, b.mst_name)
    })
  }
}
