import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../entities';

@Injectable()
export class TransferReportService {
  private readonly logger = new Logger(TransferReportService.name);

  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
  ) {}

  /**
   * Cron job that runs every day at 8:00 AM to generate a transfer report
   * and send it via email.
   */
  async generateDailyTransferReport() {
    this.logger.log('Starting daily transfer report generation');

    try {
      // Get transfers with related data
      const transfers = await this.getTransfersForReport();

      // Log the number of transfers found
      this.logger.log(`Found ${transfers.length} transfers for the report`);

      // Send email with transfer data
      await this.sendEmail(transfers);

      this.logger.log('Daily transfer report sent successfully');
    } catch (error) {
      this.logger.error(`Error generating daily transfer report - ${error}`);
    }
  }

  /**
   * Query the database to get transfers with related data
   */
  private async getTransfersForReport(): Promise<Transfer[]> {
    return this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.vehicle', 'vehicle')
      .leftJoinAndSelect('transfer.client', 'client')
      .leftJoinAndSelect('transfer.transmitter', 'transmitter')
      .leftJoinAndSelect('transfer.project', 'project')
      .leftJoinAndSelect('transfer.organizationalUnit', 'organizationalUnit')
      .select([
        'transfer.id',
        'transfer.type',
        'transfer.createdAt',
        'vehicle.id',
        'vehicle.make',
        'vehicle.model',
        'vehicle.year',
        'vehicle.licensePlate',
        'client.id',
        'client.firstName',
        'client.lastName',
        'client.email',
        'transmitter.id',
        'transmitter.firstName',
        'transmitter.lastName',
        'transmitter.email',
        'project.id',
        'project.name',
        'organizationalUnit.id',
        'organizationalUnit.name',
      ])
      .getMany();
  }

  /**
   * Send email with transfer data
   * This is a placeholder function that will be implemented later
   */
  private async sendEmail(transfers: Transfer[]): Promise<void> {
    // create await dummy service to simulate email sending
    const simulateEmailSending = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });
    };

    // Wait for the dummy email service
    await simulateEmailSending();

    this.logger.log(`Would send email with ${transfers.length} transfers`);

    // TODO: Implement email sending logic
  }
}
