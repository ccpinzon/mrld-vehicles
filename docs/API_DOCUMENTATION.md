# API Documentation

This document provides examples of how to use the Vehicle Transfers API endpoints using cURL.

## Table of Contents

- [Authentication](#authentication)
- [Transfers](#transfers)
- [Users](#users)
- [Vehicles](#vehicles)
- [Redis](#redis)
- [Transfer Reports](#transfer-reports)

## Authentication

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

## Transfers

### Create a new transfer

```bash
curl -X POST http://localhost:3000/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vehicleId": 1,
    "userId": 1,
    "projectId": 1,
    "organizationalUnitId": 1,
    "transferDate": "2023-01-01T00:00:00Z",
    "notes": "Transfer notes"
  }'
```

### Get all transfers

```bash
curl -X GET http://localhost:3000/transfers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get all transfers filtered by project and organizational unit

```bash
curl -X GET "http://localhost:3000/transfers?projectId=1&organizationalUnitId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get a transfer by ID

```bash
curl -X GET http://localhost:3000/transfers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Users

### Create a new user

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "secure_password",
    "role": "user"
  }'
```

### Get all users

```bash
curl -X GET http://localhost:3000/users
```

### Get a user by ID

```bash
curl -X GET http://localhost:3000/users/1
```

## Vehicles

### Create a new vehicle

```bash
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "licensePlate": "ABC123",
    "vin": "1HGCM82633A123456"
  }'
```

### Get all vehicles

```bash
curl -X GET http://localhost:3000/vehicles
```

### Get a vehicle by ID

```bash
curl -X GET http://localhost:3000/vehicles/1
```

## Redis

### Check Redis connection

```bash
curl -X GET http://localhost:3000/redis/ping
```

### Set a key-value pair in Redis

```bash
curl -X POST http://localhost:3000/redis/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "myKey",
    "value": "myValue",
    "ttl": 3600
  }'
```

### Get a value by key from Redis

```bash
curl -X GET http://localhost:3000/redis/get/myKey
```

### Delete a key from Redis

```bash
curl -X DELETE http://localhost:3000/redis/delete/myKey
```

## Transfer Reports

### Generate transfer report

```bash
curl -X GET http://localhost:3000/transfer-report/generate
```

This endpoint is also automatically called every day at 8 AM.