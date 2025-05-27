import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Role,
  Permission,
  Project,
  OrganizationalUnit,
  Vehicle,
  Transfer,
} from '../entities';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const projectRepository = dataSource.getRepository(Project);
  const organizationalUnitRepository =
    dataSource.getRepository(OrganizationalUnit);
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const transferRepository = dataSource.getRepository(Transfer);

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
    permissions: permissions, // Asignar todos los permisos al rol de administrador
  });

  const userRole = await roleRepository.save({
    name: 'user',
    description: 'Usuario estándar',
    permissions: permissions.filter(p => 
      ['view_transfers', 'create_transfers'].includes(p.name)
    ), // Asignar permisos limitados al rol de usuario
  });

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await userRepository.save({
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: hashedPassword,
    roles: [adminRole], // Asignar rol de administrador
  });

  const regularUser = await userRepository.save({
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: hashedPassword,
    roles: [userRole], // Asignar rol de usuario estándar
  });

  const clientUser = await userRepository.save({
    username: 'client1',
    email: 'client1@example.com',
    passwordHash: hashedPassword,
    roles: [userRole], // Asignar rol de usuario estándar
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

  // Asignar proyectos a usuarios
  await userRepository.save({
    ...adminUser,
    projects: [project1, project2], // Admin tiene acceso a todos los proyectos
  });

  await userRepository.save({
    ...regularUser,
    projects: [project1], // Usuario regular tiene acceso al proyecto 1
  });

  await userRepository.save({
    ...clientUser,
    projects: [project2], // Cliente tiene acceso al proyecto 2
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

  // Asignar unidades organizativas a usuarios
  await userRepository.save({
    ...adminUser,
    organizationalUnits: [orgUnit1, orgUnit2, orgUnit3], // Admin tiene acceso a todas las unidades
  });

  await userRepository.save({
    ...regularUser,
    organizationalUnits: [orgUnit1, orgUnit2], // Usuario regular tiene acceso a unidades del proyecto 1
  });

  await userRepository.save({
    ...clientUser,
    organizationalUnits: [orgUnit3], // Cliente tiene acceso a unidades del proyecto 2
  });

  // Crear vehículos
  const vehicles = await vehicleRepository.save([
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

  // Crear transferencias
  await transferRepository.save([
    {
      type: 'Venta',
      vehicleId: vehicles[0].id,
      clientId: clientUser.id,
      transmitterId: regularUser.id,
      projectId: project1.id,
      organizationalUnitId: orgUnit1.id,
      createdAt: new Date('2023-01-15'),
    },
    {
      type: 'Donación',
      vehicleId: vehicles[1].id,
      clientId: clientUser.id,
      transmitterId: adminUser.id,
      projectId: project2.id,
      organizationalUnitId: orgUnit3.id,
      createdAt: new Date('2023-02-20'),
    },
    {
      type: 'Traspaso Interno',
      vehicleId: vehicles[2].id,
      clientId: regularUser.id,
      transmitterId: adminUser.id,
      projectId: project1.id,
      organizationalUnitId: orgUnit2.id,
      createdAt: new Date('2023-03-10'),
    },
  ]);

  console.log('Base de datos inicializada con datos de ejemplo');
  console.log('Usuarios creados:');
  console.log('- admin@example.com (password: password123)');
  console.log('- user1@example.com (password: password123)');
  console.log('- client1@example.com (password: password123)');
}
