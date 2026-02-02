/* ============================================================
   Complemento Proyecto 2 - SGH (SQL Server)
   - Vistas (SELECT)
   - Stored Procedures (INSERT/UPDATE/DELETE)
   - Triggers (cierre de reserva => factura pendiente / bloquear deletes)
   - Índices
   - Roles/usuarios BD (admin vs usuario)
   Requiere que ya exista la BD PortalTurismoLimon y las tablas del ScriptSGHCreacion.sql
   ============================================================ */

USE PortalTurismoLimon;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

/* ----------------------------------------------------------------
   0) Ajustes mínimos de modelo
   - Reservacion: Estado (ACTIVO/CERRADO/CANCELADO)
   - Factura: EstadoPago (PENDIENTE/PAGADA), MetodoPago nullable, FechaPago
   ---------------------------------------------------------------- */
IF COL_LENGTH('dbo.Reservacion','Estado') IS NULL
BEGIN
    ALTER TABLE dbo.Reservacion
      ADD Estado NVARCHAR(20) NOT NULL
          CONSTRAINT DF_Reservacion_Estado DEFAULT(N'ACTIVO');
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_Reservacion_Estado' AND parent_object_id = OBJECT_ID('dbo.Reservacion')
)
BEGIN
    ALTER TABLE dbo.Reservacion
      ADD CONSTRAINT CK_Reservacion_Estado
      CHECK (Estado IN (N'CREADO', N'ACTIVO', N'CERRADO', N'CANCELADO'));
END
GO

/* Mantener compatibilidad con columna Activa BIT existente */
IF COL_LENGTH('dbo.Reservacion','Activa') IS NOT NULL
BEGIN
    UPDATE dbo.Reservacion
      SET Activa = CASE WHEN Estado = N'ACTIVO' THEN 1 ELSE 0 END
      WHERE Activa IS NULL OR Activa <> CASE WHEN Estado = N'ACTIVO' THEN 1 ELSE 0 END;
END
GO

IF COL_LENGTH('dbo.Factura','EstadoPago') IS NULL
BEGIN
    ALTER TABLE dbo.Factura
      ADD EstadoPago NVARCHAR(20) NOT NULL
          CONSTRAINT DF_Factura_EstadoPago DEFAULT(N'PENDIENTE'),
          FechaPago DATETIME2 NULL;
END
GO

BEGIN TRY
    IF EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID('dbo.Factura')
          AND name = 'MetodoPago'
          AND is_nullable = 0
    )
    BEGIN
        ALTER TABLE dbo.Factura ALTER COLUMN MetodoPago NVARCHAR(20) NULL;
    END
END TRY
BEGIN CATCH
END CATCH
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_Factura_EstadoPago' AND parent_object_id = OBJECT_ID('dbo.Factura')
)
BEGIN
    ALTER TABLE dbo.Factura
      ADD CONSTRAINT CK_Factura_EstadoPago
      CHECK (EstadoPago IN (N'PENDIENTE', N'PAGADA', N'ANULADA'));
END
GO

/* ----------------------------------------------------------------
   1) TRIGGERS
   ---------------------------------------------------------------- */

DROP TRIGGER IF EXISTS dbo.TR_Reservacion_Cierre_GeneraFactura;
GO
CREATE TRIGGER dbo.TR_Reservacion_Cierre_GeneraFactura
ON dbo.Reservacion
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH Cambios AS (
        SELECT i.ReservacionId, i.HabitacionId, i.FechaHoraIngreso, i.FechaSalida
        FROM inserted i
        JOIN deleted d ON d.ReservacionId = i.ReservacionId
        WHERE i.Estado = N'CERRADO'
          AND ISNULL(d.Estado, N'ACTIVO') <> N'CERRADO'
    )
    INSERT INTO dbo.Factura (ReservacionId, CargosHabitacion, Noches, TotalPagar, MetodoPago, EstadoPago)
    SELECT
        c.ReservacionId,
        CONCAT(
            N'Hospedaje: ', FORMAT(th.Precio, 'N2'),
            CASE WHEN cargos.CargosDesc IS NULL OR cargos.CargosDesc = N'' THEN N''
                 ELSE CONCAT(N' | Extras: ', cargos.CargosDesc) END
        ) AS CargosHabitacion,
        noches.Noches,
        CAST((th.Precio + ISNULL(cargos.TotalExtras,0)) * noches.Noches AS DECIMAL(12,2)) AS TotalPagar,
        NULL AS MetodoPago,
        N'PENDIENTE' AS EstadoPago
    FROM Cambios c
    JOIN dbo.Habitacion h ON h.HabitacionId = c.HabitacionId
    JOIN dbo.TipoHabitacion th ON th.TipoHabitacionId = h.TipoHabitacionId
    CROSS APPLY (
        SELECT CASE
                 WHEN DATEDIFF(DAY, CAST(c.FechaHoraIngreso AS DATE), c.FechaSalida) <= 0
                 THEN 1
                 ELSE DATEDIFF(DAY, CAST(c.FechaHoraIngreso AS DATE), c.FechaSalida)
               END AS Noches
    ) noches
    OUTER APPLY (
        SELECT
            STRING_AGG(CONCAT(tc.Nombre, N': ', FORMAT(ch.Precio,'N2')), N', ')
                WITHIN GROUP (ORDER BY tc.Nombre) AS CargosDesc,
            SUM(ch.Precio) AS TotalExtras
        FROM dbo.CargosHabitacion ch
        JOIN dbo.TiposDeCargo tc ON tc.TipoCargoId = ch.TipoCargoId
        WHERE ch.TipoHabitacionId = th.TipoHabitacionId
    ) cargos
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Factura f WHERE f.ReservacionId = c.ReservacionId
    );

    IF COL_LENGTH('dbo.Reservacion','Activa') IS NOT NULL
    BEGIN
        UPDATE r
           SET Activa = 0
        FROM dbo.Reservacion r
        JOIN inserted i ON i.ReservacionId = r.ReservacionId
        WHERE i.Estado = N'CERRADO';
    END
END
GO

DROP TRIGGER IF EXISTS dbo.TR_NoDelete_Factura;
GO
CREATE TRIGGER dbo.TR_NoDelete_Factura
ON dbo.Factura
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR(N'No se permite eliminar facturas. Debe quedar registro histórico.', 16, 1);
    ROLLBACK TRANSACTION;
END
GO

DROP TRIGGER IF EXISTS dbo.TR_NoDelete_Reservacion;
GO
CREATE TRIGGER dbo.TR_NoDelete_Reservacion
ON dbo.Reservacion
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR(N'No se permite eliminar reservaciones. Use CANCELADO si aplica.', 16, 1);
    ROLLBACK TRANSACTION;
END
GO

DROP TRIGGER IF EXISTS dbo.TR_NoDelete_Cliente_ConReservas;
GO
CREATE TRIGGER dbo.TR_NoDelete_Cliente_ConReservas
ON dbo.Cliente
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN dbo.Reservacion r ON r.ClienteId = d.ClienteId
    )
    BEGIN
        RAISERROR(N'No se permite eliminar clientes que ya poseen reservaciones asociadas.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE c
    FROM dbo.Cliente c
    JOIN deleted d ON d.ClienteId = c.ClienteId;
END
GO

DROP TRIGGER IF EXISTS dbo.TR_NoDelete_Empresa_ConReservas;
GO
CREATE TRIGGER dbo.TR_NoDelete_Empresa_ConReservas
ON dbo.Empresas
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- =============================================
    -- Block delete ONLY if ACTIVE reservations exist
    -- =============================================
    IF EXISTS (
        SELECT 1
        FROM deleted d
        INNER JOIN dbo.TipoHabitacion th
            ON th.CedulaJuridica = d.CedulaJuridica
        INNER JOIN dbo.Habitacion h
            ON h.TipoHabitacionId = th.TipoHabitacionId
        INNER JOIN dbo.Reservacion r
            ON r.HabitacionId = h.HabitacionId
        WHERE r.Activa = 1
    )
    BEGIN
        RAISERROR(
            N'No se permite eliminar la empresa porque tiene reservaciones activas.',
            16,
            1
        );
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- ==============================
    -- Safe delete (no active reservations)
    -- ==============================
    DELETE e
    FROM dbo.Empresas e
    INNER JOIN deleted d
        ON d.CedulaJuridica = e.CedulaJuridica;
END;
GO

DROP TRIGGER IF EXISTS dbo.TR_NoDelete_TipoHabitacion_ConReservas;
GO
CREATE TRIGGER dbo.TR_NoDelete_TipoHabitacion_ConReservas
ON dbo.TipoHabitacion
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- =============================================
    -- Block delete ONLY if ACTIVE reservations exist
    -- =============================================
    IF EXISTS (
        SELECT 1
        FROM deleted d
        INNER JOIN dbo.Habitacion h
            ON h.TipoHabitacionId = d.TipoHabitacionId
        INNER JOIN dbo.Reservacion r
            ON r.HabitacionId = h.HabitacionId
        WHERE r.Activa = 1
    )
    BEGIN
        RAISERROR(
            N'No se puede eliminar el tipo de habitación porque tiene reservaciones activas.',
            16,
            1
        );
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- ==============================
    -- Safe delete (no active reservations)
    -- ==============================
    DELETE th
    FROM dbo.TipoHabitacion th
    INNER JOIN deleted d
        ON d.TipoHabitacionId = th.TipoHabitacionId;
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_RecalcularPrecio_TipoHabitacion
ON dbo.CargosHabitacion
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Collect affected TipoHabitacionId values
    ;WITH HabitacionesAfectadas AS
    (
        SELECT TipoHabitacionId FROM inserted
        UNION
        SELECT TipoHabitacionId FROM deleted
    )
    UPDATE th
    SET Precio = ISNULL(c.TotalPrecio, 0)
    FROM dbo.TipoHabitacion th
    INNER JOIN HabitacionesAfectadas ha
        ON ha.TipoHabitacionId = th.TipoHabitacionId
    OUTER APPLY
    (
        SELECT SUM(Precio) AS TotalPrecio
        FROM dbo.CargosHabitacion ch
        WHERE ch.TipoHabitacionId = th.TipoHabitacionId
    ) c;
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_NoDelete_Habitacion_ConReservacionActiva
ON dbo.Habitacion
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- ============================================
    -- Block delete if ACTIVE reservation exists
    -- ============================================
    IF EXISTS (
        SELECT 1
        FROM deleted d
        INNER JOIN dbo.Reservacion r
            ON r.HabitacionId = d.HabitacionId
        WHERE r.Activa = 1
    )
    BEGIN
        RAISERROR (
            N'No se puede eliminar la habitación porque tiene una reservación activa.',
            16,
            1
        );
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- ============================
    -- Safe delete
    -- ============================
    DELETE h
    FROM dbo.Habitacion h
    INNER JOIN deleted d
        ON d.HabitacionId = h.HabitacionId;
END;
GO

/* ----------------------------------------------------------------
   2) VISTAS (LECTURAS)
   ---------------------------------------------------------------- */

DROP VIEW IF EXISTS dbo.vw_UbicacionDistrito;
GO
CREATE VIEW dbo.vw_UbicacionDistrito
AS
SELECT
    d.IdDistrito,
    d.Nombre AS Distrito,
    c.IdCanton,
    c.Nombre AS Canton,
    p.IdProvincia,
    p.Nombre AS Provincia
FROM dbo.Distritos d
JOIN dbo.Cantones c ON c.IdCanton = d.IdCanton
JOIN dbo.Provincias p ON p.IdProvincia = c.IdProvincia;
GO

DROP VIEW IF EXISTS dbo.vw_Hoteles;
GO
CREATE VIEW dbo.vw_Hoteles
AS
SELECT
    e.CedulaJuridica,
    e.Nombre AS HotelNombre,
    te.Nombre AS TipoEmpresa,
    e.CorreoContacto,
    e.Telefono1,
    e.Telefono2,
    e.SitioWeb,
    u.IdDistrito,
    u.Distrito,
    u.Canton,
    u.Provincia,
    e.Barrio,
    e.SenasExactas,
    e.Latitud,
    e.Longitud
FROM dbo.Empresas e
JOIN dbo.TipoEmpresa te ON te.TipoEmpresaId = e.TipoEmpresaId
JOIN dbo.vw_UbicacionDistrito u ON u.IdDistrito = e.IdDistrito;
GO

DROP VIEW IF EXISTS dbo.vw_TiposHabitacion;
GO
CREATE VIEW dbo.vw_TiposHabitacion
AS
SELECT
    th.TipoHabitacionId,
    th.CedulaJuridica,
    e.Nombre AS HotelNombre,
    th.Nombre AS TipoHabitacionNombre,
    th.Descripcion,
    th.Precio,
    th.NumeroDePersonas
FROM dbo.TipoHabitacion th
JOIN dbo.Empresas e ON e.CedulaJuridica = th.CedulaJuridica;
GO

DROP VIEW IF EXISTS dbo.vw_Habitaciones;
GO
CREATE VIEW dbo.vw_Habitaciones
AS
SELECT
    h.HabitacionId,
    h.CedulaJuridica,
    e.Nombre AS HotelNombre,
    h.Numero,
    h.TipoHabitacionId,
    th.Nombre AS TipoHabitacionNombre,
    th.Precio,
    h.Activa
FROM dbo.Habitacion h
JOIN dbo.Empresas e ON e.CedulaJuridica = h.CedulaJuridica
JOIN dbo.TipoHabitacion th ON th.TipoHabitacionId = h.TipoHabitacionId;
GO

DROP VIEW IF EXISTS dbo.vw_Reservaciones;
GO
CREATE VIEW dbo.vw_Reservaciones
AS
SELECT
    r.ReservacionId,
    r.Estado,
    r.FechaHoraIngreso,
    r.FechaSalida,
    r.CantidadPersonas,
    r.TieneVehiculo,
    r.ClienteId,
    c.Nombre,
    c.Apellido1,
    c.Apellido2,
    c.NumeroIdentificacion,
    r.HabitacionId,
    h.Numero AS HabitacionNumero,
    th.TipoHabitacionId,
    th.Nombre AS TipoHabitacionNombre,
    e.CedulaJuridica,
    e.Nombre AS HotelNombre
FROM dbo.Reservacion r
JOIN dbo.Cliente c ON c.ClienteId = r.ClienteId
JOIN dbo.Habitacion h ON h.HabitacionId = r.HabitacionId
JOIN dbo.TipoHabitacion th ON th.TipoHabitacionId = h.TipoHabitacionId
JOIN dbo.Empresas e ON e.CedulaJuridica = h.CedulaJuridica;
GO

DROP VIEW IF EXISTS dbo.vw_FacturacionDetalle;
GO
CREATE VIEW dbo.vw_FacturacionDetalle
AS
SELECT
    f.FacturaId,
    f.ReservacionId,
    f.FechaHoraRegistro,
    f.CargosHabitacion,
    f.Noches,
    f.TotalPagar,
    f.MetodoPago,
    f.EstadoPago,
    f.FechaPago,
    r.FechaHoraIngreso,
    r.FechaSalida,
    r.Estado AS EstadoReservacion,
    th.TipoHabitacionId,
    th.Nombre AS TipoHabitacionNombre,
    h.HabitacionId,
    h.Numero AS HabitacionNumero,
    e.CedulaJuridica,
    e.Nombre AS HotelNombre,
    u.Provincia,
    u.Canton,
    u.Distrito
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.ReservacionId = f.ReservacionId
JOIN dbo.Habitacion h ON h.HabitacionId = r.HabitacionId
JOIN dbo.TipoHabitacion th ON th.TipoHabitacionId = h.TipoHabitacionId
JOIN dbo.Empresas e ON e.CedulaJuridica = h.CedulaJuridica
JOIN dbo.vw_UbicacionDistrito u ON u.IdDistrito = e.IdDistrito;
GO

/* ----------------------------------------------------------------
   3) STORED PROCEDURES (DML)
   ---------------------------------------------------------------- */

DROP PROCEDURE IF EXISTS dbo.sp_Reservacion_Crear;
GO
CREATE PROCEDURE dbo.sp_Reservacion_Crear
    @ClienteId INT,
    @HabitacionId INT,
    @FechaHoraIngreso DATETIME2,
    @FechaSalida DATE,
    @CantidadPersonas INT,
    @TieneVehiculo BIT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM dbo.Reservacion r
        WHERE r.HabitacionId = @HabitacionId
          AND r.Estado = N'ACTIVO'
          AND (
                @FechaHoraIngreso < DATEADD(DAY, 1, CAST(r.FechaSalida AS DATETIME2))
            AND CAST(@FechaSalida AS DATETIME2) > r.FechaHoraIngreso
          )
    )
    BEGIN
        RAISERROR(N'La habitación no está disponible para el rango de fechas indicado.', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.Reservacion
        (ClienteId, HabitacionId, FechaHoraIngreso, FechaSalida, CantidadPersonas, TieneVehiculo, Activa, Estado)
    VALUES
        (@ClienteId, @HabitacionId, @FechaHoraIngreso, @FechaSalida, @CantidadPersonas, @TieneVehiculo, 1, N'ACTIVO');
END
GO

DROP PROCEDURE IF EXISTS dbo.sp_Reservacion_Cerrar;
GO
CREATE PROCEDURE dbo.sp_Reservacion_Cerrar
    @ReservacionId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Reservacion
       SET Estado = N'CERRADO',
           Activa = 0
     WHERE ReservacionId = @ReservacionId
       AND Estado = N'ACTIVO';
END
GO

DROP PROCEDURE IF EXISTS dbo.sp_Factura_Pagar;
GO
CREATE PROCEDURE dbo.sp_Factura_Pagar
    @FacturaId INT,
    @MetodoPago NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Factura
       SET EstadoPago = N'PAGADA',
           MetodoPago = @MetodoPago,
           FechaPago  = SYSDATETIME()
     WHERE FacturaId = @FacturaId
       AND EstadoPago = N'PENDIENTE';

    IF @@ROWCOUNT = 0
        RAISERROR(N'La factura no existe o no está en estado PENDIENTE.', 16, 1);
END
GO

/* ----------------------------------------------------------------
   4) REPORTES (SP que consultan sobre vistas)
   ---------------------------------------------------------------- */

DROP PROCEDURE IF EXISTS dbo.sp_Reporte_Facturado;
GO
CREATE PROCEDURE dbo.sp_Reporte_Facturado
    @FechaInicio DATE,
    @FechaFin DATE,
    @TipoHabitacionId INT = NULL,
    @HabitacionId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CAST(f.FechaHoraRegistro AS DATE) AS Fecha,
        f.HotelNombre,
        f.TipoHabitacionNombre,
        f.HabitacionNumero,
        COUNT(*) AS CantFacturas,
        SUM(f.TotalPagar) AS TotalFacturado
    FROM dbo.vw_FacturacionDetalle f
    WHERE CAST(f.FechaHoraRegistro AS DATE) BETWEEN @FechaInicio AND @FechaFin
      AND (@TipoHabitacionId IS NULL OR f.TipoHabitacionId = @TipoHabitacionId)
      AND (@HabitacionId IS NULL OR f.HabitacionId = @HabitacionId)
      AND f.EstadoPago IN (N'PENDIENTE', N'PAGADA')
    GROUP BY CAST(f.FechaHoraRegistro AS DATE), f.HotelNombre, f.TipoHabitacionNombre, f.HabitacionNumero
    ORDER BY Fecha, f.HotelNombre;
END
GO

DROP PROCEDURE IF EXISTS dbo.sp_Reporte_RangoEdades;
GO
CREATE PROCEDURE dbo.sp_Reporte_RangoEdades
    @FechaInicio DATE,
    @FechaFin DATE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH Base AS (
        SELECT
            r.ReservacionId,
            r.FechaHoraIngreso,
            c.FechaNacimiento,
            DATEDIFF(YEAR, c.FechaNacimiento, CAST(r.FechaHoraIngreso AS DATE))
              - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, c.FechaNacimiento, CAST(r.FechaHoraIngreso AS DATE)), c.FechaNacimiento) > CAST(r.FechaHoraIngreso AS DATE)
                     THEN 1 ELSE 0 END AS Edad
        FROM dbo.Reservacion r
        JOIN dbo.Cliente c ON c.ClienteId = r.ClienteId
        WHERE CAST(r.FechaHoraIngreso AS DATE) BETWEEN @FechaInicio AND @FechaFin
    )
    SELECT
        CASE
            WHEN Edad < 18 THEN N'<18'
            WHEN Edad BETWEEN 18 AND 25 THEN N'18-25'
            WHEN Edad BETWEEN 26 AND 35 THEN N'26-35'
            WHEN Edad BETWEEN 36 AND 50 THEN N'36-50'
            ELSE N'51+'
        END AS RangoEdad,
        COUNT(*) AS CantReservas
    FROM Base
    GROUP BY CASE
            WHEN Edad < 18 THEN N'<18'
            WHEN Edad BETWEEN 18 AND 25 THEN N'18-25'
            WHEN Edad BETWEEN 26 AND 35 THEN N'26-35'
            WHEN Edad BETWEEN 36 AND 50 THEN N'36-50'
            ELSE N'51+'
        END
    ORDER BY MIN(Edad);
END
GO

/* ----------------------------------------------------------------
   5) ÍNDICES
   ---------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Empresas_Nombre' AND object_id = OBJECT_ID('dbo.Empresas'))
    CREATE INDEX IX_Empresas_Nombre ON dbo.Empresas(Nombre);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Empresas_IdDistrito' AND object_id = OBJECT_ID('dbo.Empresas'))
    CREATE INDEX IX_Empresas_IdDistrito ON dbo.Empresas(IdDistrito);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Reservacion_Habitacion_Fechas' AND object_id = OBJECT_ID('dbo.Reservacion'))
    CREATE INDEX IX_Reservacion_Habitacion_Fechas ON dbo.Reservacion(HabitacionId, Estado, FechaHoraIngreso, FechaSalida);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Factura_Fecha' AND object_id = OBJECT_ID('dbo.Factura'))
    CREATE INDEX IX_Factura_Fecha ON dbo.Factura(FechaHoraRegistro) INCLUDE (TotalPagar, EstadoPago);
GO

CREATE INDEX IX_TipoHabitacionImagen_TipoHabitacionId
ON dbo.TipoHabitacionImagen (TipoHabitacionId, TipoHabitacionImagenID)
INCLUDE (UrlImagen);

/* ----------------------------------------------------------------
   6) ROLES BD
   ---------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE type = 'R' AND name = 'SGH_Admin')
    CREATE ROLE SGH_Admin AUTHORIZATION dbo;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE type = 'R' AND name = 'SGH_User')
    CREATE ROLE SGH_User AUTHORIZATION dbo;
GO

GRANT SELECT ON dbo.vw_Hoteles TO SGH_Admin;
GRANT SELECT ON dbo.vw_TiposHabitacion TO SGH_Admin;
GRANT SELECT ON dbo.vw_Habitaciones TO SGH_Admin;
GRANT SELECT ON dbo.vw_Reservaciones TO SGH_Admin;
GRANT SELECT ON dbo.vw_FacturacionDetalle TO SGH_Admin;

GRANT EXECUTE ON dbo.sp_Reservacion_Crear TO SGH_Admin;
GRANT EXECUTE ON dbo.sp_Reservacion_Cerrar TO SGH_Admin;
GRANT EXECUTE ON dbo.sp_Factura_Pagar TO SGH_Admin;
GRANT EXECUTE ON dbo.sp_Reporte_Facturado TO SGH_Admin;
GRANT EXECUTE ON dbo.sp_Reporte_RangoEdades TO SGH_Admin;
GO

GRANT SELECT ON dbo.vw_Hoteles TO SGH_User;
GRANT SELECT ON dbo.vw_TiposHabitacion TO SGH_User;
GRANT SELECT ON dbo.vw_Habitaciones TO SGH_User;
GRANT SELECT ON dbo.vw_Reservaciones TO SGH_User;
GRANT EXECUTE ON dbo.sp_Reservacion_Crear TO SGH_User;
GO

/* ----------------------------------------------------------------
   7) NUEVO TIPO (PARA FUNCION fn_ReservacionesConFacturasYCargos)
   ---------------------------------------------------------------- */

CREATE TYPE dbo.ListaHabitaciones AS TABLE
(
    HabitacionId INT
);
GO