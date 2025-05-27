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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
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

@ApiTags('transfers')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Create a new transfer' })
  @ApiBody({ type: CreateTransferDto })
  @ApiResponse({
    status: 201,
    description: 'The transfer has been successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
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
  @ApiOperation({ summary: 'Get all transfers' })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: Number,
    description: 'Filter by project ID',
  })
  @ApiQuery({
    name: 'organizationalUnitId',
    required: false,
    type: Number,
    description: 'Filter by organizational unit ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all transfers matching the criteria',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
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
  @ApiOperation({ summary: 'Get a transfer by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer ID' })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: Number,
    description: 'Filter by project ID',
  })
  @ApiQuery({
    name: 'organizationalUnitId',
    required: false,
    type: Number,
    description: 'Filter by organizational unit ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the transfer with the specified ID',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
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
