import { Controller, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { Role } from '../auth/interfaces';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth(Role.SUPER)
  @Post('users')
  seedUsers() {
    return this.seedService.seedUsers();
  }
}
