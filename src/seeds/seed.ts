import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Role,
  Permission,
  Project,
  OrganizationalUnit,
  Vehicle,
} from '../entities';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const projectRepository = dataSource.getRepository(Project);
  const organizationalUnitRepository =
    dataSource.getRepository(OrganizationalUnit);
  const vehicleRepository = dataSource.getRepository(Vehicle);

  // Crear permisos
  const permissions = await permissionRepository.save([
    {
      name: 'view_transfers',
      description: 'Ver transferencias',
    },
    {
      name: 'create_transfers',
      description: 'Crear transferencias',
    },
    {
      name: 'edit_transfers',
      description: 'Editar transferencias',
    },
    {
      name: 'delete_transfers',
      description: 'Eliminar transferencias',
    },
    {
      name: 'manage_users',
      description: 'Gestionar usuarios',
    },
  ]);

  // Crear roles
  const adminRole = await roleRepository.save({
    name: 'admin',
    description: 'Administrador del sistema',
  });

  const userRole = await roleRepository.save({
    name: 'user',
    description: 'Usuario estándar',
  });

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await userRepository.save({
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: hashedPassword,
  });

  const regularUser = await userRepository.save({
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: hashedPassword,
  });

  const clientUser = await userRepository.save({
    username: 'client1',
    email: 'client1@example.com',
    passwordHash: hashedPassword,
  });

  // Crear proyectos
  const project1 = await projectRepository.save({
    name: 'Proyecto Vehículos Oficiales',
    description: 'Gestión de vehículos oficiales del gobierno',
  });

  const project2 = await projectRepository.save({
    name: 'Proyecto Transporte Público',
    description: 'Gestión de vehículos de transporte público',
  });

  // Crear unidades organizativas
  const orgUnit1 = await organizationalUnitRepository.save({
    name: 'Ministerio de Transporte',
    projectId: project1.id,
  });

  const orgUnit2 = await organizationalUnitRepository.save({
    name: 'Secretaría de Movilidad',
    projectId: project1.id,
  });

  const orgUnit3 = await organizationalUnitRepository.save({
    name: 'Empresa de Transporte',
    projectId: project2.id,
  });

  // Crear vehículos
  await vehicleRepository.save([
    {
      plate: 'ABC-123',
      service: 'Oficial',
    },
    {
      plate: 'DEF-456',
      service: 'Público',
    },
    {
      plate: 'GHI-789',
      service: 'Particular',
    },
    {
      plate: 'JKL-012',
      service: 'Oficial',
    },
  ]);

  console.log('Base de datos inicializada con datos de ejemplo');
  console.log('Usuarios creados:');
  console.log('- admin@example.com (password: password123)');
  console.log('- user1@example.com (password: password123)');
  console.log('- client1@example.com (password: password123)');
}
