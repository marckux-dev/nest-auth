import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayloadInterface, Role } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { generateSecurePassword } from '../common/helpers/string.helpers';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ password: string }> {
    const password = createUserDto.password?? generateSecurePassword();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
      return {
        password
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: User; token: string }> {
    const { full_name, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { full_name },
      select: ['id', 'full_name', 'password'],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { id } = user;
    const userData = await this.userRepository.findOneBy({ id });
    return {
      token: this.getJwtToken({ id }),
      user: userData,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async resetPassword(id: string): Promise<{password: string}> {
    const user = await this.findOneById(id);
    const password = generateSecurePassword();
    // Update the password
    user.password = bcrypt.hashSync(password, 10);
    try {
      await this.userRepository.save(user);
      return { password };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    const userToFind = await this.userRepository.findOneBy({ id });
    if (!userToFind) throw new NotFoundException('User not found');
    return userToFind;
  }

  async upgrade(adminUser: User, id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if the adminUser has the necessary role to upgrade
    if (
      !adminUser.containsRole(Role.ADMIN) &&
      !adminUser.containsRole(Role.SUPER)
    ) {
      throw new ForbiddenException(
        'You do not have permission to upgrade users',
      );
    }

    // Prevent self-upgrade
    if (adminUser.id === user.id) {
      throw new BadRequestException('You cannot upgrade yourself');
    }

    // Upgrade logic
    if (!user.containsRole(Role.ADMIN)) {
      user.roles.push(Role.ADMIN);
    } else if (
      !user.containsRole(Role.SUPER) &&
      adminUser.containsRole(Role.SUPER)
    ) {
      user.roles.push(Role.SUPER);
    } else {
      throw new BadRequestException('User already has the highest role');
    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async downgrade(adminUser: User, id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.containsRole(Role.SUPER)) {
      // Allow downgrading SUPER to ADMIN only by SUPERUSERS
      if (adminUser.containsRole(Role.SUPER)) {
        user.roles = user.roles.filter((role) => role !== Role.SUPER);
      } else {
        throw new ForbiddenException(
          'Only SUPER users can downgrade other SUPER users',
        );
      }
    } else if (user.containsRole(Role.ADMIN)) {
      // Allow downgrading ADMIN to USER
      user.roles = user.roles.filter((role) => role !== Role.ADMIN);
    } else {
      throw new BadRequestException('User is already at the lowest role');
    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async clear(): Promise<void> {
    await this.userRepository.clear();
  }

  async populate(users: CreateUserDto[]): Promise<void> {
    try {
      for (const user of users) {
        await this.create(user);
      }
    } catch (error) {
      this.handleError(error);
    }
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

  deleteUser(id: string) {
    return this.userRepository.delete({id});
  }
}
