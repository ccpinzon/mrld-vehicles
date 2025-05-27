import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TransferReportController } from './transfer-report.controller';
import { TransferReportService } from './transfer-report.service';
import { Transfer } from '../entities';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  imports: [TypeOrmModule.forFeature([Transfer]), ScheduleModule.forRoot()],
  controllers: [TransferReportController],
  providers: [TransferReportService],
})
export class TransferReportModule {}
