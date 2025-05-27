import { Controller, Get, Logger } from '@nestjs/common';
import { TransferReportService } from './transfer-report.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('transfer-report')
export class TransferReportController {
  private readonly logger = new Logger(TransferReportController.name);

  constructor(private readonly transferReportService: TransferReportService) {}

  @Get('generate')
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async generateReport() {
    this.logger.log('Manually triggering transfer report generation');
    await this.transferReportService.generateDailyTransferReport();
    return { message: 'Transfer report generation triggered' };
  }
}
