import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as entities from '../entities';
import { seedDatabase } from './seed';

async function bootstrap() {
  // Initialize ConfigModule to load environment variables from .env file
  ConfigModule.forRoot({
    isGlobal: true,
  });

  const configService = new ConfigService();

  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'password'),
    database: configService.get('DB_NAME', 'vehicle_transfers_db'),
    entities: Object.values(entities),
    synchronize: true,
    dropSchema: true,
    ssl:
      configService.get<string>('DB_SSL_REQUIRED') === 'true'
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    await seedDatabase(dataSource);

    console.log('Seeding completado exitosamente');
  } catch (error) {
    console.error('Error durante el seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

void bootstrap();
