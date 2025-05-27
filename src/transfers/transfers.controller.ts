import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  PermissionsGuard,
  ProjectAccessGuard,
  OrganizationalUnitAccessGuard,
  OrganizationalUnitProjectRelationGuard,
  Permissions,
} from '../auth';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from '../dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
    ProjectAccessGuard,
    OrganizationalUnitAccessGuard,
    OrganizationalUnitProjectRelationGuard,
  )
  @Permissions('create_transfers')
  async create(@Body() createTransferDto: CreateTransferDto) {
    return await this.transfersService.create(createTransferDto);
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
    ProjectAccessGuard,
    OrganizationalUnitAccessGuard,
    OrganizationalUnitProjectRelationGuard,
  )
  @Permissions('view_transfers')
  async findAll(
    @Query('projectId') projectId?: number,
    @Query('organizationalUnitId') organizationalUnitId?: number,
  ) {
    return await this.transfersService.findAll(projectId, organizationalUnitId);
  }

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
    ProjectAccessGuard,
    OrganizationalUnitAccessGuard,
    OrganizationalUnitProjectRelationGuard,
  )
  @Permissions('view_transfers')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId') projectId?: number,
    @Query('organizationalUnitId') organizationalUnitId?: number,
  ) {
    return await this.transfersService.findOne(
      id,
      projectId,
      organizationalUnitId,
    );
  }
}
