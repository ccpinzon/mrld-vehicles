import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from '../dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  async create(@Body() createTransferDto: CreateTransferDto) {
    return await this.transfersService.create(createTransferDto);
  }

  @Get()
  async findAll() {
    return await this.transfersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.transfersService.findOne(id);
  }
}
