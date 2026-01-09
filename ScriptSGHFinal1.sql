/* ============================================================
   PROYECTO 1 (Verano) - SQL Server - Script SIMPLE
   Cumple con lo solicitado en el documento (hospedaje + recreación).
   ============================================================ */

SET NOCOUNT ON;
SET XACT_ABORT ON;

---------------------------------------------------------------
-- 1) CREAR BASE DE DATOS
---------------------------------------------------------------
IF DB_ID(N'PortalTurismoLimon') IS NULL
BEGIN
    CREATE DATABASE PortalTurismoLimon;
END
GO

USE PortalTurismoLimon;
GO

---------------------------------------------------------------
-- 2) BORRADO (para poder ejecutar de nuevo)
---------------------------------------------------------------
IF OBJECT_ID(N'dbo.EmpresaRecreacionServicio', N'U') IS NOT NULL DROP TABLE dbo.EmpresaRecreacionServicio;
IF OBJECT_ID(N'dbo.EmpresaRecreacionTipoActividad', N'U') IS NOT NULL DROP TABLE dbo.EmpresaRecreacionTipoActividad;
IF OBJECT_ID(N'dbo.EmpresaRecreacion', N'U') IS NOT NULL DROP TABLE dbo.EmpresaRecreacion;

IF OBJECT_ID(N'dbo.Factura', N'U') IS NOT NULL DROP TABLE dbo.Factura;
IF OBJECT_ID(N'dbo.Reservacion', N'U') IS NOT NULL DROP TABLE dbo.Reservacion;
IF OBJECT_ID(N'dbo.Cliente', N'U') IS NOT NULL DROP TABLE dbo.Cliente;

IF OBJECT_ID(N'dbo.Habitacion', N'U') IS NOT NULL DROP TABLE dbo.Habitacion;
IF OBJECT_ID(N'dbo.TipoHabitacionFoto', N'U') IS NOT NULL DROP TABLE dbo.TipoHabitacionFoto;
IF OBJECT_ID(N'dbo.TipoHabitacionComodidad', N'U') IS NOT NULL DROP TABLE dbo.TipoHabitacionComodidad;
IF OBJECT_ID(N'dbo.TipoHabitacion', N'U') IS NOT NULL DROP TABLE dbo.TipoHabitacion;

IF OBJECT_ID(N'dbo.HotelServicio', N'U') IS NOT NULL DROP TABLE dbo.HotelServicio;
IF OBJECT_ID(N'dbo.Hotel', N'U') IS NOT NULL DROP TABLE dbo.Hotel;
GO

---------------------------------------------------------------
-- 3) TABLAS DE HOSPEDAJE
---------------------------------------------------------------

-- 3.1 Hotel / Establecimiento
CREATE TABLE dbo.Hotel (
    HotelId           INT IDENTITY(1,1) PRIMARY KEY,
    Nombre            NVARCHAR(200) NOT NULL,
    CedulaJuridica    NVARCHAR(50)  NOT NULL UNIQUE,  -- único

    Tipo              NVARCHAR(30)  NOT NULL,         -- Hotel/Hostal/Casa/Departamento/Cuarto compartido/Cabaña

    -- Dirección (Provincia, Cantón, Distrito, Barrio, Señas exactas)
    Provincia         NVARCHAR(100) NOT NULL,
    Canton            NVARCHAR(100) NOT NULL,
    Distrito          NVARCHAR(100) NOT NULL,
    Barrio            NVARCHAR(100) NULL,
    SenasExactas      NVARCHAR(400) NOT NULL,

    -- Referencia GPS
    Latitud           DECIMAL(9,6) NULL,
    Longitud          DECIMAL(9,6) NULL,

    -- Teléfonos (2)
    Telefono1         NVARCHAR(20) NOT NULL,
    Telefono2         NVARCHAR(20) NULL,

    Correo            NVARCHAR(254) NOT NULL,
    UrlSitioWeb       NVARCHAR(300) NULL,

    -- Redes sociales (opcional)
    UrlFacebook       NVARCHAR(300) NULL,
    UrlInstagram      NVARCHAR(300) NULL,
    UrlYouTube        NVARCHAR(300) NULL,
    UrlTikTok         NVARCHAR(300) NULL,
    UrlAirbnb         NVARCHAR(300) NULL,
    UrlThreads        NVARCHAR(300) NULL,
    UrlX              NVARCHAR(300) NULL,

    CONSTRAINT CK_Hotel_Tipo CHECK (Tipo IN (
        N'Hotel', N'Hostal', N'Casa', N'Departamento', N'Cuarto compartido', N'Cabaña'
    )),
    CONSTRAINT CK_Hotel_GpsLat CHECK (Latitud IS NULL OR (Latitud BETWEEN -90 AND 90)),
    CONSTRAINT CK_Hotel_GpsLng CHECK (Longitud IS NULL OR (Longitud BETWEEN -180 AND 180)),

    -- Formato básico de teléfono con código país (ej: +50688888888)
    CONSTRAINT CK_Hotel_Tel1 CHECK (
        Telefono1 LIKE N'+[0-9]%' AND PATINDEX(N'%[^0-9+]%', Telefono1)=0 AND CHARINDEX(N'+', Telefono1, 2)=0
    ),
    CONSTRAINT CK_Hotel_Tel2 CHECK (
        Telefono2 IS NULL OR (Telefono2 LIKE N'+[0-9]%' AND PATINDEX(N'%[^0-9+]%', Telefono2)=0 AND CHARINDEX(N'+', Telefono2, 2)=0)
    )
);
GO

-- 3.2 Lista de servicios del hotel (piscina, wifi, etc.)
CREATE TABLE dbo.HotelServicio (
    HotelId   INT NOT NULL,
    Servicio  NVARCHAR(80) NOT NULL,

    CONSTRAINT PK_HotelServicio PRIMARY KEY (HotelId, Servicio),
    CONSTRAINT FK_HotelServicio_Hotel FOREIGN KEY (HotelId)
        REFERENCES dbo.Hotel(HotelId) ON DELETE CASCADE
);
GO

-- 3.3 Tipo de habitación (por hotel)
CREATE TABLE dbo.TipoHabitacion (
    TipoHabitacionId INT IDENTITY(1,1) PRIMARY KEY,
    HotelId          INT NOT NULL,

    Nombre           NVARCHAR(120) NOT NULL,
    Descripcion      NVARCHAR(400) NULL,
    TipoCama         NVARCHAR(20)  NOT NULL, -- Individual/Queen/King
    Precio           DECIMAL(12,2) NOT NULL,

    CONSTRAINT FK_TipoHabitacion_Hotel FOREIGN KEY (HotelId)
        REFERENCES dbo.Hotel(HotelId) ON DELETE CASCADE,

    CONSTRAINT UQ_TipoHabitacion UNIQUE (HotelId, Nombre),
    CONSTRAINT CK_TipoHabitacion_Cama CHECK (TipoCama IN (N'Individual', N'Queen', N'King')),
    CONSTRAINT CK_TipoHabitacion_Precio CHECK (Precio >= 0)
);
GO

-- 3.4 Comodidades del tipo de habitación (lista)
CREATE TABLE dbo.TipoHabitacionComodidad (
    TipoHabitacionId INT NOT NULL,
    Comodidad        NVARCHAR(80) NOT NULL,

    CONSTRAINT PK_TipoHabitacionComodidad PRIMARY KEY (TipoHabitacionId, Comodidad),
    CONSTRAINT FK_THC_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId) ON DELETE CASCADE
);
GO

-- 3.5 Fotos del tipo de habitación (lista)
CREATE TABLE dbo.TipoHabitacionFoto (
    FotoId           INT IDENTITY(1,1) PRIMARY KEY,
    TipoHabitacionId INT NOT NULL,
    UrlFoto          NVARCHAR(300) NOT NULL,

    CONSTRAINT FK_TipoHabitacionFoto_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId) ON DELETE CASCADE
);
GO

-- 3.6 Habitación
CREATE TABLE dbo.Habitacion (
    HabitacionId     INT IDENTITY(1,1) PRIMARY KEY,
    HotelId          INT NOT NULL,
    Numero           NVARCHAR(20) NOT NULL,
    TipoHabitacionId INT NOT NULL,
    Estado           NVARCHAR(10) NOT NULL, -- Activo/Inactivo

    CONSTRAINT FK_Habitacion_Hotel FOREIGN KEY (HotelId)
        REFERENCES dbo.Hotel(HotelId) ON DELETE CASCADE,

    CONSTRAINT FK_Habitacion_TipoHabitacion FOREIGN KEY (TipoHabitacionId)
        REFERENCES dbo.TipoHabitacion(TipoHabitacionId),

    CONSTRAINT UQ_Habitacion UNIQUE (HotelId, Numero),
    CONSTRAINT CK_Habitacion_Estado CHECK (Estado IN (N'Activo', N'Inactivo'))
);
GO

---------------------------------------------------------------
-- 4) CLIENTES, RESERVACIÓN Y FACTURACIÓN
---------------------------------------------------------------

CREATE TABLE dbo.Cliente (
    ClienteId            INT IDENTITY(1,1) PRIMARY KEY,
    Nombre               NVARCHAR(120) NOT NULL,
    PrimerApellido       NVARCHAR(120) NOT NULL,
    SegundoApellido      NVARCHAR(120) NULL,
    FechaNacimiento      DATE NOT NULL,

    TipoIdentificacion   NVARCHAR(30) NOT NULL, -- Pasaporte/DIMEX/Cédula nacional/Otro
    NumeroIdentificacion NVARCHAR(50) NOT NULL UNIQUE, -- único

    PaisResidencia       NVARCHAR(100) NOT NULL,

    -- Dirección si fuera costarricense: Provincia, Cantón y Distrito (se deja nullable)
    ProvinciaCR          NVARCHAR(100) NULL,
    CantonCR             NVARCHAR(100) NULL,
    DistritoCR           NVARCHAR(100) NULL,

    Telefono1            NVARCHAR(20) NOT NULL,
    Telefono2            NVARCHAR(20) NULL,
    Correo               NVARCHAR(254) NOT NULL,

    CONSTRAINT CK_Cliente_TipoId CHECK (TipoIdentificacion IN (
        N'Pasaporte', N'DIMEX', N'Cédula nacional', N'Otro'
    )),
    CONSTRAINT CK_Cliente_FechaNacimiento CHECK (FechaNacimiento <= CAST(GETDATE() AS DATE)),
    CONSTRAINT CK_Cliente_Tel1 CHECK (
        Telefono1 LIKE N'+[0-9]%' AND PATINDEX(N'%[^0-9+]%', Telefono1)=0 AND CHARINDEX(N'+', Telefono1, 2)=0
    ),
    CONSTRAINT CK_Cliente_Tel2 CHECK (
        Telefono2 IS NULL OR (Telefono2 LIKE N'+[0-9]%' AND PATINDEX(N'%[^0-9+]%', Telefono2)=0 AND CHARINDEX(N'+', Telefono2, 2)=0)
    )
);
GO

-- Reservación: cliente, habitación, fecha+hora ingreso, cantidad personas, vehículo (si/no), fecha salida
CREATE TABLE dbo.Reservacion (
    ReservacionId    INT IDENTITY(1,1) PRIMARY KEY,
    ClienteId        INT NOT NULL,
    HabitacionId     INT NOT NULL,

    FechaHoraIngreso DATETIME2(0) NOT NULL,
    FechaSalida      DATE NOT NULL,

    CantidadPersonas INT NOT NULL,
    TieneVehiculo    BIT NOT NULL,

    CONSTRAINT FK_Reservacion_Cliente FOREIGN KEY (ClienteId)
        REFERENCES dbo.Cliente(ClienteId),

    CONSTRAINT FK_Reservacion_Habitacion FOREIGN KEY (HabitacionId)
        REFERENCES dbo.Habitacion(HabitacionId),

    CONSTRAINT CK_Reservacion_Personas CHECK (CantidadPersonas > 0),
    CONSTRAINT CK_Reservacion_Fechas CHECK (FechaSalida > CAST(FechaHoraIngreso AS DATE))
);
GO

CREATE INDEX IX_Reservacion_HabitacionFechas
ON dbo.Reservacion(HabitacionId, FechaHoraIngreso, FechaSalida);
GO

-- Factura: con número de reserva, cargos, noches, total, método pago; fecha con hora y minuto
CREATE TABLE dbo.Factura (
    FacturaId        INT IDENTITY(1,1) PRIMARY KEY,
    ReservacionId    INT NOT NULL UNIQUE, -- una factura por reservación

    FechaHoraRegistro DATETIME2(0) NOT NULL DEFAULT (SYSDATETIME()), -- incluye hora y minuto

    CargoHabitacion  DECIMAL(12,2) NOT NULL,
    Noches           INT NOT NULL,
    TotalPagar       DECIMAL(12,2) NOT NULL,

    MetodoPago       NVARCHAR(20) NOT NULL, -- Efectivo/Tarjeta

    CONSTRAINT FK_Factura_Reservacion FOREIGN KEY (ReservacionId)
        REFERENCES dbo.Reservacion(ReservacionId),

    CONSTRAINT CK_Factura_MetodoPago CHECK (MetodoPago IN (N'Efectivo', N'Tarjeta')),
    CONSTRAINT CK_Factura_NoNoches CHECK (Noches > 0),
    CONSTRAINT CK_Factura_Montos CHECK (
        CargoHabitacion >= 0 AND TotalPagar >= 0 AND TotalPagar >= CargoHabitacion
    )
);
GO

---------------------------------------------------------------
-- 5) RECREACIÓN
---------------------------------------------------------------

CREATE TABLE dbo.EmpresaRecreacion (
    EmpresaRecreacionId INT IDENTITY(1,1) PRIMARY KEY,
    NombreEmpresa       NVARCHAR(200) NOT NULL,
    CedulaJuridica      NVARCHAR(50)  NOT NULL UNIQUE,
    Correo              NVARCHAR(254) NOT NULL,
    Telefono            NVARCHAR(20)  NOT NULL,
    PersonaContacto     NVARCHAR(200) NOT NULL,

    -- Dirección: Provincia, Cantón, Distrito y señas exactas
    Provincia           NVARCHAR(100) NOT NULL,
    Canton              NVARCHAR(100) NOT NULL,
    Distrito            NVARCHAR(100) NOT NULL,
    SenasExactas        NVARCHAR(400) NOT NULL,

    DescripcionActividad NVARCHAR(600) NULL,
    Precio              DECIMAL(12,2) NOT NULL,

    CONSTRAINT CK_EmpRec_Tel CHECK (
        Telefono LIKE N'+[0-9]%' AND PATINDEX(N'%[^0-9+]%', Telefono)=0 AND CHARINDEX(N'+', Telefono, 2)=0
    ),
    CONSTRAINT CK_EmpRec_Precio CHECK (Precio >= 0)
);
GO

-- Tipos de actividad (puede ser más de uno)
CREATE TABLE dbo.EmpresaRecreacionTipoActividad (
    EmpresaRecreacionId INT NOT NULL,
    TipoActividad       NVARCHAR(40) NOT NULL,

    CONSTRAINT PK_EmpRecTipoActividad PRIMARY KEY (EmpresaRecreacionId, TipoActividad),
    CONSTRAINT FK_ERTA_Empresa FOREIGN KEY (EmpresaRecreacionId)
        REFERENCES dbo.EmpresaRecreacion(EmpresaRecreacionId) ON DELETE CASCADE,

    CONSTRAINT CK_ERTA_TipoActividad CHECK (TipoActividad IN (
        N'Tour en bote', N'Tour en lancha', N'Tour en catamarán', N'Kayak', N'Transporte'
    ))
);
GO

-- Tipos de servicios que brinda (lista libre)
CREATE TABLE dbo.EmpresaRecreacionServicio (
    EmpresaRecreacionId INT NOT NULL,
    Servicio            NVARCHAR(80) NOT NULL,

    CONSTRAINT PK_EmpRecServicio PRIMARY KEY (EmpresaRecreacionId, Servicio),
    CONSTRAINT FK_ERS_Empresa FOREIGN KEY (EmpresaRecreacionId)
        REFERENCES dbo.EmpresaRecreacion(EmpresaRecreacionId) ON DELETE CASCADE
);
GO

-- Índices útiles para búsqueda por filtros (tipo Airbnb)
CREATE INDEX IX_EmpRec_UbicacionPrecio
ON dbo.EmpresaRecreacion(Provincia, Canton, Distrito, Precio);

CREATE INDEX IX_EmpRec_TipoActividad
ON dbo.EmpresaRecreacionTipoActividad(TipoActividad);
GO

PRINT N'? Script SIMPLE creado con éxito.';
GO
