import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
      const { id } = user;
      return { token: this.getJwtToken({ id }) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { id } = user;
    return { token: this.getJwtToken({ id }) };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  private getJwtToken(payload: JwtPayloadInterface): string {
    return this.jwtService.sign(payload);
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }
    this.logger.error(error.message);
    throw new InternalServerErrorException(
      'Something went wrong. See logs for more information.',
    );
  }
}
