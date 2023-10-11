import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CodeError, CodeObject, ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Validations } from 'src/common/validations';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { FilterShiftDto } from './dto/filter.shift';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftEntity } from './entities/shift.entity';

@Injectable()
export class ShiftService {

    constructor(
      @InjectRepository(ShiftEntity)
       private readonly shiftRepository: Repository<ShiftEntity>,
    ) { }

    async create(createShiftDto: CreateShiftDto) {
      const {shift_name} = createShiftDto;
      if (shift_name.trim() == '' || shift_name == undefined) {
        throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O turno não pode estar vazio`,  CodeObject.SHIFT))
      };

      const shift = this.shiftRepository.create(createShiftDto)

      shift.shift_status = true

      shift.shift_name = shift.shift_name.toUpperCase().trim()

      Validations.getInstance().validateWithRegex(
        shift.shift_name,'shift_name',
        ValidType.NO_MANY_SPACE,
        ValidType.SHIFT_NO_SPECIAL_CHARACTER,
      )

      Validations.getInstance().verifyLength(shift.shift_name, 'shift_name', 5, 40)

      let ShiftIsRegistered = await this.findByname(shift.shift_name)

      if(ShiftIsRegistered) {
        throw new BadGatewayException(new ErroResponse(CodeError.IS_REGISTERED,`O turno ${shift.shift_name}, já está cadastrado!`, CodeObject.SHIFT))
      }

      return await this.shiftRepository.save(shift)
    }

 

  async getAll (): Promise<ShiftEntity[]>{    
    return this.shiftRepository.find();
    
  }

  async findByNameOnDifferentShift(shift_id: number, shift_name: string): Promise<ShiftEntity> {
    return this.shiftRepository.createQueryBuilder('shift')
    .where('shift.shift_id != :shift_id', {shift_id})
    .andWhere('shift.shift_name like :shift_name', {shift_name: `%${shift_name}%`}) 
    .getOne()
  }


  async findAll (filter: FilterShiftDto): Promise<Pagination<ShiftEntity>> {
    
    const { shift_status, sort, orderBy, search_name} = filter

    const queryBuilder = this.shiftRepository.createQueryBuilder('shift')
    .orderBy('shift.shift_number', 'ASC')
 

    if(search_name) {
      queryBuilder
      .andWhere('shift.shift_name like :shift_name', {shift_name: `%${search_name}%`})
    }   

    if (shift_status) {
      queryBuilder
      .andWhere('shift.shift_status = :shift_status', {shift_status})
    }

    if (orderBy == SortingType.NAME) {
      queryBuilder.orderBy('shift.shift_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    }
    
    filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;

    return paginate<ShiftEntity>(queryBuilder, filter)

  }

  findById(id: number): Promise<ShiftEntity> {
    return this.shiftRepository.findOne({where: {shift_id: id}})
  }

  findByname(name: string): Promise<ShiftEntity> {
    return this.shiftRepository.findOne({where: {shift_name: name}})
  }

  async update(id: number, updateShiftDto: UpdateShiftDto): Promise<ShiftEntity> {

    const {shift_name } = updateShiftDto

    if (shift_name.trim() == '' || shift_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O turno não pode estar vazio`,  CodeObject.SHIFT))
    }


    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`,  CodeObject.ID))
    }


    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Sem turnos cadastrado(s)`,  CodeObject.SHIFT))
    }

    const shift = await this.shiftRepository.preload({
      shift_id: id,
      ...updateShiftDto
    })



    shift.shift_name = shift_name.toUpperCase().trim()

    Validations.getInstance().validateWithRegex(
      shift.shift_name,
      ValidType.SHIFT_NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE

    )

    Validations.getInstance().verifyLength(
      shift.shift_name, 'Name', 5, 40
    )

    const registrationIsRegistered = await this.findByname(shift.shift_name)

       if (registrationIsRegistered) {
          throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Turno: ${shift.shift_name}, já cadastrado!`,  CodeObject.SHIFT))
    }

    
    await this.shiftRepository.save(shift)

    return this.findById(id)   
  }

  async changeStatus(id: number) {

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    ) 

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    const shiftSaved = await this.findById(id)

    if (!shiftSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Turno não existe`, CodeObject.SHIFT))
    }

    const { shift_status: status } = shiftSaved

    shiftSaved.shift_status = status === true ? false : true

    return this.shiftRepository.save(shiftSaved)

  }  

}
