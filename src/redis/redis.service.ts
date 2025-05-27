import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis.RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Use the Redis URL from Render
      const redisURI = this.configService.get<string>('REDIS_URL');
      const redisUrl = redisURI || 'redis://localhost:6379';
      this.logger.log(`Connecting to Redis at ${redisUrl}`);

      const nodeEnv = this.configService.get<string>('NODE_ENV');
      const isTlsEnabled = nodeEnv !== 'production';
      this.logger.log(
        `Redis TLS is ${isTlsEnabled ? 'enabled' : 'disabled'} for ${nodeEnv} environment`,
      );

      this.client = Redis.createClient({
        url: redisUrl,
        socket: {
          tls: isTlsEnabled,
          rejectUnauthorized: false,
        },
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
      });

      this.client.on('connect', () => {
        this.logger.log('Redis Client Connected');
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis Client Disconnected');
    }
  }

  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch (error) {
      this.logger.error('Redis ping failed', error);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<string | null> {
    try {
      if (ttl) {
        return await this.client.set(key, value, { EX: ttl });
      }
      return await this.client.set(key, value);
    } catch (error) {
      this.logger.error(`Failed to set key ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Failed to get key ${key}`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}`, error);
      throw error;
    }
  }
}
