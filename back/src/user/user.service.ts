import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository, Brackets } from 'typeorm';
import { Validations } from 'src/common/validations';
import { CodeError, CodeObject, ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { Utils } from 'src/common/Utils';
import { ProfileEntity } from '../access-control/entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUser } from './dto/filter-user.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { hash } from 'src/common/hash';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { ShiftEntity } from 'src/shift/entities/shift.entity';
import { OfficeEntity } from 'src/office/entities/office.entity';
import { ErroResponse } from '../common/error-response';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(ShiftEntity)
    private readonly shiftRepository: Repository<ShiftEntity>,
    @InjectRepository(OfficeEntity)
    private readonly officeRepository: Repository<OfficeEntity>,
  ) { }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        user_name: name
      }
    })
  }


  async findByEnrollment(user_enrollment: string) {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.transactions', 'transactions')
      .where('user.user_enrollment = :user_enrollment', { user_enrollment: user_enrollment })
      .getOne()
  }


  async findProfileById(id: number): Promise<ProfileEntity> {
    return this.profileRepository.findOne({
      where: {
        profile_id: id
      }
    })
  }

  async findShiftById(id: number): Promise<ShiftEntity> {
    return this.shiftRepository.findOne({
      where: {
        shift_id: id
      }
    })
  }

  async findOfficeById(id: number): Promise<OfficeEntity> {
    return this.officeRepository.findOne({
      where: {
        office_id: id
      }
    })
  }

  async findByEmail(email: string) {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne()
  }


  async create(createUserDto: CreateUserDto) {

    const { user_name, user_profile_id, user_enrollment, office_id, user_password } = createUserDto

    if (user_name.trim() == '' || user_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O nome não pode estar vazio`, CodeObject.NAME))
    }

    if (user_enrollment.trim() == '' || user_enrollment == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`A matrícula não pode estar vazio`, CodeObject.ENROLLMENT))
    }

    if (user_password.trim() == '' || user_password == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`A senha não pode estar vazia`, CodeObject.PASSWORD))
    }


    const user = this.userRepository.create(createUserDto)

    user.office_id = office_id;

    user.user_name = user_name.toUpperCase().trim()

    Validations.getInstance().validateWithRegex(
      user.user_name, 'user_name',
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.IS_STRING
    )

    Validations.getInstance().verifyLength(
      user.user_name, 'user_name', 4, 40
    )

    Validations.getInstance().validateWithRegex(
      user.user_enrollment, 'user_enrollment',
      ValidType.NO_SPACE,
      ValidType.IS_NUMBER,
      ValidType.NO_SPECIAL_CHARACTER

    )

    Validations.getInstance().verifyLength(
      user.user_enrollment, 'user_enrollment', 6, 8
    )

    Validations.getInstance().validateWithRegex(
      String(user.user_mes_id), 'user_mes_id',
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.IS_NUMBER
    )

    if (user.user_email) {
      Validations.getInstance().validateWithRegex(
        user.user_email,
        ValidType.IS_EMAIL,
        ValidType.NO_SPACE
      )

      const emailIsRegistered = await this.findByEmail(user.user_email)

      if (emailIsRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Email já cadastrado`, CodeObject.EMAIL) )}

      }
       else if (!user.user_email) {
        user.user_email = null
      }

   
    const registrationIsRegistered = await this.findByEnrollment(user.user_enrollment)

    if (registrationIsRegistered) {
      throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Matrícula já cadastrada`, CodeObject.ENROLLMENT))
    }

    const newPass = ('adata@' + (`${new Date().getFullYear()}`))

    user.user_password = await Utils.getInstance().encryptPassword(newPass)

    const profile = await this.findProfileById(user_profile_id)

    if (!profile) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Perfil não encontrado`, CodeObject.PROFILE))
    }

    user.user_profile_id = user_profile_id

    user.user_status = true

    user.user_password_status = true

    user.user_first_access = true

    if (user_password === newPass ) {
      user.user_password = await Utils.getInstance().encryptPassword(newPass)
    } else {
      user.user_password = await Utils.getInstance().encryptPassword(user_password)
      user.user_first_access = false

      Validations.getInstance().validateWithRegex(
        createUserDto.user_password, 'user_password',
        ValidType.NO_SPACE,
        ValidType.MINIMUM_ONE_NUMBER_STRING_SPECIAL_CHARACTER
    )
  
      Validations.getInstance().verifyLength(
        createUserDto.user_password, 'user_password', 6, 12
    )
    }



    let userSaved = await this.userRepository.save(user)

     userSaved.user_password = !user_password ? newPass : user_password

    return userSaved

  }


  

  async findAll(filter: FilterUser): Promise<Pagination<User>>{

    const {search_name, user_status, sort, orderBy} = filter;

    const userBuilder = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.shift', 'shift')
    .leftJoinAndSelect('user.profile', 'profile')
    .leftJoinAndSelect('user.office', 'office')

    if (user_status) {
      userBuilder
      .andWhere('user.user_status = :user_status', {user_status})
    }

    if (search_name) {
      userBuilder
      .andWhere(new Brackets(queryBuilderOne => {
        queryBuilderOne
          .where('user.user_name like :user_name', { user_name: `%${search_name}%` })
          .orWhere('user.user_enrollment like :user_enrollment', { user_enrollment: `%${search_name}%` })
      }));
    }



    if (orderBy == SortingType.NAME) {
      userBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    } 

    filter.limit = filter.limit ?? (await userBuilder.getMany()).length;

    return paginate<User>(userBuilder, filter);
  }




  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.profileRepository.find()
  }

  async findByEmailAndId(user_id: number, user_email: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.user_id != :user_id', {user_id})
    .andWhere('user.user_email like :user_email', {user_email: `%${user_email}%`}) 
    .getOne()
  }

  async findByEnrollmentAndId(user_id: number, user_enrollment: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.user_id != :user_id', {user_id})
    .andWhere('user.user_enrollment like :user_enrollment', {user_enrollment: `%${user_enrollment}%`}) 
    .getOne()
  }

  async findByNameAndId(user_id: number, user_name: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.user_id != :user_id', {user_id})
    .andWhere('user.user_name like :user_name', {user_name: `%${user_name}%`}) 
    .getOne()
  }




  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {

  Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
  )

  if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
  }

  const { user_name, user_enrollment, user_profile_id: profile_id, user_email, user_shift_id, office_id } = updateUserDto

  if (user_name.trim() == '' || user_name == undefined) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`O nome não pode estar vazio`, CodeObject.NAME))
  }

  if (!user_enrollment) {
      throw new BadRequestException(new ErroResponse(CodeError.NOT_EMPTY,`A matrícula não pode estar vazio`, CodeObject.ENROLLMENT))
  }


  const isRegistered = await this.findById(id)

  if (!isRegistered) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuário não existe`, CodeObject.USER))
    }

    const user = await this.userRepository.preload({
      user_id: id,
      ...updateUserDto
  })

  if (user.user_mes_id) {
    Validations.getInstance().validateWithRegex(
      String(user.user_mes_id), 'user_mes_id',
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.IS_NUMBER
    )
  }


  if (user_name) {
      user.user_name = user_name.toUpperCase().trim()

      Validations.getInstance().validateWithRegex(
        user.user_name,  'user_name',
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_STRING
      )

      Validations.getInstance().verifyLength(
        user.user_name, 'user_name', 4, 40)
 }

  if (user_enrollment) {
      user.user_enrollment = user_enrollment

      Validations.getInstance().validateWithRegex(
        user.user_enrollment, 'user_enrollment',
        ValidType.NO_SPACE,
        ValidType.IS_NUMBER,
        ValidType.NO_SPECIAL_CHARACTER)
  
      Validations.getInstance().verifyLength(
        user.user_enrollment, 'user_enrollment', 6, 8)

    if(isRegistered.user_enrollment != user_enrollment) {
      const isRegisteredName = await this.findByEnrollmentAndId(user.user_id, user_enrollment)
    
      if(isRegisteredName) {
        throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED,`Matrícula já cadastrada`, CodeObject.ENROLLMENT))}}
  }
  if (user.user_email) {
      Validations.getInstance().validateWithRegex(
       user.user_email,
       ValidType.IS_EMAIL,
       ValidType.NO_SPACE)

    if(isRegistered.user_email != user_email) {
        const isRegisteredName = await this.findByEmailAndId(user.user_id, user_email)
  
        if(isRegisteredName) {
          throw new BadRequestException(new ErroResponse(CodeError.IS_REGISTERED, 'Email já cadastrado', CodeObject.EMAIL))
        }
      }
      
    } else if (!user.user_email) {
        user.user_email = null
  }

  
  if (profile_id) {
      const profile = await this.findProfileById(profile_id)

      if (!profile) {
        throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Perfil não encontrado`, CodeObject.PROFILE))
      }
      user.profile = profile
  }

  if (user.user_shift_id) {
      const shift =  await this.findShiftById(user_shift_id)

      if (!shift) {
        throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Turno não encontrado`, CodeObject.SHIFT))
      }
      user.shift = shift
  }

  if (user.office_id) {
      const office = await this.findOfficeById(office_id)

      if (!office) {
        throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Cargo não encontrado`, CodeObject.OFFICE))
      }
      user.office = office
  }

  await this.userRepository.save(user)

  return this.findById(id)
}

  
  async findById(id: number): Promise<User> {
    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )
    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.office', 'office')
      .leftJoinAndSelect('user.shift', 'shift')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne()


  }

  async findByEnrollmentStatus(enrollment: number): Promise<User> {
    Validations.getInstance().validateWithRegex(
      `${enrollment}`,
      ValidType.IS_NUMBER
    )
    if (enrollment > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ENROLLMENT))
    }

    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_enrollment = :user_enrollment', { user_enrollment: enrollment })
      .getOne()


  }




  async changeFirstAccess(id: number) {

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    const userSaved = await this.findById(id)

    if (!userSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuário com id ${id} não existe`, CodeObject.USER))
    }

    const { user_first_access: status } = userSaved

    if (status) {

      userSaved.user_first_access = false

      await this.userRepository.save(userSaved)

      return {
        Status: 'Success',
        Message: 'first access status successfully modified'
      }
    }

    return {
      Status: 'Fail',
      Message: 'This is not the first login since this user'
    }

  }




  async changeStatus(enrollment: number) {

    Validations.getInstance().validateWithRegex(
      `${enrollment}`,
      ValidType.IS_NUMBER
    )

    if (enrollment > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    const userSaved = await this.findByEnrollmentStatus(enrollment)

    if (!userSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuário não existe`, CodeObject.USER))
    }

    const { user_status: status } = userSaved

    userSaved.user_status = status === true ? false : true

    return this.userRepository.save(userSaved)

  }

  async changePasswordStatus(enrollment: number) {

    Validations.getInstance().validateWithRegex(
      `${enrollment}`,
      ValidType.IS_NUMBER
    )

    if (enrollment > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    const userSaved = await this.findByEnrollmentStatus(enrollment)

    if (!userSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuário não existe`, CodeObject.USER))
    }

    const { user_password_status: status } = userSaved

    userSaved.user_password_status = status === true ? false : true

    return this.userRepository.save(userSaved)

  }





  async changePassword(changePasswordDto: ChangePasswordDto) {
    const userSaved = await this.findByEnrollment(changePasswordDto.enrollment);

    if (!userSaved) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,'Usuário não cadastrado!', CodeObject.USER));
    }

    const newHashedPassword = await hash(changePasswordDto.new_password);

    userSaved.user_password = newHashedPassword;
    userSaved.user_first_access = false;

    return this.userRepository.save(userSaved);

  }

  async resetPassword(registration: string): Promise<User> { 

    const user = await this.findByEnrollment(registration) 
    if (!user) { 
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuário com matrícula ${registration} não existe`, CodeObject.USER))
    }

    const newPass = ('adata@' + (`${new Date().getFullYear()}`))

    user.user_password = await Utils.getInstance().encryptPassword(newPass) 

    user.user_first_access = true 
    user.user_password_status = true

    const userSaved = await this.userRepository.save(user)

    userSaved.user_password = newPass 


    return userSaved

  }

  async updateRefreshToken(id: number, refresh_token: string) {

    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(new ErroResponse(CodeError.INVALID_NUMBER,`Número de id inválido`, CodeObject.ID))
    }

    const user = await this.findById(id)

    if (!user) {
      throw new NotFoundException(new ErroResponse(CodeError.NOT_FOUND,`Usuario com id ${id} não existe`, CodeObject.USER))
    }

    user.user_refresh_token = refresh_token

    await this.userRepository.save(user)

  }

}
