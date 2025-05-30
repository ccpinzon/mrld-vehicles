import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Role,
  Permission,
  Project,
  OrganizationalUnit,
  Vehicle,
  Transfer,
} from '../entities';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AuthModule } from '../auth';
import { RedisModule } from '../redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Project,
      OrganizationalUnit,
      Vehicle,
      Transfer,
    ]),
    AuthModule,
    RedisModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TypeOrmModule, TransfersService],
})
export class TransfersModule {}
