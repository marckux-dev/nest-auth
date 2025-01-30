import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { sampleUsers } from './data/sample-users';

@Injectable()
export class SeedService {
  constructor(private readonly authService: AuthService) {}

  async seedUsers() {
    await this.authService.clear();
    await this.authService.populate(sampleUsers);
  }
}
