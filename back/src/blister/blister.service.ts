import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { atob } from 'buffer';
import { isBase64 } from 'class-validator';
import { read } from 'fs';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { of } from 'rxjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { CodeError, CodeObject, SortingType, ValidType } from 'src/common/Enums';
import { ErroResponse } from 'src/common/error-response';
import { Validations } from 'src/common/validations';
import { Repository } from 'typeorm';
import { CreateBlisterDto } from './dto/create-blister.dto';
import { FilterBlister } from './dto/filter.blister.dto';
import { UpdateBlisterDto } from './dto/update-blister.dto';
import { BlisterEntity } from './entities/blister.entity';

@Injectable()
export class BlisterService {
constructor(

  @InjectRepository(BlisterEntity)
  private readonly blisterRepository: Repository<BlisterEntity>
) {}

  async create(createBlisterDto: CreateBlisterDto): Promise<BlisterEntity> {
    
    const { blister_name, blister_img, blister_qtd } = createBlisterDto

    if (blister_img.trim() == '' || blister_img == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O campo imagem não pode estar vazio`, CodeObject.BLISTER))
    }

    if (blister_img.length < 70) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Imagem está em um formato inválido!`, CodeObject.IMAGE))}

    //const base64str = blister_img.split('base64,')[1]; //remove the image type metadata.
    const imageFile = Buffer.from(blister_img, 'base64'); //encode image into bytes

    if ( imageFile.length > 3000000) {
      throw new BadRequestException(`A imagem não pode ser maior que 3mb`)
    }
    
    const blister = this.blisterRepository.create(createBlisterDto)

      blister.blister_status = true    
      blister.blister_name = blister_name.toUpperCase().trim()
      blister.blister_qtd = blister_qtd.trim()    

      Validations.getInstance().validateWithRegex(
        blister.blister_name,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
      )

      Validations.getInstance().verifyLength(blister.blister_name, 'name', 5, 15)    

    
      Validations.getInstance().validateWithRegex(
        blister.blister_qtd,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_NUMBER,
        ValidType.MINIMUM_ONE_NUMBER,      
        ValidType.DIFERENT_OF_ZERO
      )

      Validations.getInstance().verifyLength(blister.blister_qtd,'quantidade', 1,2) 
   
      const isRegistered = await this.findByName(blister.blister_name)

      if(isRegistered) {
        throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`O blister com o nome ${blister.blister_name} já cadastrado!`, CodeObject.BLISTER))
      } 
              

        return this.blisterRepository.save(blister);
  }

   async findAll(filter: FilterBlister): Promise<Pagination<BlisterEntity>> {

    const {orderBy, sort, blister_name, blister_status  } =  filter

    const queryBuilder = this.blisterRepository.createQueryBuilder('blister')
    

    if(blister_status) {
      queryBuilder
      .andWhere('blister.blister_status = :blister_status', {blister_status})
    }

    if(blister_name) {
      queryBuilder
      .andWhere('blister.blister_name like :blister_name', {blister_name: `%${blister_name}%`})
    }


    if(orderBy == SortingType.ID) {
      queryBuilder.orderBy('blister.blister_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
    }
     else {
      queryBuilder.orderBy('blister.blister_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
    }

    filter.limit = filter.limit ?? (await queryBuilder.getMany()).length

    return paginate<BlisterEntity>(queryBuilder, filter)
    
  }

  findOne(id: number): Promise<BlisterEntity> {
    return this.blisterRepository.findOne({where: {blister_id: id}})
  }

  async findByName(name: string): Promise<BlisterEntity> {
    return this.blisterRepository.findOne({where: {blister_name: name}})
  }

  async changeStatusBlister(id: number): Promise<BlisterEntity> {

    const blisterRegistered = await this.findOne(id)

    const { blister_status: status} = blisterRegistered

    if(!blisterRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_FOUND,`Blister com o id: ${id} não encontrado!`, CodeObject.BLISTER))
    }

    blisterRegistered.blister_status = status === true ? false : true
    
    await this.blisterRepository.save(blisterRegistered)

    return this.findOne(id)

  }

  async findByNameOnDifferentBlister(blister_id: number, blister_name: string): Promise<BlisterEntity> {
    return this.blisterRepository.createQueryBuilder('a')
    .where('a.blister_id != :blister_id', {blister_id})
    .andWhere('a.blister_name like :blister_name', {blister_name: `%${blister_name}%`}) 
    .getOne()
  }

  async update(id: number, updateBlisterDto: UpdateBlisterDto): Promise<BlisterEntity> {

    const { blister_name, blister_img, blister_qtd } = updateBlisterDto 

    if (blister_img.trim() == '' || blister_img == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O campo imagem não pode estar vazio`, CodeObject.IMAGE))
    }

    
    if (blister_img.length < 70) {
      throw new BadRequestException(`Imagem está em um formato inválido!`)
    }

    //const base64str = blister_img.split('base64,')[1]; //remove the image type metadata.
    const imageFile = Buffer.from(blister_img, 'base64'); //encode image into bytes

    if ( imageFile.length > 3000000) {
      throw new BadRequestException(`A imagem não pode ser maior que 3mb`)
    }



   
    

    let isRegistered = this.findOne(id);
    
    if(!isRegistered) {
      throw new BadGatewayException(new ErroResponse(CodeError.NOT_FOUND,`Blister não encontrado`, CodeObject.BLISTER));
    }

    let blister = await this.blisterRepository.preload({
      blister_id: id,
      ...updateBlisterDto
    })    

    if(blister_name && (await isRegistered).blister_name !== blister_name) {
      const isRegisteredName = await this.findByNameOnDifferentBlister(id, blister_name)

      if(isRegisteredName) {
        throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`O blister ${blister_name}, já cadastrado!`, CodeObject.BLISTER) )
      }
    }

      blister.blister_name = blister.blister_name.toUpperCase().trim()

      blister.blister_qtd = blister_qtd.trim()

      Validations.getInstance().validateWithRegex(
        blister.blister_name,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
        
      )

      Validations.getInstance().validateWithRegex(
        blister.blister_qtd,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_NUMBER,     
        ValidType.MINIMUM_ONE_NUMBER,
        ValidType.DIFERENT_OF_ZERO
      )      

      Validations.getInstance().verifyLength(blister.blister_name, 'name', 5, 15)

      Validations.getInstance().verifyLength(blister.blister_qtd,'quantidade', 1,2)

      
    await this.blisterRepository.save(blister)
    
    return this.findOne(id)    
  }
}