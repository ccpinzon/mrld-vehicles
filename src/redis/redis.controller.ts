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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RedisService } from './redis.service';

@ApiTags('redis')
@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Check Redis connection' })
  @ApiResponse({
    status: 200,
    description: 'Redis connection is working',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Redis connection is working' },
        result: { type: 'string', example: 'PONG' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to connect to Redis',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Failed to connect to Redis' },
        error: { type: 'string' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Set a key-value pair in Redis' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['key', 'value'],
      properties: {
        key: { type: 'string', example: 'myKey' },
        value: { type: 'string', example: 'myValue' },
        ttl: {
          type: 'number',
          example: 3600,
          description: 'Time to live in seconds (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Key set successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Key myKey set successfully' },
        result: { type: 'string', example: 'OK' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to set key in Redis',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Failed to set key in Redis' },
        error: { type: 'string' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Get a value by key from Redis' })
  @ApiParam({
    name: 'key',
    description: 'Redis key to retrieve',
    example: 'myKey',
  })
  @ApiResponse({
    status: 200,
    description: 'Key retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Key myKey retrieved successfully',
        },
        value: { type: 'string', example: 'myValue' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Key not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Key myKey not found' },
        value: { type: 'null', example: null },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to get key from Redis',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Failed to get key from Redis' },
        error: { type: 'string' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Delete a key from Redis' })
  @ApiParam({
    name: 'key',
    description: 'Redis key to delete',
    example: 'myKey',
  })
  @ApiResponse({
    status: 200,
    description: 'Key deleted successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Key myKey deleted successfully' },
        result: {
          type: 'number',
          example: 1,
          description: 'Number of keys deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete key from Redis',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Failed to delete key from Redis' },
        error: { type: 'string' },
      },
    },
  })
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
