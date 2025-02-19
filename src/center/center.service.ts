import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Center } from './entities/center.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CreateCenterDto } from './dto';
import { Stock } from '../stock/entities/stock.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CenterService {
  private readonly logger: Logger = new Logger(CenterService.name);
  constructor(
    @InjectRepository(Center)
    private centerRepository: Repository<Center>,
    private readonly eventEmiter: EventEmitter2,
  ) {}

  async create(createCenterDto: CreateCenterDto): Promise<Center> {
    try {
      const newCenter = this.centerRepository.create(createCenterDto);
      const savedCenter = await this.centerRepository.save(newCenter);
      this.eventEmiter.emit('center.created', newCenter);
      return savedCenter;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Center[]> {
    return this.centerRepository.createQueryBuilder('center').getMany();
  }

  async findOne(id: string): Promise<Center> {
    if (!isUUID(id)) return this.findOneByName(id);
    const center = await this.centerRepository.findOne({
      where: { id },
    });
    if (!center) throw new NotFoundException(`Center with id ${id} not found`);
    return center;
  }

  async findOneByName(name: string): Promise<Center> {
    const center = await this.centerRepository.findOne({
      where: { name: ILike(name) },
      relations: ['stockage'],
    });
    if (!center)
      throw new NotFoundException(`The center ${name} does not exist`);
    return center;
  }

  async getStockage(centerId: string): Promise<Stock[]> {
    // GET the centerProducts of the center with the given id or name
    const center = await this.findOne(centerId);
    return center.stockage;
  }

  async populate(centers: CreateCenterDto[]): Promise<void> {
    try {
      for (const center of centers) {
        await this.create(center);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  clear(): Promise<DeleteResult> {
    return this.centerRepository.delete({});
  }

  private handleError(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException('Center already exists');
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Something went wrong. See logs.');
  }
}
