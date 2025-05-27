<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Vehicle Transfers API

API RESTful desarrollada con NestJS y TypeORM para la gestión de transferencias de vehículos, incluyendo usuarios, roles, permisos, proyectos y unidades organizativas.

## Características

- ✅ **Entidades TypeORM completas** basadas en DDL PostgreSQL
- ✅ **Relaciones Many-to-Many y One-to-Many** implementadas
- ✅ **Validaciones con class-validator**
- ✅ **DTOs para transferencia de datos**
- ✅ **Servicios y controladores CRUD**
- ✅ **Configuración por variables de entorno**
- ✅ **Scripts de seeding para datos de prueba**
- ✅ **Docker Compose para desarrollo**


## Configuración Rápida

### 1. Instalación

```bash
npm install
```

### 2. Base de Datos con Docker

```bash
# Iniciar PostgreSQL con Docker Compose
docker-compose up postgres -d

# O usar PostgreSQL local y crear la base de datos
createdb vehicle_transfers
```

### 3. Ejecutar Migraciones y Seeding

```bash
# Las migraciones se ejecutan automáticamente con synchronize: true
# Ejecutar seeding para datos de prueba
npm run seed
```

### 4. Iniciar la Aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## API Endpoints

### Transfers

- `POST /transfers` - Crear nueva transferencia
- `GET /transfers` - Listar todas las transferencias
- `GET /transfers/:id` - Obtener transferencia por ID

### Usuarios (Próximamente)

- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario por ID

### Vehículos (Próximamente)

- `POST /vehicles` - Crear vehículo
- `GET /vehicles` - Listar vehículos
- `GET /vehicles/:id` - Obtener vehículo por ID

## Ejemplo de Uso

### Crear una Transferencia

```bash
curl -X POST http://localhost:3000/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Venta",
    "vehicleId": 1,
    "clientId": 2,
    "transmitterId": 3,
    "projectId": 1,
    "organizationalUnitId": 1
  }'
```

### Listar Transferencias

```bash
curl http://localhost:3000/transfers
```

## Desarrollo con Docker

```bash
# Iniciar todo el stack
docker-compose up

# Solo la base de datos
docker-compose up postgres -d

# Rebuild de la aplicación
docker-compose up --build app
```

## Scripts Disponibles

```bash
# Compilar proyecto
npm run build

# Ejecutar seeding
npm run seed

# Tests
npm run test

# Linting
npm run lint

# Formateo de código
npm run format
```


## Next Steps

- [ ] Autenticación JWT
- [ ] Endpoints CRUD completos para todas las entidades
- [ ] Paginación y filtros
- [ ] Auditoría de cambios
- [ ] Tests unitarios e integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Logs estructurados


# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov

````

