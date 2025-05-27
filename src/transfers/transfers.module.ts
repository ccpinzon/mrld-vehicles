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
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TypeOrmModule, TransfersService],
})
export class TransfersModule {}
