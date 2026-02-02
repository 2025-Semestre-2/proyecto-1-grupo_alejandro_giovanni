INSERT INTO dbo.TipoIdentificacion (Nombre) VALUES ('Pasaporte');
INSERT INTO dbo.TipoIdentificacion (Nombre) VALUES ('DIMEX');
INSERT INTO dbo.TipoIdentificacion (Nombre) VALUES ('Cédula Nacional');
INSERT INTO dbo.TipoIdentificacion (Nombre) VALUES ('Otro');

SET IDENTITY_INSERT Provincias ON;

INSERT INTO Provincias (IdProvincia, Nombre) VALUES (1, 'San José');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (2, 'Alajuela');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (3, 'Cartago');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (4, 'Heredia');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (5, 'Guanacaste');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (6, 'Puntarenas');
INSERT INTO Provincias (IdProvincia, Nombre) VALUES (7, 'Limón');

SET IDENTITY_INSERT Provincias OFF;

-- Insert Cantones
SET IDENTITY_INSERT Cantones ON;

-- San José
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (1, 'Central', 1);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (2, 'Escazú', 1);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (3, 'Desamparados', 1);

-- Alajuela
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (4, 'Alajuela', 2);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (5, 'Grecia', 2);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (6, 'San Ramón', 2);

-- Cartago
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (7, 'Cartago', 3);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (8, 'Paraíso', 3);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (9, 'La Unión', 3);

-- Heredia
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (10, 'Heredia', 4);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (11, 'Barva', 4);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (12, 'Santo Domingo', 4);

-- Guanacaste
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (13, 'Liberia', 5);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (14, 'Nicoya', 5);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (15, 'Santa Cruz', 5);

-- Puntarenas
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (16, 'Puntarenas', 6);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (17, 'Esparza', 6);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (18, 'Buenos Aires', 6);

-- Limón
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (19, 'Limón', 7);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (20, 'Pococí', 7);
INSERT INTO Cantones (IdCanton, Nombre, IdProvincia) VALUES (21, 'Talamanca', 7);

SET IDENTITY_INSERT Cantones OFF;

-- Insert Distritos
SET IDENTITY_INSERT Distritos ON;

-- San José Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (1, 'Carmen', 1);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (2, 'Merced', 1);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (3, 'Hospital', 1);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (4, 'Catedral', 1);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (5, 'Zapote', 1);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (6, 'Escazú', 2);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (7, 'San Antonio', 2);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (8, 'San Rafael', 2);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (9, 'San Miguel', 2);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (10, 'San José de la Montaña', 2);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (11, 'Desamparados', 3);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (12, 'San Miguel', 3);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (13, 'San Juan de Dios', 3);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (14, 'San Rafael Arriba', 3);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (15, 'San Antonio', 3);

-- Alajuela Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (16, 'Alajuela', 4);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (17, 'San José', 4);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (18, 'Carrizal', 4);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (19, 'San Antonio', 4);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (20, 'San Isidro', 4);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (21, 'Grecia', 5);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (22, 'San Isidro', 5);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (23, 'San José', 5);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (24, 'San Roque', 5);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (25, 'Tacares', 5);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (26, 'San Ramón', 6);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (27, 'Santiago', 6);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (28, 'San Juan', 6);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (29, 'Piedades Norte', 6);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (30, 'Piedades Sur', 6);

-- Cartago Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (31, 'Oriental', 7);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (32, 'Occidental', 7);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (33, 'Carmen', 7);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (34, 'San Nicolás', 7);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (35, 'Aguacaliente', 7);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (36, 'Paraíso', 8);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (37, 'Santiago', 8);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (38, 'Orosi', 8);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (39, 'Cachí', 8);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (40, 'Llanos de Santa Lucía', 8);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (41, 'Tres Ríos', 9);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (42, 'San Diego', 9);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (43, 'San Juan', 9);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (44, 'San Rafael', 9);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (45, 'Concepción', 9);

-- Heredia Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (46, 'Heredia', 10);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (47, 'Mercedes', 10);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (48, 'San Francisco', 10);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (49, 'Ulloa', 10);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (50, 'Varablanca', 10);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (51, 'Barva', 11);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (52, 'San Pedro', 11);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (53, 'San Pablo', 11);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (54, 'San Roque', 11);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (55, 'Santa Lucía', 11);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (56, 'Santo Domingo', 12);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (57, 'San Vicente', 12);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (58, 'San Miguel', 12);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (59, 'Paracito', 12);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (60, 'Santo Tomás', 12);

-- Guanacaste Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (61, 'Liberia', 13);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (62, 'Cañas Dulces', 13);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (63, 'Mayorga', 13);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (64, 'Nacascolo', 13);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (65, 'Curubandé', 13);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (66, 'Nicoya', 14);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (67, 'Mansión', 14);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (68, 'San Antonio', 14);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (69, 'Quebrada Honda', 14);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (70, 'Sámara', 14);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (71, 'Santa Cruz', 15);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (72, 'Bolsón', 15);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (73, 'Veintisiete de Abril', 15);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (74, 'Tempate', 15);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (75, 'Cartagena', 15);

-- Puntarenas Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (76, 'Puntarenas', 16);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (77, 'Pitahaya', 16);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (78, 'Chomes', 16);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (79, 'Lepanto', 16);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (80, 'Paquera', 16);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (81, 'Espíritu Santo', 17);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (82, 'San Juan Grande', 17);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (83, 'Macacona', 17);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (84, 'San Rafael', 17);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (85, 'San Jerónimo', 17);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (86, 'Buenos Aires', 18);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (87, 'Volcán', 18);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (88, 'Potrero Grande', 18);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (89, 'Boruca', 18);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (90, 'Pilas', 18);

-- Limón Cantones
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (91, 'Limón', 19);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (92, 'Valle La Estrella', 19);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (93, 'Río Blanco', 19);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (94, 'Matama', 19);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (95, 'Bataan', 19);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (96, 'Guápiles', 20);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (97, 'Jiménez', 20);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (98, 'La Rita', 20);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (99, 'Río Azul', 20);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (100, 'Cariari', 20);

INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (101, 'Bratsi', 21);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (102, 'Sixaola', 21);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (103, 'Cahuita', 21);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (104, 'Telire', 21);
INSERT INTO Distritos (IdDistrito, Nombre, IdCanton) VALUES (105, 'Kekoldi', 21);

SET IDENTITY_INSERT Distritos OFF;

SET IDENTITY_INSERT dbo.Amenidades ON;

INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (1, 'Wifi');
INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (2, 'Piscina');
INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (3, 'Parqueo');
INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (4, 'Aire Acondicionado');
INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (5, 'Cocina');
INSERT INTO dbo.Amenidades (AmenidadId, Nombre) VALUES (6, 'Lavadora');

SET IDENTITY_INSERT dbo.Amenidades OFF;

SET IDENTITY_INSERT dbo.TipoEmpresa ON;

INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (1, 'Recreación');
INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (2, 'Hotel');
INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (3, 'Hostal');
INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (4, 'Casa');
INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (5, 'Departamento');
INSERT INTO dbo.TipoEmpresa (TipoEmpresaId, Nombre) VALUES (6, 'Cuarto Compartido');

SET IDENTITY_INSERT dbo.TipoEmpresa OFF;
GO

INSERT INTO dbo.RedesSociales (Nombre) VALUES ('Facebook'), ('Instagram'), ('WhatsApp'), ('Twitter');

select * from CargosHabitacion