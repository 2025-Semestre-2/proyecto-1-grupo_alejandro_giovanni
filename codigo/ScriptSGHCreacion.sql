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
DROP TABLE IF EXISTS dbo.Usuarios
DROP TABLE IF EXISTS Distritos
DROP TABLE IF EXISTS Cantones
DROP TABLE IF EXISTS Provincias
GO
---------------------------------------------------------------
-- Usuarios: Aclarar que el correo que se usa acá es para el login únicamente
-- y puede diferir del correo de contacto de la empresa o el cliente
---------------------------------------------------------------
CREATE TABLE Usuarios(
    IdUsuario INT IDENTITY PRIMARY KEY,
    PasswordHash VARCHAR(255) NOT NULL,
    CorreoUsuario NVARCHAR(254) UNIQUE NOT NULL,
    EsAdministrador BIT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,

    CONSTRAINT CK_Usuarios_CorreoUsuario_Formato CHECK (CorreoUsuario LIKE '%_@_%._%')
);
CREATE TABLE Provincias(
    IdProvincia INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(25) NOT NULL
);

CREATE TABLE Cantones(
    IdCanton INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    IdProvincia INT NOT NULL, 

    CONSTRAINT UQ_Cantones_Nombre_Provincia UNIQUE (Nombre, IdProvincia),
    CONSTRAINT FK_Cantones_Provincia FOREIGN KEY (IdProvincia) REFERENCES Provincias(IdProvincia)
);

CREATE TABLE Distritos(
    IdDistrito INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    IdCanton INT NOT NULL, 

    CONSTRAINT UQ_Distritos_Nombre_Canton UNIQUE (Nombre, IdCanton),
    CONSTRAINT FK_Distritos_Cantones FOREIGN KEY (IdCanton) REFERENCES Cantones(IdCanton)
);
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
    IdUsuario INT NOT NULL,
    Nombre NVARCHAR(200) NOT NULL,
    TipoEmpresaId INT NOT NULL,
    CorreoContacto NVARCHAR(254) NOT NULL,
    Telefono1 NVARCHAR(16) NOT NULL,
    Telefono2 NVARCHAR(16) NULL,
    SitioWeb NVARCHAR(300) NULL,
    IdDistrito INT NOT NULL,
    Barrio NVARCHAR(100) NULL,
    SenasExactas NVARCHAR(400) NOT NULL,
    Latitud DECIMAL(9,6) NULL,
    Longitud DECIMAL(9,6) NULL

    CONSTRAINT PK_Empresas PRIMARY KEY (CedulaJuridica),
    CONSTRAINT CK_Empresas_CorreoContacto_Formato CHECK (CorreoContacto LIKE '%_@_%._%'),
        CONSTRAINT CK_Empresas_Telefono1_Formato CHECK (
        Telefono1 LIKE N'+[0-9]%' 
        AND PATINDEX(N'%[^0-9+]%', Telefono1)=0
        AND CHARINDEX(N'+', Telefono1, 2)=0 
        AND LEN(Telefono1) >= 8
        AND LEN(Telefono1) <= 16),
    CONSTRAINT CK_Empresas_Telefono2_Formato CHECK (
        Telefono2 IS NULL OR (
            Telefono2 LIKE N'+[0-9]%' 
            AND PATINDEX(N'%[^0-9+]%', Telefono2)=0
            AND CHARINDEX(N'+', Telefono2, 2)=0 
            AND LEN(Telefono2) >= 8
            AND LEN(Telefono2) <= 16)),
    CONSTRAINT FK_Empresas_Distritos FOREIGN KEY (IdDistrito) REFERENCES Distritos(IdDistrito),
    CONSTRAINT FK_Empresa_TipoEmpresa FOREIGN KEY (TipoEmpresaId) REFERENCES dbo.TipoEmpresa(TipoEmpresaId),
    CONSTRAINT FK_Empresa_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
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

CREATE TABLE dbo.TipoHabitacionImagen(
	TipoHabitacionImagenID INT IDENTITY(1,1) PRIMARY KEY,
	TipoHabitacionId INT NOT NULL,
	UrlImagen NVARCHAR(300) NOT NULL,
	
	CONSTRAINT FK_TipoHabitacionImagen_TipoHabitacion
		FOREIGN KEY (TipoHabitacionId)
		REFERENCES dbo.TipoHabitacion(TipoHabitacionId)
)
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
    IdUsuario INT NOT NULL,
    Nombre NVARCHAR(120) NOT NULL,
    Apellido1 NVARCHAR(120) NOT NULL,
    Apellido2 NVARCHAR(120) NULL,
    FechaNacimiento DATE NOT NULL,
    TipoIdentificacionId INT NOT NULL,
    NumeroIdentificacion NVARCHAR(50) NOT NULL UNIQUE,
    PaisResidencia NVARCHAR(100) NOT NULL,
    IdDistrito INT NULL,
    Telefono1 NVARCHAR(16) NOT NULL,
    Telefono2 NVARCHAR(16) NULL,
    CorreoContacto NVARCHAR(254) NOT NULL,


    CONSTRAINT CK_Cliente_CorreoContacto_Formato CHECK (CorreoContacto LIKE '%_@_%._%'),
    CONSTRAINT CK_Cliente_Telefono1_Formato CHECK (
        Telefono1 LIKE N'+[0-9]%' 
        AND PATINDEX(N'%[^0-9+]%', Telefono1)=0
        AND CHARINDEX(N'+', Telefono1, 2)=0 
        AND LEN(Telefono1) >= 8
        AND LEN(Telefono1) <= 16),
    CONSTRAINT CK_Cliente_Telefono2_Formato CHECK (
        Telefono2 IS NULL OR (
            Telefono2 LIKE N'+[0-9]%' 
            AND PATINDEX(N'%[^0-9+]%', Telefono2)=0
            AND CHARINDEX(N'+', Telefono2, 2)=0 
            AND LEN(Telefono2) >= 8
            AND LEN(Telefono2) <= 16)),

    CONSTRAINT FK_Cliente_TipoIdentificacion FOREIGN KEY (TipoIdentificacionId) REFERENCES dbo.TipoIdentificacion(TipoIdentificacionId),
    CONSTRAINT FK_Cliente_Distritos FOREIGN KEY (IdDistrito) REFERENCES Distritos(IdDistrito),
    CONSTRAINT FK_Cliente_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
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
    Activa BIT DEFAULT 0,
	Estado NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_Reservacion_Cliente
        FOREIGN KEY (ClienteId)
        REFERENCES dbo.Cliente(ClienteId),

    CONSTRAINT FK_Reservacion_Habitacion
        FOREIGN KEY (HabitacionId)
        REFERENCES dbo.Habitacion(HabitacionId),

    CONSTRAINT CK_Reservacion_Fechas
        CHECK (FechaSalida > CAST(FechaHoraIngreso AS DATE)),

    CONSTRAINT CK_Reservacion_CantidadPersonas
        CHECK (CantidadPersonas > 0),
		
	CONSTRAINT DF_Reservacion_Estado DEFAULT(N'ACTIVO')
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
