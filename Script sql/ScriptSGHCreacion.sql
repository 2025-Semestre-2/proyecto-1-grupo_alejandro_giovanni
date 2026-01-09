/* ============================================================
   Proyecto 1 (Verano) - SQL Server
   Diseño Sistema de Gestión Hotelera Final
   
   Giovanni Esquivel Cortes
   Alejandro Vindas Cerdas
   ============================================================ */

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

---------------------------------------------------------------
-- Crear base de datos
---------------------------------------------------------------
IF DB_ID(N'PortalTurismoLimon') IS NULL
BEGIN
    CREATE DATABASE PortalTurismoLimon;
END
GO
USE PortalTurismoLimon;
GO

---------------------------------------------------------------
-- Borrado
---------------------------------------------------------------
DROP TABLE IF EXISTS dbo.CargosHabitacion;
DROP TABLE IF EXISTS dbo.TiposDeCargo;
DROP TABLE IF EXISTS dbo.TipoHabitacionCama;
DROP TABLE IF EXISTS dbo.TipoCama;
DROP TABLE IF EXISTS dbo.TipoHabitacionComodidad;
DROP TABLE IF EXISTS dbo.Comodidades;
DROP TABLE IF EXISTS dbo.TipoHabitacionFoto;

DROP TABLE IF EXISTS dbo.Factura;
DROP TABLE IF EXISTS dbo.Reservacion;
DROP TABLE IF EXISTS dbo.Cliente;

DROP TABLE IF EXISTS dbo.TipoDeActividadPorActividad;
DROP TABLE IF EXISTS dbo.TipoActividad;
DROP TABLE IF EXISTS dbo.Actividades;

DROP TABLE IF EXISTS dbo.RedesPorEmpresa;
DROP TABLE IF EXISTS dbo.RedesSociales;

DROP TABLE IF EXISTS dbo.AmenidadesPorEmpresa;
DROP TABLE IF EXISTS dbo.Amenidades;

DROP TABLE IF EXISTS dbo.Habitacion;
DROP TABLE IF EXISTS dbo.TipoHabitacion;
DROP TABLE IF EXISTS dbo.Empresas;
DROP TABLE IF EXISTS dbo.TipoEmpresa;
DROP TABLE IF EXISTS dbo.TipoIdentificacion
GO

---------------------------------------------------------------
-- Empresas
---------------------------------------------------------------

CREATE TABLE dbo.TipoEmpresa (
    TipoEmpresaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Empresas (
    CedulaJuridica NVARCHAR(50) NOT NULL,
    Nombre NVARCHAR(200) NOT NULL,
    TipoEmpresaId INT NOT NULL,
    Correo NVARCHAR(254) NOT NULL,
    Telefono NVARCHAR(20) NOT NULL,
    SitioWeb NVARCHAR(300) NULL,
    Provincia NVARCHAR(100) NOT NULL,
    Canton NVARCHAR(100) NOT NULL,
    Distrito NVARCHAR(100) NOT NULL,
    Barrio NVARCHAR(100) NULL,
    SenasExactas NVARCHAR(400) NOT NULL,
    Latitud DECIMAL(9,6) NULL,
    Longitud DECIMAL(9,6) NULL,
    Contraseña NVARCHAR(255) NOT NULL,

    CONSTRAINT PK_Empresas PRIMARY KEY (CedulaJuridica),

    CONSTRAINT FK_Empresa_TipoEmpresa
        FOREIGN KEY (TipoEmpresaId)
        REFERENCES dbo.TipoEmpresa(TipoEmpresaId)
);
GO

---------------------------------------------------------------
-- Redes sociales
---------------------------------------------------------------

CREATE TABLE dbo.RedesSociales (
    RedSocialId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.RedesPorEmpresa (
    CedulaJuridica NVARCHAR(50) NOT NULL,
    RedSocialId INT NOT NULL,
    Url NVARCHAR(300) NOT NULL,

    CONSTRAINT PK_RedesPorEmpresa PRIMARY KEY (CedulaJuridica, RedSocialId),
    CONSTRAINT FK_RPE_Empresa FOREIGN KEY (CedulaJuridica)
        REFERENCES dbo.Empresas(CedulaJuridica) ON DELETE CASCADE,
    CONSTRAINT FK_RPE_RedSocial FOREIGN KEY (RedSocialId)
        REFERENCES dbo.RedesSociales(RedSocialId)
);
GO

---------------------------------------------------------------
-- Amenidades
---------------------------------------------------------------

CREATE TABLE dbo.Amenidades (
    AmenidadId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(80) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.AmenidadesPorEmpresa (
    CedulaJuridica NVARCHAR(50) NOT NULL,
    AmenidadId INT NOT NULL,

    CONSTRAINT PK_AmenidadesPorEmpresa PRIMARY KEY (CedulaJuridica, AmenidadId),
    CONSTRAINT FK_APE_Empresa FOREIGN KEY (CedulaJuridica)
        REFERENCES dbo.Empresas(CedulaJuridica) ON DELETE CASCADE,
    CONSTRAINT FK_APE_Amenidad FOREIGN KEY (AmenidadId)
        REFERENCES dbo.Amenidades(AmenidadId)
);
GO

---------------------------------------------------------------
-- Actividades
---------------------------------------------------------------

CREATE TABLE dbo.Actividades (
    ActividadId INT IDENTITY PRIMARY KEY,
    CedulaJuridica NVARCHAR(50) NOT NULL,
    Nombre NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(600) NULL,
    PersonaContacto NVARCHAR(200) NOT NULL,
    Precio DECIMAL(12,2) NOT NULL,
    UrlImagen NVARCHAR(300) NOT NULL,

    CONSTRAINT FK_Actividad_Empresa FOREIGN KEY (CedulaJuridica)
        REFERENCES dbo.Empresas(CedulaJuridica) ON DELETE CASCADE,

    CONSTRAINT CK_Actividad_Precio CHECK (Precio >= 0)
);

GO

CREATE TABLE dbo.TipoActividad (
    TipoActividadId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(60) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.TipoDeActividadPorActividad (
    ActividadId INT NOT NULL,
    TipoActividadId INT NOT NULL,

    CONSTRAINT PK_TipoActividadActividad PRIMARY KEY (ActividadId, TipoActividadId),
    CONSTRAINT FK_TAPA_Actividad FOREIGN KEY (ActividadId)
        REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE,
    CONSTRAINT FK_TAPA_TipoActividad FOREIGN KEY (TipoActividadId)
        REFERENCES dbo.TipoActividad(TipoActividadId)
);
GO

---------------------------------------------------------------
-- Hospedaje
---------------------------------------------------------------

CREATE TABLE dbo.TipoHabitacion (
    TipoHabitacionId INT IDENTITY PRIMARY KEY,
    CedulaJuridica NVARCHAR(50) NOT NULL,
    Nombre NVARCHAR(120) NOT NULL,
    Descripcion NVARCHAR(400) NULL,
    Precio DECIMAL(12,2) NOT NULL,
    NumeroDePersonas INT NOT NULL,

    CONSTRAINT FK_TipoHabitacion_Empresa FOREIGN KEY (CedulaJuridica)
        REFERENCES dbo.Empresas(CedulaJuridica),
    CONSTRAINT CK_TipoHabitacion_Precio CHECK (Precio >= 0),
    CONSTRAINT CK_TipoHabitacion_Personas CHECK (NumeroDePersonas > 0)
);
GO

CREATE TABLE dbo.TipoCama (
    TipoCamaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(30) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.TipoHabitacionCama (
    TipoHabitacionId INT NOT NULL,
    TipoCamaId INT NOT NULL,
    Cantidad INT NOT NULL,

    CONSTRAINT PK_TipoHabitacionCama PRIMARY KEY (TipoHabitacionId, TipoCamaId),
    CONSTRAINT FK_THC_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId) ON DELETE CASCADE,
    CONSTRAINT FK_THC_TipoCama FOREIGN KEY (TipoCamaId)
        REFERENCES dbo.TipoCama(TipoCamaId),
    CONSTRAINT CK_THC_Cantidad CHECK (Cantidad > 0)
);
GO

CREATE TABLE dbo.Comodidades (
    ComodidadId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(80) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.TipoHabitacionComodidad (
    TipoHabitacionId INT NOT NULL,
    ComodidadId INT NOT NULL,

    CONSTRAINT PK_TipoHabitacionComodidad PRIMARY KEY (TipoHabitacionId, ComodidadId),
    CONSTRAINT FK_THCom_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId) ON DELETE CASCADE,
    CONSTRAINT FK_THCom_Comodidad FOREIGN KEY (ComodidadId)
        REFERENCES dbo.Comodidades(ComodidadId)
);
GO

CREATE TABLE dbo.Habitacion (
    HabitacionId INT IDENTITY(1,1) PRIMARY KEY,
    CedulaJuridica NVARCHAR(50) NOT NULL,
    Numero NVARCHAR(20) NOT NULL,
    TipoHabitacionId INT NOT NULL,
    Activa BIT NOT NULL,

    CONSTRAINT FK_Habitacion_Empresa
        FOREIGN KEY (CedulaJuridica)
        REFERENCES dbo.Empresas(CedulaJuridica) ON DELETE CASCADE,

    CONSTRAINT FK_Habitacion_TipoHabitacion
        FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId),

    CONSTRAINT UQ_Habitacion UNIQUE (CedulaJuridica, Numero)
);
GO


---------------------------------------------------------------
-- Cargos por habitacion
---------------------------------------------------------------

CREATE TABLE dbo.TiposDeCargo (
    TipoCargoId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(80) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.CargosHabitacion (
    TipoHabitacionId INT NOT NULL,
    TipoCargoId INT NOT NULL,
    Precio DECIMAL(12,2) NOT NULL,

    CONSTRAINT PK_CargosHabitacion PRIMARY KEY (TipoHabitacionId, TipoCargoId),
    CONSTRAINT FK_CH_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId) ON DELETE CASCADE,
    CONSTRAINT FK_CH_TipoCargo FOREIGN KEY (TipoCargoId)
        REFERENCES dbo.TiposDeCargo(TipoCargoId),
    CONSTRAINT CK_CH_Precio CHECK (Precio >= 0)
);
GO

---------------------------------------------------------------
-- Clientes, reservas y facturacion
---------------------------------------------------------------

CREATE TABLE dbo.TipoIdentificacion (
    TipoIdentificacionId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Cliente (
    ClienteId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(120) NOT NULL,
    PrimerApellido NVARCHAR(120) NOT NULL,
    SegundoApellido NVARCHAR(120) NULL,
    FechaNacimiento DATE NOT NULL,
    TipoIdentificacionId INT NOT NULL,
    NumeroIdentificacion NVARCHAR(50) NOT NULL UNIQUE,
    PaisResidencia NVARCHAR(100) NOT NULL,
    Provincia NVARCHAR(100) NULL,
    Canton NVARCHAR(100) NULL,
    Distrito NVARCHAR(100) NULL,
    Telefono1 NVARCHAR(20) NOT NULL,
    Telefono2 NVARCHAR(20) NULL,
    Correo NVARCHAR(254) NOT NULL,
    Contraseña NVARCHAR(255) NOT NULL,

    CONSTRAINT FK_Cliente_TipoIdentificacion
        FOREIGN KEY (TipoIdentificacionId)
        REFERENCES dbo.TipoIdentificacion(TipoIdentificacionId)
);
GO


CREATE TABLE dbo.Reservacion (
    ReservacionId INT IDENTITY PRIMARY KEY,
    ClienteId INT NOT NULL,
    HabitacionId INT NOT NULL,
    FechaHoraIngreso DATETIME2 NOT NULL,
    FechaSalida DATE NOT NULL,
    CantidadPersonas INT NOT NULL,
    TieneVehiculo BIT NOT NULL,

    CONSTRAINT FK_Reservacion_Cliente
        FOREIGN KEY (ClienteId)
        REFERENCES dbo.Cliente(ClienteId),

    CONSTRAINT FK_Reservacion_Habitacion
        FOREIGN KEY (HabitacionId)
        REFERENCES dbo.Habitacion(HabitacionId),

    CONSTRAINT CK_Reservacion_Fechas
        CHECK (FechaSalida > CAST(FechaHoraIngreso AS DATE)),

    CONSTRAINT CK_Reservacion_CantidadPersonas
        CHECK (CantidadPersonas > 0)
);
GO



CREATE TABLE dbo.Factura (
    FacturaId INT IDENTITY PRIMARY KEY,
    ReservacionId INT NOT NULL UNIQUE,
    FechaHoraRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CargosHabitacion NVARCHAR(500) NOT NULL,
    Noches INT NOT NULL,
    TotalPagar DECIMAL(12,2) NOT NULL,
    MetodoPago NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_Factura_Reservacion
        FOREIGN KEY (ReservacionId)
        REFERENCES dbo.Reservacion(ReservacionId),

    CONSTRAINT CK_Factura_Noches
        CHECK (Noches > 0),

    CONSTRAINT CK_Factura_Total
        CHECK (TotalPagar >= 0)
);
GO


PRINT N'? Script FINAL aplicado con éxito.';
GO
