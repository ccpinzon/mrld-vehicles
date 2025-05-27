import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transfer,
  User,
  Vehicle,
  Project,
  OrganizationalUnit,
} from '../entities';
import { CreateTransferDto } from '../dto';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(OrganizationalUnit)
    private readonly organizationalUnitRepository: Repository<OrganizationalUnit>,
  ) {}

  async create(createTransferDto: CreateTransferDto): Promise<Transfer> {
    // Validar que el cliente y el transmitente existen
    const client = await this.userRepository.findOne({
      where: { id: createTransferDto.clientId },
    });
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const transmitter = await this.userRepository.findOne({
      where: { id: createTransferDto.transmitterId },
    });
    if (!transmitter) {
      throw new Error('Transmitente no encontrado');
    }

    // Validar que el vehículo existe
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createTransferDto.vehicleId },
    });
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Validar que el proyecto existe
    const project = await this.projectRepository.findOne({
      where: { id: createTransferDto.projectId },
    });
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    // Validar que la unidad organizativa existe y pertenece al proyecto
    const organizationalUnit = await this.organizationalUnitRepository.findOne({
      where: {
        id: createTransferDto.organizationalUnitId,
        projectId: createTransferDto.projectId,
      },
    });
    if (!organizationalUnit) {
      throw new Error(
        'Unidad organizativa no encontrada o no pertenece al proyecto',
      );
    }

    // Crear la transferencia
    const transfer = this.transferRepository.create(createTransferDto);
    return await this.transferRepository.save(transfer);
  }

  async findAll(
    projectId?: number,
    organizationalUnitId?: number,
  ): Promise<Transfer[]> {
    const queryBuilder = this.transferRepository
      .createQueryBuilder('Transfer')
      .leftJoinAndSelect('Transfer.vehicle', 'vehicle')
      .leftJoinAndSelect('Transfer.client', 'client')
      .leftJoinAndSelect('Transfer.transmitter', 'transmitter')
      .leftJoin('projects', 'project', 'project.id = Transfer.project_id')
      .addSelect([
        'project.id',
        'project.name',
        'project.description',
        'project.created_at',
      ])
      .leftJoinAndSelect('Transfer.organizationalUnit', 'organizationalUnit');

    // Filtrar por proyecto si se proporciona
    if (projectId) {
      queryBuilder.andWhere('Transfer.project_id = :projectId', { projectId });
    }

    // Filtrar por unidad organizativa si se proporciona
    if (organizationalUnitId) {
      queryBuilder.andWhere(
        'Transfer.organizational_unit_id = :organizationalUnitId',
        { organizationalUnitId },
      );
    }

    return await queryBuilder.getMany();
  }

  async findOne(
    id: number,
    projectId?: number,
    organizationalUnitId?: number,
  ): Promise<Transfer> {
    const queryBuilder = this.transferRepository
      .createQueryBuilder('Transfer')
      .leftJoinAndSelect('Transfer.vehicle', 'vehicle')
      .leftJoinAndSelect('Transfer.client', 'client')
      .leftJoinAndSelect('Transfer.transmitter', 'transmitter')
      .leftJoin('projects', 'project', 'project.id = Transfer.project_id')
      .addSelect([
        'project.id',
        'project.name',
        'project.description',
        'project.created_at',
      ])
      .leftJoinAndSelect('Transfer.organizationalUnit', 'organizationalUnit')
      .where('Transfer.id = :id', { id });

    // Filtrar por proyecto si se proporciona
    if (projectId) {
      queryBuilder.andWhere('Transfer.project_id = :projectId', { projectId });
    }

    // Filtrar por unidad organizativa si se proporciona
    if (organizationalUnitId) {
      queryBuilder.andWhere(
        'Transfer.organizational_unit_id = :organizationalUnitId',
        { organizationalUnitId },
      );
    }

    const transfer = await queryBuilder.getOne();

    if (!transfer) {
      throw new Error('Transferencia no encontrada');
    }

    return transfer;
  }
}
