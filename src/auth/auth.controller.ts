import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { Role } from './interfaces';
import { DeleteResult } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(Role.ADMIN, Role.SUPER)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Promise<{ password: string }> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ token: string; user: User }> {
    return this.authService.login(loginUserDto);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Get('users')
  findAll(): Promise<User[]> {
    return this.authService.findAll();
  }

  @Auth()
  @Get('users/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.authService.findOneById(id);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Patch('reset-password/:id')
  resetPassword(@Param('id', ParseUUIDPipe) id: string): Promise<{ password: string }> {
    return this.authService.resetPassword(id);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Delete('users/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.authService.deleteUser(id);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Patch('upgrade/:id')
  upgrade(@GetUser() adminUser: User, @Param('id') id: string): Promise<void> {
    return this.authService.upgrade(adminUser, id);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Patch('downgrade/:id')
  downgrade(
    @GetUser() adminUser: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.authService.downgrade(adminUser, id);
  }
}
