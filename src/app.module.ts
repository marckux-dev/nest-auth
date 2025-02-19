import * as process from 'node:process';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { ProductModule } from './product/product.module';
import { CenterModule } from './center/center.module';
import { StockModule } from './stock/stock.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    // Load the .env file. This must be the first import.
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
      envFilePath: process.env.NODE_ENV === 'prod' ?
          '.env.prod'
        : '.env.dev',
    }),
    // Connect to the database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_HOST_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true, // Automatically load all entities
      synchronize: true, // Don't use this in production
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    SeedModule,
    ProductModule,
    CenterModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
