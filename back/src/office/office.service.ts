import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CodeError, CodeObject, ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Validations } from 'src/common/validations';
import { Repository } from 'typeorm';
import { CreateOfficeDto } from './dto/create-office.dto';
import { FilterOffice } from './dto/filter.office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficeEntity } from './entities/office.entity';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(OfficeEntity)
    private readonly officeRepository: Repository<OfficeEntity>,

  ) { }

  async findByOffice(oficce_name: string) {
    return this.officeRepository.createQueryBuilder('office')
    .where('office.oficce_name = :oficce_name', { oficce_name: oficce_name })
    .getOne()
  }



  async create(createOfficeDto: CreateOfficeDto) {
    const { oficce_name} = createOfficeDto

    if (oficce_name.trim() == '' || oficce_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O office não pode estar vazio`, CodeObject.OFFICE))}

    const user = this.officeRepository.create(createOfficeDto)
    user.office_status = true

    
    user.oficce_name = oficce_name.toUpperCase().trim()

    Validations.getInstance().validateWithRegex(
      user.oficce_name, 'oficce_name',
      ValidType.OFFICE_NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE
  
    )

    Validations.getInstance().verifyLength(
      user.oficce_name, 'Nome do Cargo', 5, 40
    )

    const registrationIsRegistered = await this.findByOffice(user.oficce_name)

    if (registrationIsRegistered) {
       throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Cargo: ${user.oficce_name}, já cadastrado!`,  CodeObject.OFFICE) )}


    const userSaved = await this.officeRepository.save(user)

    return userSaved
  }

  async findAll(filter: FilterOffice): Promise<Pagination<OfficeEntity>> {
    const {search_name, office_status, sort, orderBy} = filter

    const officeBuilder =  this.officeRepository.createQueryBuilder('office')

    if (office_status) {
      officeBuilder
      .andWhere('office.office_status = :office_status', {office_status})
    }
    if (search_name) {
      officeBuilder
      .andWhere('office.oficce_name like :oficce_name', { oficce_name: `%${search_name}%` })
    }

    if (orderBy == SortingType.NAME) {
      officeBuilder.orderBy('office.oficce_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    } 

    filter.limit = filter.limit ?? (await officeBuilder.getMany()).length;

    return paginate<OfficeEntity>(officeBuilder, filter);
  }


  async update(id: number,  updateOfficeDto: UpdateOfficeDto): Promise<OfficeEntity> {

    const {oficce_name } = updateOfficeDto

    if (oficce_name.trim() == '' || oficce_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O office não pode estar vazio`,  CodeObject.OFFICE))
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
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Sem Cargo(s) cadastrado(s)`,  CodeObject.OFFICE))
    }

    const office = await this.officeRepository.preload({
      office_id: id,
      ...updateOfficeDto
    })



    office.oficce_name = oficce_name.toUpperCase().trim()

    Validations.getInstance().validateWithRegex(
      office.oficce_name,
      ValidType.OFFICE_NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE

    )

    Validations.getInstance().verifyLength(
      office.oficce_name, 'Nome do Cargo', 5, 40
    )

    const registrationIsRegistered = await this.findByOffice(office.oficce_name)

       if (registrationIsRegistered) {
          throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Cargo: ${office.oficce_name}, já cadastrado!`,  CodeObject.OFFICE))
    }

    
    await this.officeRepository.save(office)

    return this.findById(id)
  }



  findById(id: number): Promise<OfficeEntity> {
    return this.officeRepository.findOne({
      where: {office_id: id}
    })
  }

  async changeStatus(id: number) {

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`,  CodeObject.ID))
    }

    const officeSaved = await this.findById(id)

    if (!officeSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Cargo não encontrado`,  CodeObject.OFFICE))
    }

    const { office_status: status } = officeSaved

    officeSaved.office_status = status === true ? false : true

    return this.officeRepository.save(officeSaved)

  }  
}
