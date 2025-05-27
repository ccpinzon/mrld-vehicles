import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransferReportService } from './transfer-report.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('transfer-report')
@Controller('transfer-report')
export class TransferReportController {
  private readonly logger = new Logger(TransferReportController.name);

  constructor(private readonly transferReportService: TransferReportService) {}

  @Get('generate')
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  @ApiOperation({
    summary: 'Generate transfer report',
    description:
      'Manually trigger the generation of a transfer report. This endpoint is also automatically called every day at 8 AM.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transfer report generation triggered',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Transfer report generation triggered',
        },
      },
    },
  })
  async generateReport() {
    this.logger.log('Manually triggering transfer report generation');
    await this.transferReportService.generateDailyTransferReport();
    return { message: 'Transfer report generation triggered' };
  }
}
