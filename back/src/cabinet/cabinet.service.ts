import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CodeError, CodeObject, ObjectSize, ValidType } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Validations } from 'src/common/validations';
import { RedisService } from 'src/config/cache/redis.service';
import { CachedProcessInterface } from 'src/shared/interfaces/cached-process.interface';
import { SlotDefectService } from 'src/slot-defect/slot-defect.service';
import { Repository } from 'typeorm';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { FilterCabinetDto } from './dto/filter-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { CabinetEntity } from './entities/cabinet.entity';
import { removeDuplicates } from 'src/shared/helpers/remove-duplicates.helper';

@Injectable()
export class CabinetService {
  constructor(
    @InjectRepository(CabinetEntity)
    private readonly cabinetRepository: Repository<CabinetEntity>,
    @Inject(forwardRef(() => SlotDefectService))
    private readonly slotDefectService: SlotDefectService,
    private readonly redisService: RedisService,

  ) { }

  async findByName(cabinet_name: string){
    return await this.cabinetRepository.createQueryBuilder('cabinet')
    .where('cabinet.cabinet_name = :cabinet_name', {cabinet_name: cabinet_name})
    .getOne()
  }

  async findAvailableCabinetById(cabinet_id: number) {
    return await this.cabinetRepository.createQueryBuilder('cabinet')
    .where('cabinet.cabinet_id = :cabinet_id', {cabinet_id: cabinet_id})
    .andWhere('cabinet.cabinet_status = :cabinet_status', {cabinet_status: 1})
    .getOne()
  }

  async findAvailableCabinetByName(cabinet_name: string) {
    return await this.cabinetRepository.createQueryBuilder('cabinet')
    .where('cabinet.cabinet_name = :cabinet_name', { cabinet_name: cabinet_name })
    .andWhere('cabinet.cabinet_status = :cabinet_status', { cabinet_status: 1 })
    .getOne()
  }

  async getTotalCabinetCapacity(cabinet_id: number): Promise<number> {
    const cabinet_defects = await this.slotDefectService.getDefectsByCabinet(cabinet_id);
    const defect_positions = cabinet_defects.map(cabinet_defect => cabinet_defect.position);
    return (360 - removeDuplicates(defect_positions).length);
  }

  async create(createCabinetDto: CreateCabinetDto): Promise<any | CabinetEntity> {
    const {cabinet_name} = createCabinetDto

    if (cabinet_name.trim() == '' || cabinet_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY, 'O campo não pode estar vazio', CodeObject.CABINET))
    }

    const cabinet = this.cabinetRepository.create(createCabinetDto)
    cabinet.cabinet_status = true

    cabinet.cabinet_name = cabinet_name.toUpperCase().trim()
    Validations.getInstance().validateWithRegex(
      cabinet.cabinet_name, 
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE,
      ValidType.CABINET_DIFERENT_OF_ZERO,
      ValidType.CABINET_IS_NUMBER

    )
    Validations.getInstance().verifyLength(
      cabinet.cabinet_name, 'Nome do Painel', 1, 8
    )

    cabinet.cabinet_name = 'PAINEL '+ cabinet.cabinet_name

    Validations.getInstance().validateWithRegex(
      String(cabinet.cabinet_side),
      'cabinet_side',
      ValidType.IS_BIT,
    );

    const isRegistered = await this.findByName(cabinet.cabinet_name)
    if (isRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED, 'Painel já registrado', CodeObject.CABINET))
    }
    const cabinetSave =  await this.cabinetRepository.save(cabinet)
    return {
      message: 'Painel Cadastrado com Sucesso',
      data: cabinetSave
    }
  }

  async findAll(filter: FilterCabinetDto): Promise<any | Pagination<CabinetEntity>>{
    
    const {cabinet_status, cabinet_name, cabinet_side } = filter

    const queryBuilder = this.cabinetRepository.createQueryBuilder('cabinet')
    .orderBy("CAST (REPLACE(cabinet.cabinet_name, 'PAINEL ', '') AS INTEGER)", 'ASC'); 


    if (cabinet_status) {
      queryBuilder
      .andWhere('cabinet.cabinet_status = :cabinet_status', {cabinet_status})
    }

    if (cabinet_name) {
      queryBuilder
       .andWhere('cabinet.cabinet_name like :cabinet_name',  {cabinet_name: `%${cabinet_name}%`} )
    }

    if (cabinet_side) {
      queryBuilder
       .andWhere('cabinet.cabinet_side = :cabinet_side', { cabinet_side: cabinet_side })
    }

    filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;
    const {items, meta } = (await paginate<CabinetEntity>(queryBuilder, filter));
  

    if (meta.totalItems === 0) {
      return {
        message: "Sem Paineis Cadastrados",
        items,
        meta
      }
    }

    return await paginate<CabinetEntity>(queryBuilder, filter);
    
  }

  async findById(id: number): Promise<CabinetEntity> {
    return await this.cabinetRepository.findOne({
        where: {cabinet_id: id}
    }
    )
  }

  async findByCabinetId(id: number): Promise< any | CabinetEntity> {  
   
    const cabinet =  await this.cabinetRepository.findOne({ where: {cabinet_id: id}})
    const isRegistered = await this.findById(id)
    if (!isRegistered) {
      return {
        message: "Sem Paineis Cadastrados",
        items: []
      }
    }

    return cabinet
  }



  async update(id: number, updateCabinetDto: UpdateCabinetDto): Promise< any | CabinetEntity> {
    
    const {cabinet_name} = updateCabinetDto

    if (cabinet_name.trim() == '' || cabinet_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY, 'O campo não pode estar vazio', CodeObject.CABINET))
    }

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER, 'Id inválido', CodeObject.ID))
    }

    const IdRegistered = await this.findById(id)
    if (!IdRegistered) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND, 'Nenhum Painel cadastrado', CodeObject.CABINET))
    }

    const cabinet = await this.cabinetRepository.preload({
      cabinet_id: id,
      ...updateCabinetDto
    })

    cabinet.cabinet_name = cabinet_name.toUpperCase().trim()



    Validations.getInstance().validateWithRegex(
      cabinet.cabinet_name, 
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE,
      ValidType.CABINET_DIFERENT_OF_ZERO,
      ValidType.CABINET_IS_NUMBER

    )
    Validations.getInstance().verifyLength(
      cabinet.cabinet_name, 'Campo', 1, 8
    )

    cabinet.cabinet_name = 'PAINEL '+ cabinet.cabinet_name

     Validations.getInstance().validateWithRegex(
      String(cabinet.cabinet_side),
      'cabinet_side',
      ValidType.IS_BIT,
    );

    let cabinet_on_process = await this.redisService.getByKeyValueArray<CachedProcessInterface>('processes*', 'slots', 'cabinet_name', IdRegistered.cabinet_name);

     if (cabinet_on_process) {
      throw new ConflictException(new ErroResponse(CodeError.IN_PROCESS, `${IdRegistered.cabinet_name} não pode ser editado pois se encontra em processo na work order ${cabinet_on_process.work_order.work_order_number}`, CodeObject.CABINET))
     }

    const isRegistered = await this.findByName(cabinet.cabinet_name)

    if (isRegistered && isRegistered.cabinet_id !== cabinet.cabinet_id) {
      throw new NotFoundException(new ErroResponse(CodeError.IS_REGISTERED, `${cabinet.cabinet_name} já registrado!!`, CodeObject.CABINET))
    };

    await this.cabinetRepository.save(cabinet)

    const item = await this.findById(id);

    return {
      message: 'Painel atualizado com Sucesso',
      item: item,
    }
  }


  async changeStatus(id: number): Promise<CabinetEntity>{

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER, 'Id inválido', CodeObject.ID))
    }

    const cabinetSaved = await this.findById(id)

    if (!cabinetSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND, 'Nenhum Painel cadastrado', CodeObject.CABINET))
    }

    const processes = await this.redisService.getArrayBykeyPath<CachedProcessInterface>('processes*');

    if (processes) {
      processes.forEach((process) => {
        process.slots.forEach(slot => {
          if (slot.cabinet_name === cabinetSaved.cabinet_name) {
            throw new BadRequestException(new ErroResponse(CodeError.IN_PROCESS, `Armário não pode ser desativado pois se encontra em processo na work order ${process.work_order.work_order_number}`, CodeObject.CABINET))
          }
        })
      });
    }

    const { cabinet_status: status } = cabinetSaved

    cabinetSaved.cabinet_status = status === true ? false : true

    return this.cabinetRepository.save(cabinetSaved)

  } 

  

}
