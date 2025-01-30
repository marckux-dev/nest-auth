import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdatePasswordUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { Role } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(Role.ADMIN, Role.SUPER)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Promise<{ token: string }> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }

  @Auth()
  @Patch('update-password')
  updatePassword(
    @GetUser('id') userId: string,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    return this.authService.updatePassword(userId, updatePasswordUserDto);
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

  @Get('private')
  @Auth()
  privateRoute(@GetUser() user: User) {
    return user;
  }

  @Get('only-admin')
  @Auth(Role.ADMIN)
  onlyAdminRoute(@GetUser() user: User) {
    return user;
  }
}
