import { Controller, Get, Post, Body, Patch, Param, UseGuards, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { ProfileEntity } from '../access-control/entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUser } from './dto/filter-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import Permission from 'src/auth/enums/permission.type';
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(PermissionGuard(Permission.User.CREATE))
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {

    return this.userService.create(createUserDto);
    
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.User.READ))
  async findAll(
    @Query() filter: FilterUser
  ): Promise<Pagination<User>>{
    return this.userService.findAll(filter);
  }

  @Get('/profile')
  @UseGuards(PermissionGuard(Permission.User.READ))
  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.userService.findAllProfile()
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.User.READ))
  async findOne(
    @Param('id') id: number
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @Get('findByEnrollment/:enrollment')
  @UseGuards(PermissionGuard(Permission.User.READ))
  async findByEnrollment(
    @Param('enrollment') enrollment: string
  ): Promise<User> {
    return this.userService.findByEnrollment(enrollment);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.User.UPDATE))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/status/:enrollment')
  @UseGuards(PermissionGuard(Permission.User.CHANGE_STATUS))
  async changeStatus(
    @Param('enrollment') enrollment: number
  ): Promise<User> {
    return this.userService.changeStatus(enrollment);
  }

  @Patch('/passwordStatus/:enrollment')
  @UseGuards(PermissionGuard(Permission.User.CHANGE_STATUS))
  async changePasswordStatus(
    @Param('enrollment') enrollment: number
  ): Promise<User> {
    return this.userService.changePasswordStatus(enrollment);
  }

  @Patch('/resetPass/:enrollment')
  @UseGuards(PermissionGuard(Permission.User.RESET_PASSWORD))
  async resetPassword(
    @Param('enrollment') enrollment: string) {
      const updateMensage = await this.userService.resetPassword(enrollment)
    return [`Senha Resetada com Sucesso`, updateMensage]
  }

}
