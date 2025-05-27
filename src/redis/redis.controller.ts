import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('ping')
  async ping() {
    try {
      const result = await this.redisService.ping();
      return {
        status: 'success',
        message: 'Redis connection is working',
        result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to connect to Redis',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('set')
  async set(@Body() body: { key: string; value: string; ttl?: number }) {
    try {
      const { key, value, ttl } = body;
      const result = await this.redisService.set(key, value, ttl);
      return {
        status: 'success',
        message: `Key ${key} set successfully`,
        result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to set key in Redis',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get/:key')
  async get(@Param('key') key: string) {
    try {
      const value = await this.redisService.get(key);
      if (value === null) {
        return {
          status: 'success',
          message: `Key ${key} not found`,
          value: null,
        };
      }
      return {
        status: 'success',
        message: `Key ${key} retrieved successfully`,
        value,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to get key from Redis',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:key')
  async delete(@Param('key') key: string) {
    try {
      const result = await this.redisService.del(key);
      return {
        status: 'success',
        message: `Key ${key} deleted successfully`,
        result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete key from Redis',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
