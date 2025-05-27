DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS user_organizational_units CASCADE;
DROP TABLE IF EXISTS organizational_units CASCADE;
DROP TABLE IF EXISTS user_projects CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabla: users
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(100) UNIQUE NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: roles
CREATE TABLE roles (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL,
                       description TEXT
);

-- Tabla: permissions
CREATE TABLE permissions (
                             id SERIAL PRIMARY KEY,
                             name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'view_transfers', 'edit_transfers'
                             description TEXT
);

-- Tabla: projects
CREATE TABLE projects (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: organizational_units
CREATE TABLE organizational_units (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(100) NOT NULL,
                                      project_id INTEGER NOT NULL,
                                      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      CONSTRAINT fk_project
                                          FOREIGN KEY(project_id)
                                              REFERENCES projects(id)
                                              ON DELETE CASCADE, -- Si se borra un proyecto, se borran sus unidades organizativas
                                      CONSTRAINT uq_org_unit_id_project_id UNIQUE (id, project_id) -- Para la FK compuesta en transfers
);

-- Tabla: vehicles
CREATE TABLE vehicles (
                          id SERIAL PRIMARY KEY,
                          plate VARCHAR(20) UNIQUE NOT NULL,
                          service VARCHAR(50), -- e.g., 'Particular', 'Público'
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de unión: user_roles (Muchos a Muchos entre users y roles)
CREATE TABLE user_roles (
                            user_id INTEGER NOT NULL,
                            role_id INTEGER NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            CONSTRAINT fk_user
                                FOREIGN KEY(user_id)
                                    REFERENCES users(id)
                                    ON DELETE CASCADE,
                            CONSTRAINT fk_role
                                FOREIGN KEY(role_id)
                                    REFERENCES roles(id)
                                    ON DELETE CASCADE
);

-- Tabla de unión: role_permissions (Muchos a Muchos entre roles y permissions)
CREATE TABLE role_permissions (
                                  role_id INTEGER NOT NULL,
                                  permission_id INTEGER NOT NULL,
                                  PRIMARY KEY (role_id, permission_id),
                                  CONSTRAINT fk_role
                                      FOREIGN KEY(role_id)
                                          REFERENCES roles(id)
                                          ON DELETE CASCADE,
                                  CONSTRAINT fk_permission
                                      FOREIGN KEY(permission_id)
                                          REFERENCES permissions(id)
                                          ON DELETE CASCADE
);

-- Tabla de unión: user_projects (Muchos a Muchos entre users y projects)
CREATE TABLE user_projects (
                               user_id INTEGER NOT NULL,
                               project_id INTEGER NOT NULL,
                               PRIMARY KEY (user_id, project_id),
                               CONSTRAINT fk_user
                                   FOREIGN KEY(user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE,
                               CONSTRAINT fk_project
                                   FOREIGN KEY(project_id)
                                       REFERENCES projects(id)
                                       ON DELETE CASCADE
);

-- Tabla de unión: user_organizational_units (Muchos a Muchos entre users y organizational_units)
CREATE TABLE user_organizational_units (
                                           user_id INTEGER NOT NULL,
                                           organizational_unit_id INTEGER NOT NULL,
                                           PRIMARY KEY (user_id, organizational_unit_id),
                                           CONSTRAINT fk_user
                                               FOREIGN KEY(user_id)
                                                   REFERENCES users(id)
                                                   ON DELETE CASCADE,
                                           CONSTRAINT fk_organizational_unit
                                               FOREIGN KEY(organizational_unit_id)
                                                   REFERENCES organizational_units(id)
                                                   ON DELETE CASCADE
);

-- Tabla: transfers
CREATE TABLE transfers (
                           id SERIAL PRIMARY KEY,
                           type VARCHAR(50) NOT NULL, -- e.g., 'Venta', 'Donación', 'Traspaso Interno'
                           vehicle_id INTEGER NOT NULL,
                           client_id INTEGER NOT NULL, -- FK a users.id
                           transmitter_id INTEGER NOT NULL, -- FK a users.id
                           project_id INTEGER NOT NULL,
                           organizational_unit_id INTEGER NOT NULL,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_vehicle
                               FOREIGN KEY(vehicle_id)
                                   REFERENCES vehicles(id)
                                   ON DELETE RESTRICT, -- No permitir borrar vehículo si tiene transferencias
                           CONSTRAINT fk_client
                               FOREIGN KEY(client_id)
                                   REFERENCES users(id)
                                   ON DELETE RESTRICT, -- No permitir borrar usuario cliente si tiene transferencias
                           CONSTRAINT fk_transmitter
                               FOREIGN KEY(transmitter_id)
                                   REFERENCES users(id)
                                   ON DELETE RESTRICT, -- No permitir borrar usuario transmitente si tiene transferencias

    -- Esta FK asegura que la organizational_unit_id existe y pertenece al project_id especificado.
    -- Requiere la constraint uq_org_unit_id_project_id en la tabla organizational_units.
                           CONSTRAINT fk_transfer_organizational_unit_project
                               FOREIGN KEY(organizational_unit_id, project_id)
                                   REFERENCES organizational_units(id, project_id)
                                   ON DELETE RESTRICT, -- No permitir borrar unidad organizativa o proyecto si tiene transferencias
    -- (La restricción sobre el proyecto ya está cubierta por organizational_units.project_id)

    /*
    CONSTRAINT fk_transfer_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE RESTRICT,
    */
    /*
    CONSTRAINT fk_transfer_organizational_unit
        FOREIGN KEY(organizational_unit_id)
        REFERENCES organizational_units(id)
        ON DELETE RESTRICT
    */

    -- client_id y transmitter_id no pueden ser el mismo
                           CONSTRAINT chk_client_transmitter_different
                               CHECK (client_id <> transmitter_id)
);

-- Índices para columnas comúnmente consultadas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_transfers_vehicle_id ON transfers(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transfers_client_id ON transfers(client_id);
CREATE INDEX IF NOT EXISTS idx_transfers_transmitter_id ON transfers(transmitter_id);
CREATE INDEX IF NOT EXISTS idx_transfers_project_id ON transfers(project_id);
CREATE INDEX IF NOT EXISTS idx_transfers_organizational_unit_id ON transfers(organizational_unit_id);
CREATE INDEX IF NOT EXISTS idx_organizational_units_project_id ON organizational_units(project_id);