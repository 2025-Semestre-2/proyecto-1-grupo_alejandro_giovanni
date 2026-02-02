USE LookingDB;
GO
----------------------------------------------
-- Para DB
----------------------------------------------

-- (OP) Para uso nuestro (hacer perfil de admin)
CREATE OR ALTER PROCEDURE sp_AsignarAdministrador
    @IdUsuario INT
AS
BEGIN
    UPDATE Usuarios
    SET EsAdministrador = 1
    WHERE IdUsuario = @IdUsuario;
END;
Go

CREATE OR ALTER PROCEDURE sp_DesactivarUsuario
    @IdUsuario INT
AS
BEGIN
    UPDATE Usuarios
    SET Activo = 0
    WHERE IdUsuario = @IdUsuario;
END;
Go

----------------------------------------------
-- Busqueda
----------------------------------------------

--Para la busqueda de habitaciones
CREATE OR ALTER FUNCTION dbo.fn_TiposHabitacionPorUbicacion
(
    @IdProvincia INT,
    @IdCanton INT = NULL,
    @IdDistrito INT = NULL,
    @NumeroPersonas INT,
    @FechaIngreso DATE,
    @FechaSalida DATE
)
RETURNS TABLE
AS
RETURN
(
    SELECT DISTINCT
        th.Nombre AS TipoHabitacionNombre,
        th.Descripcion,
        th.Precio,
        th.NumeroDePersonas,
        img.UrlImagen
    FROM dbo.TipoHabitacion th
    INNER JOIN dbo.Empresas e
        ON e.CedulaJuridica = th.CedulaJuridica
    INNER JOIN dbo.Distritos d
        ON d.IdDistrito = e.IdDistrito
    INNER JOIN dbo.Cantones c
        ON c.IdCanton = d.IdCanton
    INNER JOIN dbo.Provincias p
        ON p.IdProvincia = c.IdProvincia

    OUTER APPLY
    (
        SELECT TOP (1) thi.UrlImagen
        FROM dbo.TipoHabitacionImagen thi
        WHERE thi.TipoHabitacionId = th.TipoHabitacionId
        ORDER BY thi.TipoHabitacionImagenID
    ) img

    WHERE
        p.IdProvincia = @IdProvincia
        AND (@IdCanton IS NULL OR c.IdCanton = @IdCanton)
        AND (@IdDistrito IS NULL OR d.IdDistrito = @IdDistrito)
        AND th.NumeroDePersonas >= @NumeroPersonas

        AND EXISTS
        (
            SELECT 1
            FROM dbo.Habitacion h
            WHERE
                h.TipoHabitacionId = th.TipoHabitacionId
                AND h.CedulaJuridica = th.CedulaJuridica
                AND h.Activa = 1

                AND NOT EXISTS
                (
                    SELECT 1
                    FROM dbo.Reservacion r
                    WHERE
                        r.HabitacionId = h.HabitacionId
                        AND r.Activa = 1
                        AND r.FechaHoraIngreso < @FechaSalida
                        AND r.FechaSalida > @FechaIngreso
                )
        )
);
GO

--Para la busqueda de actividades
CREATE OR ALTER FUNCTION dbo.fn_ActividadesPorUbicacion
(
    @IdProvincia INT,
    @IdCanton INT = NULL,
    @IdDistrito INT = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        a.ActividadId,
        a.Nombre,
        a.Descripcion,
        a.Precio,
        a.PersonaContacto,
        a.UrlImagen
    FROM dbo.Actividades a
    INNER JOIN dbo.Empresas e
        ON e.CedulaJuridica = a.CedulaJuridica
    INNER JOIN dbo.Distritos d
        ON d.IdDistrito = e.IdDistrito
    INNER JOIN dbo.Cantones c
        ON c.IdCanton = d.IdCanton
    INNER JOIN dbo.Provincias p
        ON p.IdProvincia = c.IdProvincia
    WHERE
        p.IdProvincia = @IdProvincia
        AND (@IdCanton IS NULL OR c.IdCanton = @IdCanton)
        AND (@IdDistrito IS NULL OR d.IdDistrito = @IdDistrito)
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_TipoHabitacionCamas
AS
SELECT
    thc.TipoHabitacionId,
    tc.Nombre AS TipoCama,
    thc.Cantidad
FROM dbo.TipoHabitacionCama thc
INNER JOIN dbo.TipoCama tc
    ON tc.TipoCamaId = thc.TipoCamaId;
GO

CREATE OR ALTER VIEW dbo.vw_TipoHabitacionComodidades
AS
SELECT
    thc.TipoHabitacionId,
    c.Nombre AS Comodidad
FROM dbo.TipoHabitacionComodidad thc
INNER JOIN dbo.Comodidades c
    ON c.ComodidadId = thc.ComodidadId;
GO

CREATE OR ALTER VIEW dbo.vw_TipoHabitacionImagenes
AS
SELECT
    TipoHabitacionId,
    UrlImagen
FROM dbo.TipoHabitacionImagen;
GO

CREATE OR ALTER VIEW dbo.vw_EmpresaUbicacion
AS
SELECT
    e.CedulaJuridica,
    e.Nombre AS EmpresaNombre,
    p.Nombre AS Provincia,
    c.Nombre AS Canton,
    d.Nombre AS Distrito
FROM dbo.Empresas e
INNER JOIN dbo.Distritos d
    ON d.IdDistrito = e.IdDistrito
INNER JOIN dbo.Cantones c
    ON c.IdCanton = d.IdCanton
INNER JOIN dbo.Provincias p
    ON p.IdProvincia = c.IdProvincia;
GO
--Vistas Auxiliares-----------------------------------------
--Para mostrar tipo de habitacion en la previa
CREATE OR ALTER FUNCTION dbo.fn_TipoHabitacionDetalle
(
    @TipoHabitacionId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        th.TipoHabitacionId,
        th.Nombre,
        th.Descripcion,
        th.Precio,
        th.NumeroDePersonas,

        eu.EmpresaNombre,
        eu.Provincia,
        eu.Canton,
        eu.Distrito,

        -- Beds
        Camas = (
            SELECT
                v.TipoCama,
                v.Cantidad
            FROM dbo.vw_TipoHabitacionCamas v
            WHERE v.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Amenities
        Comodidades = (
            SELECT
                v.Comodidad
            FROM dbo.vw_TipoHabitacionComodidades v
            WHERE v.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Images
        Imagenes = (
            SELECT
                v.UrlImagen
            FROM dbo.vw_TipoHabitacionImagenes v
            WHERE v.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        )

    FROM dbo.TipoHabitacion th
    INNER JOIN dbo.vw_EmpresaUbicacion eu
        ON eu.CedulaJuridica = th.CedulaJuridica
    WHERE
        th.TipoHabitacionId = @TipoHabitacionId
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_ActividadTipos
AS
SELECT
    ta.ActividadId,
    t.Nombre AS TipoActividad
FROM dbo.TipoDeActividadPorActividad ta
INNER JOIN dbo.TipoActividad t
    ON t.TipoActividadId = ta.TipoActividadId;
GO
--Vistas Auxiliares-----------------------------------------
--Para mostrar las actividades en la previa
CREATE OR ALTER FUNCTION dbo.fn_ActividadDetalle
(
    @ActividadId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        a.ActividadId,
        a.Nombre,
        a.Descripcion,
        a.PersonaContacto,
        a.Precio,
        a.UrlImagen,

        -- Empresa info
        eu.EmpresaNombre,
        eu.Provincia,
        eu.Canton,
        eu.Distrito,

        -- Tipos de actividad
        TiposActividad = (
            SELECT
                v.TipoActividad
            FROM dbo.vw_ActividadTipos v
            WHERE v.ActividadId = a.ActividadId
            FOR JSON PATH
        )

    FROM dbo.Actividades a
    INNER JOIN dbo.vw_EmpresaUbicacion eu
        ON eu.CedulaJuridica = a.CedulaJuridica
    WHERE
        a.ActividadId = @ActividadId
);
GO

--Revisar la disponibilidad de un tipo de cuarto
CREATE OR ALTER FUNCTION dbo.fn_TipoHabitacionDisponible
(
    @TipoHabitacionId INT,
    @NumeroPersonas INT,
    @FechaIngreso DATE,
    @FechaSalida DATE
)
RETURNS BIT
AS
BEGIN
    DECLARE @Disponible BIT = 0;

    IF EXISTS
    (
        SELECT 1
        FROM dbo.TipoHabitacion th
        WHERE
            th.TipoHabitacionId = @TipoHabitacionId
            AND th.NumeroDePersonas >= @NumeroPersonas

            AND EXISTS
            (
                SELECT 1
                FROM dbo.Habitacion h
                WHERE
                    h.TipoHabitacionId = th.TipoHabitacionId
                    AND h.Activa = 1

                    AND NOT EXISTS
                    (
                        SELECT 1
                        FROM dbo.Reservacion r
                        WHERE
                            r.HabitacionId = h.HabitacionId
                            AND r.Activa = 1
                            AND r.FechaHoraIngreso < @FechaSalida
                            AND r.FechaSalida > @FechaIngreso
                    )
            )
    )
    BEGIN
        SET @Disponible = 1;
    END

    RETURN @Disponible;
END;
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_ClienteDetalle
AS
SELECT
    c.ClienteId,
    c.Nombre,
    c.Apellido1,
    c.Apellido2,
    c.FechaNacimiento,
    c.NumeroIdentificacion,
    c.PaisResidencia,
    c.Telefono1,
    c.Telefono2,
    c.CorreoContacto AS CorreoCliente,

    u.CorreoUsuario,

    p.IdProvincia     AS ProvinciaId,
    p.Nombre          AS Provincia,

    -- Cantón
    ca.IdCanton       AS CantonId,
    ca.Nombre         AS Canton,

    -- Distrito
    d.IdDistrito      AS DistritoId,
    d.Nombre          AS DistritoNombre

FROM dbo.Cliente c
INNER JOIN dbo.Usuarios u
    ON u.IdUsuario = c.IdUsuario
LEFT JOIN dbo.Distritos d
    ON d.IdDistrito = c.IdDistrito
LEFT JOIN dbo.Cantones ca
    ON ca.IdCanton = d.IdCanton
LEFT JOIN dbo.Provincias p
    ON p.IdProvincia = ca.IdProvincia;
GO

CREATE OR ALTER VIEW dbo.vw_TipoHabitacionConImagen
AS
SELECT
    th.TipoHabitacionId,
    th.Nombre AS TipoHabitacionNombre,
    img.UrlImagen
FROM dbo.TipoHabitacion th
OUTER APPLY
(
    SELECT TOP (1) thi.UrlImagen
    FROM dbo.TipoHabitacionImagen thi
    WHERE thi.TipoHabitacionId = th.TipoHabitacionId
    ORDER BY thi.TipoHabitacionImagenID
) img;
GO

CREATE OR ALTER VIEW dbo.vw_ReservacionesCliente
AS
SELECT
    r.ReservacionId,
    r.ClienteId,
    r.FechaHoraIngreso,
    r.FechaSalida,
    r.CantidadPersonas,
    r.TieneVehiculo,
    r.Activa,

    th.TipoHabitacionNombre,
    th.UrlImagen,

    f.Noches,
    f.TotalPagar,
    f.MetodoPago
FROM dbo.Reservacion r
INNER JOIN dbo.Habitacion h
    ON h.HabitacionId = r.HabitacionId
INNER JOIN dbo.vw_TipoHabitacionConImagen th
    ON th.TipoHabitacionId = h.TipoHabitacionId
LEFT JOIN dbo.Factura f
    ON f.ReservacionId = r.ReservacionId;
GO
--Vistas Auxiliares-----------------------------------------
--Para la vista propia de un usuario cliente
CREATE OR ALTER FUNCTION dbo.fn_ClienteDetalle
(
    @ClienteId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        c.ClienteId,
        c.Nombre,
        c.Apellido1,
        c.Apellido2,
        c.FechaNacimiento,
        c.NumeroIdentificacion,
        c.PaisResidencia,
        c.Telefono1,
        c.Telefono2,
        c.CorreoCliente,
        c.CorreoUsuario,

        c.Provincia,
        c.Canton,
        c.DistritoNombre,

        Reservaciones = (
            SELECT
                r.ReservacionId,
                r.FechaHoraIngreso,
                r.FechaSalida,
                r.CantidadPersonas,
                r.TieneVehiculo,
                r.Activa,

                r.TipoHabitacionNombre,
                r.UrlImagen,

                r.Noches,
                r.TotalPagar,
                r.MetodoPago
            FROM dbo.vw_ReservacionesCliente r
            WHERE r.ClienteId = c.ClienteId
            ORDER BY r.FechaHoraIngreso DESC
            FOR JSON PATH
        )
    FROM dbo.vw_ClienteDetalle c
    WHERE c.ClienteId = @ClienteId
);
GO

--Similar a la anterior, sin reservaciones
CREATE OR ALTER FUNCTION dbo.fn_ClienteDetalleLite
(
    @ClienteId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        c.ClienteId,
        c.Nombre,
        c.Apellido1,
        c.Apellido2,
        c.FechaNacimiento,
        c.NumeroIdentificacion,
        c.PaisResidencia,
        c.Telefono1,
        c.Telefono2,
        c.CorreoCliente,
        c.CorreoUsuario,

        c.Provincia,
        c.Canton,
        c.DistritoId,
		c.DistritoNombre

    FROM dbo.vw_ClienteDetalle c
    WHERE c.ClienteId = @ClienteId
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_EmpresaDetalle
AS
SELECT
    h.CedulaJuridica,
    h.HotelNombre,
    h.TipoEmpresa,
    h.CorreoContacto,
    h.Telefono1,
    h.Telefono2,
    h.SitioWeb,
    h.IdDistrito,
    h.Distrito,
    h.Canton,
    h.Provincia,
    h.Barrio,
    h.SenasExactas,
    h.Latitud,
    h.Longitud,
    u.CorreoUsuario AS CorreoUsuarioLogin
FROM dbo.vw_Hoteles h
JOIN dbo.Empresas e ON e.CedulaJuridica = h.CedulaJuridica
JOIN dbo.Usuarios u ON u.IdUsuario = e.IdUsuario;
GO

CREATE OR ALTER VIEW dbo.vw_RedesSocialesPorEmpresa
AS
SELECT
    rpe.CedulaJuridica,
    rs.RedSocialId,
    rs.Nombre AS RedSocial,
    rpe.Url
FROM dbo.RedesPorEmpresa rpe
JOIN dbo.RedesSociales rs ON rs.RedSocialId = rpe.RedSocialId;
GO

CREATE OR ALTER VIEW dbo.vw_AmenidadesPorEmpresa
AS
SELECT
    ape.CedulaJuridica,
    a.AmenidadId,
    a.Nombre AS Amenidad
FROM dbo.AmenidadesPorEmpresa ape
JOIN dbo.Amenidades a ON a.AmenidadId = ape.AmenidadId;
GO

CREATE OR ALTER VIEW dbo.vw_TiposHabitacion
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
--Vistas Auxiliares-----------------------------------------
--Para la vista propia de un usuario empresa de hospedaje
CREATE OR ALTER FUNCTION dbo.fn_EmpresaDetalle
(
    @CedulaJuridica NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ed.CedulaJuridica,
        ed.HotelNombre,
        ed.TipoEmpresa,
        ed.CorreoContacto,
        ed.CorreoUsuarioLogin,
        ed.Telefono1,
        ed.Telefono2,
        ed.SitioWeb,
        ed.Barrio,
        ed.SenasExactas,
        ed.Latitud,
        ed.Longitud,

        ed.IdDistrito,
        ed.Distrito,
        ed.Canton,
        ed.Provincia,

        -- Redes Sociales
        RedesSociales = (
            SELECT
                rs.RedSocialId,
                rs.RedSocial,
                rs.Url
            FROM dbo.vw_RedesSocialesPorEmpresa rs
            WHERE rs.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        ),

        -- Amenidades
        Amenidades = (
            SELECT
                a.AmenidadId,
                a.Amenidad
            FROM dbo.vw_AmenidadesPorEmpresa a
            WHERE a.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        ),

        -- Tipos de Habitación (JSON)
        TiposHabitacion = (
            SELECT
                th.TipoHabitacionId,
                th.TipoHabitacionNombre,
                th.Descripcion,
                th.Precio,
                th.NumeroDePersonas
            FROM dbo.vw_TiposHabitacion th
            WHERE th.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        )

    FROM dbo.vw_EmpresaDetalle ed
    WHERE ed.CedulaJuridica = @CedulaJuridica
);
GO

--Similar a la anterior, sin tiposhabitaciones
CREATE OR ALTER FUNCTION dbo.fn_EmpresaDetalleLite
(
    @CedulaJuridica NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ed.CedulaJuridica,
        ed.HotelNombre,
        ed.TipoEmpresa,
        ed.CorreoContacto,
        ed.CorreoUsuarioLogin,
        ed.Telefono1,
        ed.Telefono2,
        ed.SitioWeb,
        ed.Barrio,
        ed.SenasExactas,
        ed.Latitud,
        ed.Longitud,

        ed.IdDistrito,
        ed.Distrito,
        ed.Canton,
        ed.Provincia,

        -- Redes Sociales
        RedesSociales = (
            SELECT
                rs.RedSocialId,
                rs.RedSocial,
                rs.Url
            FROM dbo.vw_RedesSocialesPorEmpresa rs
            WHERE rs.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        ),

        -- Amenidades
        Amenidades = (
            SELECT
                a.AmenidadId,
                a.Amenidad
            FROM dbo.vw_AmenidadesPorEmpresa a
            WHERE a.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        )

    FROM dbo.vw_EmpresaDetalle ed
    WHERE ed.CedulaJuridica = @CedulaJuridica
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_ActividadesPorEmpresa
AS
SELECT
    a.ActividadId,
    a.CedulaJuridica,
    e.Nombre AS EmpresaNombre,
    a.Nombre AS ActividadNombre,
    a.Descripcion,
    a.PersonaContacto,
    a.Precio,
    a.UrlImagen
FROM dbo.Actividades a
JOIN dbo.Empresas e
    ON e.CedulaJuridica = a.CedulaJuridica;
GO

--Para la vista propia de un usuario empresa de actividades
CREATE OR ALTER FUNCTION dbo.fn_EmpresaDetalleActividades
(
    @CedulaJuridica NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ed.CedulaJuridica,
        ed.HotelNombre,
        ed.TipoEmpresa,
        ed.CorreoContacto,
        ed.CorreoUsuarioLogin,
        ed.Telefono1,
        ed.Telefono2,
        ed.SitioWeb,
        ed.Barrio,
        ed.SenasExactas,
        ed.Latitud,
        ed.Longitud,

        ed.IdDistrito,
        ed.Distrito,
        ed.Canton,
        ed.Provincia,

        -- Redes Sociales
        RedesSociales = (
            SELECT
                rs.RedSocialId,
                rs.RedSocial,
                rs.Url
            FROM dbo.vw_RedesSocialesPorEmpresa rs
            WHERE rs.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        ),

        -- Amenidades
        Amenidades = (
            SELECT
                a.AmenidadId,
                a.Amenidad
            FROM dbo.vw_AmenidadesPorEmpresa a
            WHERE a.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        ),

        -- Actividades
        Actividades = (
            SELECT
                act.ActividadId,
                act.ActividadNombre,
                act.Descripcion,
                act.PersonaContacto,
                act.Precio,
                act.UrlImagen
            FROM dbo.vw_ActividadesPorEmpresa act
            WHERE act.CedulaJuridica = ed.CedulaJuridica
            FOR JSON PATH
        )

    FROM dbo.vw_EmpresaDetalle ed
    WHERE ed.CedulaJuridica = @CedulaJuridica
);
GO

--Para una vista resumida de TipoHabitacion, la intencion es para generar la reserva
CREATE OR ALTER FUNCTION dbo.fn_TipoHabitacionDetalleMini
(
    @TipoHabitacionId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        th.TipoHabitacionId,
        th.CedulaJuridica,
        th.HotelNombre,
        th.TipoHabitacionNombre,
        th.Descripcion,
        th.Precio,
        th.NumeroDePersonas
    FROM dbo.vw_TiposHabitacion th
    WHERE th.TipoHabitacionId = @TipoHabitacionId
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_CuartosPorEmpresa
AS
SELECT
    th.TipoHabitacionId,
    th.CedulaJuridica,
    e.Nombre AS EmpresaNombre,
    th.Nombre AS TipoHabitacionNombre,
    th.Descripcion,
    th.Precio,
    th.NumeroDePersonas,
    img.UrlImagen
FROM dbo.TipoHabitacion th
JOIN dbo.Empresas e
    ON e.CedulaJuridica = th.CedulaJuridica
OUTER APPLY (
    SELECT TOP (1) thi.UrlImagen
    FROM dbo.TipoHabitacionImagen thi
    WHERE thi.TipoHabitacionId = th.TipoHabitacionId
    ORDER BY thi.TipoHabitacionImagenID
) img;
GO
--Vistas Auxiliares-----------------------------------------
--Todos los tipohabitacion de una empresa
CREATE OR ALTER FUNCTION dbo.fn_GetTipoHabitacionesByEmpresa
(
    @CedulaJuridica NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        th.TipoHabitacionId,
        th.CedulaJuridica,
        e.Nombre AS EmpresaNombre,
        th.Nombre AS TipoHabitacionNombre,
        th.Descripcion,
        th.Precio,
        th.NumeroDePersonas,
        img.UrlImagen
    FROM dbo.TipoHabitacion th
    JOIN dbo.Empresas e
        ON e.CedulaJuridica = th.CedulaJuridica
    OUTER APPLY (
        SELECT TOP (1) thi.UrlImagen
        FROM dbo.TipoHabitacionImagen thi
        WHERE thi.TipoHabitacionId = th.TipoHabitacionId
        ORDER BY thi.TipoHabitacionImagenID
    ) img
    WHERE th.CedulaJuridica = @CedulaJuridica
);
GO

--Todas las actividades de una empresa
CREATE OR ALTER FUNCTION dbo.fn_GetActividadesByEmpresa
(
    @CedulaJuridica VARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ActividadId,
        CedulaJuridica,
        EmpresaNombre,
        ActividadNombre,
        Descripcion,
        PersonaContacto,
        Precio,
        UrlImagen
    FROM dbo.vw_ActividadesPorEmpresa
    WHERE CedulaJuridica = @CedulaJuridica
);
GO

--Vistas Auxiliares-----------------------------------------
CREATE OR ALTER VIEW dbo.vw_TiposHabitacionConHabitaciones
AS
SELECT
    th.TipoHabitacionId,
    th.CedulaJuridica,
    th.Nombre AS TipoHabitacionNombre,
    h.HabitacionId,
    h.Numero AS HabitacionNumero,
    h.Activa AS HabitacionActiva
FROM dbo.TipoHabitacion th
LEFT JOIN dbo.Habitacion h
    ON h.TipoHabitacionId = th.TipoHabitacionId
    AND h.CedulaJuridica = th.CedulaJuridica;
GO
--Vistas Auxiliares-----------------------------------------
--Tipos de cuartos + cuartos, para reservaciones.
CREATE OR ALTER FUNCTION dbo.fn_TiposHabitacionConHabitaciones
(
    @CedulaJuridica NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        th.TipoHabitacionId,
        th.Nombre,
        Habitaciones = (
            SELECT
                h.HabitacionId,
                h.HabitacionNumero,
                h.HabitacionActiva
            FROM dbo.vw_TiposHabitacionConHabitaciones h
            WHERE h.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        )
    FROM dbo.TipoHabitacion th
    WHERE th.CedulaJuridica = @CedulaJuridica
);
GO

--Reservaciones por tiempo y cuartos
CREATE OR ALTER FUNCTION dbo.fn_ReservacionesConFacturasYCargos
(
    @FechaInicio DATE,
    @FechaFin DATE,
    @Habitaciones dbo.ListaHabitaciones READONLY
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        h.HabitacionId,
        h.Numero AS HabitacionNumero,
        h.TipoHabitacionId,
        th.Nombre AS TipoHabitacionNombre,

        r.ReservacionId,
        r.ClienteId,
        r.FechaHoraIngreso,
        r.FechaSalida,
        r.CantidadPersonas,
        r.TieneVehiculo,
        r.Activa AS ReservacionActiva,

        f.FacturaId,
        f.FechaHoraRegistro AS FacturaFecha,
        f.CargosHabitacion,
        f.Noches,
        f.TotalPagar,
        f.MetodoPago,

        -- Nested JSON for tipos de cargo
        TiposDeCargo = (
            SELECT
                tc.TipoCargoId,
                tc.Nombre AS TipoCargoNombre,
                ch.Precio
            FROM dbo.CargosHabitacion ch
            INNER JOIN dbo.TiposDeCargo tc
                ON tc.TipoCargoId = ch.TipoCargoId
            WHERE ch.TipoHabitacionId = h.TipoHabitacionId
            FOR JSON PATH
        )
    FROM dbo.Habitacion h
    INNER JOIN @Habitaciones hab
        ON hab.HabitacionId = h.HabitacionId
    LEFT JOIN dbo.Reservacion r
        ON r.HabitacionId = h.HabitacionId
        AND r.FechaHoraIngreso >= @FechaInicio
        AND r.FechaSalida <= @FechaFin
    LEFT JOIN dbo.Factura f
        ON f.ReservacionId = r.ReservacionId
    INNER JOIN dbo.TipoHabitacion th
        ON th.TipoHabitacionId = h.TipoHabitacionId
);
GO

--Reservaciones totales, ingresos generados y edad promedio
CREATE OR ALTER FUNCTION dbo.fn_ReservacionesResumen
(
    @FechaInicio DATE,
    @FechaFin DATE,
    @Habitaciones dbo.ListaHabitaciones READONLY
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        -- 1. Reservaciones totales
        COUNT(r.ReservacionId) AS TotalReservaciones,

        -- 2. Ingresos totales
        SUM(f.TotalPagar) AS TotalRevenue,

        -- 3. Promedio edad
        AVG(DATEDIFF(YEAR, c.FechaNacimiento, GETDATE())
            - CASE 
                WHEN DATEADD(YEAR, DATEDIFF(YEAR, c.FechaNacimiento, GETDATE()), c.FechaNacimiento) > GETDATE() 
                THEN 1 ELSE 0 END
        ) AS PromedioEdad
    FROM dbo.Reservacion r
    INNER JOIN @Habitaciones h
        ON h.HabitacionId = r.HabitacionId
    LEFT JOIN dbo.Factura f
        ON f.ReservacionId = r.ReservacionId
    INNER JOIN dbo.Cliente c
        ON c.ClienteId = r.ClienteId
    WHERE r.Estado <> N'CREADO'
      AND r.FechaHoraIngreso >= @FechaInicio
      AND r.FechaSalida <= @FechaFin
);
GO

--Mejores empresas por demanda
CREATE OR ALTER FUNCTION dbo.fn_EmpresasPorReservaciones
(
    @FechaInicio DATE,
    @FechaFin DATE
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        e.CedulaJuridica,
        e.Nombre AS EmpresaNombre,
        te.Nombre AS TipoEmpresaNombre,
        p.Nombre AS Provincia,
        c.Nombre AS Canton,
        d.Nombre AS Distrito,
        COUNT(r.ReservacionId) AS TotalReservaciones
    FROM dbo.Empresas e
    INNER JOIN dbo.TipoEmpresa te
        ON te.TipoEmpresaId = e.TipoEmpresaId
    LEFT JOIN dbo.TipoHabitacion th
        ON th.CedulaJuridica = e.CedulaJuridica
    LEFT JOIN dbo.Habitacion h
        ON h.TipoHabitacionId = th.TipoHabitacionId
    LEFT JOIN dbo.Reservacion r
        ON r.HabitacionId = h.HabitacionId
        AND r.FechaHoraIngreso >= @FechaInicio
        AND r.FechaSalida <= @FechaFin
    INNER JOIN dbo.Distritos d
        ON d.IdDistrito = e.IdDistrito
    INNER JOIN dbo.Cantones c
        ON c.IdCanton = d.IdCanton
    INNER JOIN dbo.Provincias p
        ON p.IdProvincia = c.IdProvincia
    WHERE e.TipoEmpresaId <> 1
    GROUP BY
        e.CedulaJuridica,
        e.Nombre,
        te.Nombre,
        p.Nombre,
        c.Nombre,
        d.Nombre
);
GO

--Todo sobre tipoHabitacion, para el autofill en editRoomInfo
CREATE OR ALTER FUNCTION dbo.fn_TipoHabitacionMegaDetalle
(
    @TipoHabitacionId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        th.TipoHabitacionId,
        th.Nombre            AS Nombre,
        th.Descripcion       AS Descripcion,
        th.Precio            AS Precio,
        th.NumeroDePersonas,
		th.CedulaJuridica,

        -- Charges
        Charges = (
            SELECT
                ch.TipoCargoId      AS typeId,
                tc.Nombre           AS typeName,
                ch.Precio           AS amount
            FROM dbo.CargosHabitacion ch
            INNER JOIN dbo.TiposDeCargo tc
                ON tc.TipoCargoId = ch.TipoCargoId
            WHERE ch.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Rooms
        Rooms = (
            SELECT
                h.HabitacionId      AS id,
                h.Numero            AS name,
                h.Activa            AS active
            FROM dbo.Habitacion h
            WHERE h.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Beds
        Beds = (
            SELECT
                thc.TipoCamaId      AS bedTypeId,
                tc.Nombre           AS bedTypeName,
                thc.Cantidad        AS quantity
            FROM dbo.TipoHabitacionCama thc
            INNER JOIN dbo.TipoCama tc
                ON tc.TipoCamaId = thc.TipoCamaId
            WHERE thc.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Amenities
        Amenities = (
            SELECT
                c.ComodidadId       AS amenityId,
                c.Nombre            AS amenityName
            FROM dbo.TipoHabitacionComodidad thc
            INNER JOIN dbo.Comodidades c
                ON c.ComodidadId = thc.ComodidadId
            WHERE thc.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        ),

        -- Photos
        Photos = (
            SELECT
                thi.TipoHabitacionImagenID AS id,
                thi.UrlImagen              AS url
            FROM dbo.TipoHabitacionImagen thi
            WHERE thi.TipoHabitacionId = th.TipoHabitacionId
            FOR JSON PATH
        )

    FROM dbo.TipoHabitacion th
    WHERE th.TipoHabitacionId = @TipoHabitacionId
);
GO

----------------------------------------------
-- Creacion Cuenta
----------------------------------------------

--Crear nuevo usuario empresa
CREATE OR ALTER PROCEDURE dbo.sp_CrearEmpresaUsuario
(
    -- Usuario
    @Correo NVARCHAR(254),
    @Password VARCHAR(255),

    -- Empresa
    @CedulaJuridica NVARCHAR(50),
    @NombreEmpresa NVARCHAR(200),
    @TipoEmpresaId INT,
    @Telefono1 NVARCHAR(16),
    @Telefono2 NVARCHAR(16),
    @SitioWeb NVARCHAR(300) = NULL,
    @IdDistrito INT,
    @Barrio NVARCHAR(100) = NULL,
    @SenasExactas NVARCHAR(400),
    @Latitud DECIMAL(9,6) = NULL,
    @Longitud DECIMAL(9,6) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO dbo.Usuarios (CorreoUsuario, PasswordHash)
        VALUES (@Correo, @Password);

        SET @IdUsuario = SCOPE_IDENTITY();

        INSERT INTO dbo.Empresas
        (
            CedulaJuridica,
            IdUsuario,
            Nombre,
            TipoEmpresaId,
            CorreoContacto,
            Telefono1,
            Telefono2,
            SitioWeb,
            IdDistrito,
            Barrio,
            SenasExactas,
            Latitud,
            Longitud
        )
        VALUES
        (
            @CedulaJuridica,
            @IdUsuario,
            @NombreEmpresa,
            @TipoEmpresaId,
            @Correo,
            @Telefono1,
            @Telefono2,
            @SitioWeb,
            @IdDistrito,
            @Barrio,
            @SenasExactas,
            @Latitud,
            @Longitud
        );

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

--Crear nuevo usuario cliente
CREATE OR ALTER PROCEDURE dbo.sp_CrearClienteUsuario
(
    @Correo NVARCHAR(254),
    @PasswordHash VARCHAR(255),

    @Nombre NVARCHAR(120),
    @Apellido1 NVARCHAR(120),
    @Apellido2 NVARCHAR(120) = NULL,
    @FechaNacimiento DATE,
    @TipoIdentificacionId INT,
    @NumeroIdentificacion NVARCHAR(50),
    @PaisResidencia NVARCHAR(100),
    @IdDistrito INT = NULL,
    @Telefono1 NVARCHAR(16),
    @Telefono2 NVARCHAR(16) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO dbo.Usuarios (CorreoUsuario, PasswordHash)
        VALUES (@Correo, @PasswordHash);

        SET @IdUsuario = SCOPE_IDENTITY();

        INSERT INTO dbo.Cliente
        (
            IdUsuario,
            Nombre,
            Apellido1,
            Apellido2,
            FechaNacimiento,
            TipoIdentificacionId,
            NumeroIdentificacion,
            PaisResidencia,
            IdDistrito,
            Telefono1,
            Telefono2,
            CorreoContacto
        )
        VALUES
        (
            @IdUsuario,
            @Nombre,
            @Apellido1,
            @Apellido2,
            @FechaNacimiento,
            @TipoIdentificacionId,
            @NumeroIdentificacion,
            @PaisResidencia,
            @IdDistrito,
            @Telefono1,
            @Telefono2,
            @Correo
        );

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

----------------------------------------------
-- Login
----------------------------------------------

--Checks para login
CREATE OR ALTER PROCEDURE sp_LoginUsuario
    @Correo NVARCHAR(254),
    @PasswordHash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CASE 
            WHEN cl.ClienteId IS NOT NULL THEN CAST(cl.ClienteId AS NVARCHAR(50))
            WHEN e.CedulaJuridica IS NOT NULL THEN e.CedulaJuridica
            ELSE CAST(u.IdUsuario AS NVARCHAR(50))
        END AS IdUsuario,
        
        u.IdUsuario AS UsuarioID,
        u.CorreoUsuario,
        u.Activo,
        
        CASE 
            WHEN cl.ClienteId IS NOT NULL AND u.EsAdministrador = 0 THEN 'user'
            WHEN cl.ClienteId IS NOT NULL AND u.EsAdministrador = 1 THEN 'admin'
            WHEN e.CedulaJuridica IS NOT NULL AND e.TipoEmpresaId != 1 THEN 'company_hosting'
            WHEN e.CedulaJuridica IS NOT NULL AND e.TipoEmpresaId = 1 THEN 'company_entertainment'
            ELSE 'unknown'
        END AS Role,

        CASE
            WHEN cl.ClienteId IS NOT NULL THEN cl.Nombre
            WHEN e.CedulaJuridica IS NOT NULL THEN e.Nombre
            ELSE NULL
        END AS Name

    FROM Usuarios u
    LEFT JOIN Cliente cl ON cl.IdUsuario = u.IdUsuario
    LEFT JOIN Empresas e ON e.IdUsuario = u.IdUsuario
    WHERE u.CorreoUsuario = @Correo
      AND u.PasswordHash = @PasswordHash
      AND u.Activo = 1;
END;
GO

----------------------------------------------
-- Updates Info Usuarios/Empresas
----------------------------------------------

--Actualiza la contraseña del usuario
CREATE OR ALTER PROCEDURE dbo.sp_ActualizarPasswordUsuario
(
    @UniqueId NVARCHAR(50), -- ClienteId o CedulaJuridica
    @Rol NVARCHAR(20), -- 'user', 'company'
    @PasswordHash VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;

    BEGIN TRY
        BEGIN TRAN;

        IF @Rol = 'user'
        BEGIN
            SELECT @IdUsuario = c.IdUsuario
            FROM dbo.Cliente c
            WHERE c.ClienteId = TRY_CAST(@UniqueId AS INT);
        END
        ELSE IF @Rol = 'company'
        BEGIN
            SELECT @IdUsuario = e.IdUsuario
            FROM dbo.Empresas e
            WHERE e.CedulaJuridica = @UniqueId;
        END
        ELSE
        BEGIN
            THROW 50001, 'Rol inválido. Use "user" o "company".', 1;
        END

        IF @IdUsuario IS NULL
        BEGIN
            THROW 50002, 'No se pudo encontrar el usuario asociado al identificador proporcionado.', 1;
        END

        UPDATE dbo.Usuarios
        SET PasswordHash = @PasswordHash
        WHERE IdUsuario = @IdUsuario
          AND Activo = 1;

        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Usuario no existe o está inactivo.', 1;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

--Actualiza info de cliente
CREATE OR ALTER PROCEDURE dbo.sp_ActualizarCliente
(
    @ClienteId INT,

    @Nombre NVARCHAR(120),
    @Apellido1 NVARCHAR(120),
    @Apellido2 NVARCHAR(120) = NULL,
    @FechaNacimiento DATE,

    @TipoIdentificacionId INT,
    @NumeroIdentificacion NVARCHAR(50),

    @PaisResidencia NVARCHAR(100),
    @IdDistrito INT = NULL,

    @Telefono1 NVARCHAR(16),
    @Telefono2 NVARCHAR(16) = NULL,

    @CorreoContacto NVARCHAR(254)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE dbo.Cliente
        SET
            Nombre = @Nombre,
            Apellido1 = @Apellido1,
            Apellido2 = @Apellido2,
            FechaNacimiento = @FechaNacimiento,
            TipoIdentificacionId = @TipoIdentificacionId,
            NumeroIdentificacion = @NumeroIdentificacion,
            PaisResidencia = @PaisResidencia,
            IdDistrito = @IdDistrito,
            Telefono1 = @Telefono1,
            Telefono2 = @Telefono2,
            CorreoContacto = @CorreoContacto
        WHERE ClienteId = @ClienteId;

        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cliente no existe.', 1;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

--Elimina cliente y usuario
CREATE OR ALTER PROCEDURE dbo.sp_EliminarClienteYUsuario
(
    @ClienteId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;

    BEGIN TRY
        BEGIN TRAN;

        SELECT @IdUsuario = IdUsuario
        FROM dbo.Cliente
        WHERE ClienteId = @ClienteId;

        IF @IdUsuario IS NULL
        BEGIN
            THROW 50010, 'El cliente no existe.', 1;
        END

        DELETE FROM dbo.Cliente
        WHERE ClienteId = @ClienteId;

        IF EXISTS (
            SELECT 1
            FROM dbo.Cliente
            WHERE ClienteId = @ClienteId
        )
        BEGIN
            THROW 50011, 'No se pudo eliminar el cliente.', 1;
        END

        DELETE FROM dbo.Usuarios
        WHERE IdUsuario = @IdUsuario;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

--Actualiza info de empresas
CREATE OR ALTER PROCEDURE dbo.sp_Empresa_Update
(
    @CedulaJuridica     NVARCHAR(50),

    @Nombre             NVARCHAR(200),
    @TipoEmpresaId      INT,
    @CorreoContacto     NVARCHAR(254),
    @Telefono1          NVARCHAR(16),
    @Telefono2          NVARCHAR(16) = NULL,
    @SitioWeb           NVARCHAR(300) = NULL,
    @IdDistrito         INT,
    @Barrio             NVARCHAR(100) = NULL,
    @SenasExactas       NVARCHAR(400),
    @Latitud            DECIMAL(9,6) = NULL,
    @Longitud           DECIMAL(9,6) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica
    )
    BEGIN
        RAISERROR(N'La empresa especificada no existe.', 16, 1);
        RETURN;
    END

    UPDATE dbo.Empresas
    SET
        Nombre         = @Nombre,
        TipoEmpresaId  = @TipoEmpresaId,
        CorreoContacto = @CorreoContacto,
        Telefono1      = @Telefono1,
        Telefono2      = @Telefono2,
        SitioWeb       = @SitioWeb,
        IdDistrito     = @IdDistrito,
        Barrio         = @Barrio,
        SenasExactas   = @SenasExactas,
        Latitud        = @Latitud,
        Longitud       = @Longitud
    WHERE CedulaJuridica = @CedulaJuridica;
END;
GO

--Borrar empresa
CREATE OR ALTER PROCEDURE dbo.sp_Empresa_Delete
(
    @CedulaJuridica NVARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT
            @IdUsuario = IdUsuario
        FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica;

        IF @IdUsuario IS NULL
        BEGIN
            RAISERROR(N'La empresa especificada no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DELETE FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica;

        DELETE FROM dbo.Usuarios
        WHERE IdUsuario = @IdUsuario;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

--Crear enlace amenidades/empresas
CREATE OR ALTER PROCEDURE dbo.sp_AmenidadEmpresa_Add
(
    @CedulaJuridica NVARCHAR(50),
    @AmenidadId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica
    )
    BEGIN
        RAISERROR(N'La empresa no existe.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Amenidades
        WHERE AmenidadId = @AmenidadId
    )
    BEGIN
        RAISERROR(N'La amenidad no existe.', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM dbo.AmenidadesPorEmpresa
        WHERE CedulaJuridica = @CedulaJuridica
          AND AmenidadId = @AmenidadId
    )
    BEGIN
        RAISERROR(N'La amenidad ya está asociada a la empresa.', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.AmenidadesPorEmpresa
    (
        CedulaJuridica,
        AmenidadId
    )
    VALUES
    (
        @CedulaJuridica,
        @AmenidadId
    );
END;
GO

--Borrar enlace amenidades/empresas
CREATE OR ALTER PROCEDURE dbo.sp_AmenidadEmpresa_Delete
(
    @CedulaJuridica NVARCHAR(50),
    @AmenidadId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.AmenidadesPorEmpresa
        WHERE CedulaJuridica = @CedulaJuridica
          AND AmenidadId = @AmenidadId
    )
    BEGIN
        RAISERROR(N'La amenidad no está asociada a la empresa.', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.AmenidadesPorEmpresa
    WHERE CedulaJuridica = @CedulaJuridica
      AND AmenidadId = @AmenidadId;
END;
GO

--Crear enlace redsocial/empresas
CREATE OR ALTER PROCEDURE dbo.sp_RedEmpresa_Add
(
    @CedulaJuridica NVARCHAR(50),
    @RedSocialId INT,
    @Url NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica
    )
    BEGIN
        RAISERROR(N'La empresa no existe.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.RedesSociales
        WHERE RedSocialId = @RedSocialId
    )
    BEGIN
        RAISERROR(N'La red social no existe.', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM dbo.RedesPorEmpresa
        WHERE CedulaJuridica = @CedulaJuridica
          AND RedSocialId = @RedSocialId
    )
    BEGIN
        RAISERROR(N'La red social ya está asociada a la empresa.', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.RedesPorEmpresa
    (
        CedulaJuridica,
        RedSocialId,
        Url
    )
    VALUES
    (
        @CedulaJuridica,
        @RedSocialId,
        @Url
    );
END;
GO

--Editar enlace redsocial/empresas
CREATE OR ALTER PROCEDURE dbo.sp_RedEmpresa_UpdateUrl
(
    @CedulaJuridica NVARCHAR(50),
    @RedSocialId INT,
    @Url NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.RedesPorEmpresa
        WHERE CedulaJuridica = @CedulaJuridica
          AND RedSocialId = @RedSocialId
    )
    BEGIN
        RAISERROR(N'La red social no está asociada a la empresa.', 16, 1);
        RETURN;
    END

    UPDATE dbo.RedesPorEmpresa
    SET Url = @Url
    WHERE CedulaJuridica = @CedulaJuridica
      AND RedSocialId = @RedSocialId;
END;
GO

--Borrar enlace redsocial/empresas
CREATE OR ALTER PROCEDURE dbo.sp_RedEmpresa_Delete
(
    @CedulaJuridica NVARCHAR(50),
    @RedSocialId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.RedesPorEmpresa
        WHERE CedulaJuridica = @CedulaJuridica
          AND RedSocialId = @RedSocialId
    )
    BEGIN
        RAISERROR(N'La red social no está asociada a la empresa.', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.RedesPorEmpresa
    WHERE CedulaJuridica = @CedulaJuridica
      AND RedSocialId = @RedSocialId;
END;
GO

--Crear tipo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacion_Add
(
    @CedulaJuridica NVARCHAR(50),
    @Nombre NVARCHAR(120),
    @Descripcion NVARCHAR(400) = NULL,
    @Precio DECIMAL(12,2),
    @NumeroDePersonas INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Empresas
        WHERE CedulaJuridica = @CedulaJuridica
    )
    BEGIN
        RAISERROR(N'La empresa no existe.', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.TipoHabitacion
    (
        CedulaJuridica,
        Nombre,
        Descripcion,
        Precio,
        NumeroDePersonas
    )
    VALUES
    (
        @CedulaJuridica,
        @Nombre,
        @Descripcion,
        @Precio,
        @NumeroDePersonas
    );
END;
GO

--Editar tipo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacion_Update
(
    @TipoHabitacionId INT,
    @Nombre NVARCHAR(120),
    @Descripcion NVARCHAR(400) = NULL,
    @Precio DECIMAL(12,2),
    @NumeroDePersonas INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.TipoHabitacion
        WHERE TipoHabitacionId = @TipoHabitacionId
    )
    BEGIN
        RAISERROR(N'El tipo de habitación no existe.', 16, 1);
        RETURN;
    END

    UPDATE dbo.TipoHabitacion
    SET
        Nombre = @Nombre,
        Descripcion = @Descripcion,
        Precio = @Precio,
        NumeroDePersonas = @NumeroDePersonas
    WHERE TipoHabitacionId = @TipoHabitacionId;
END;
GO

--Borrar tipo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacion_Delete
(
    @TipoHabitacionId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.TipoHabitacion
        WHERE TipoHabitacionId = @TipoHabitacionId
    )
    BEGIN
        RAISERROR(N'El tipo de habitación no existe.', 16, 1);
        RETURN;
    END

    BEGIN TRAN;

    DELETE FROM dbo.Habitacion
    WHERE TipoHabitacionId = @TipoHabitacionId;

    DELETE FROM dbo.TipoHabitacion
    WHERE TipoHabitacionId = @TipoHabitacionId;

    COMMIT TRAN;
END;
GO

--Crear cargo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_CargosHabitacion_Add
(
    @TipoHabitacionId INT,
    @TipoCargoId INT,
    @Precio DECIMAL(12,2)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.CargosHabitacion
    (
        TipoHabitacionId,
        TipoCargoId,
        Precio
    )
    VALUES
    (
        @TipoHabitacionId,
        @TipoCargoId,
        @Precio
    );
END;
GO

--Editar cargo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_CargosHabitacion_Update
(
    @TipoHabitacionId INT,
    @TipoCargoId INT,
    @Precio DECIMAL(12,2)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.CargosHabitacion
    SET Precio = @Precio
    WHERE
        TipoHabitacionId = @TipoHabitacionId
        AND TipoCargoId = @TipoCargoId;
END;
GO

--Borrar cargo habitacion
CREATE OR ALTER PROCEDURE dbo.sp_CargosHabitacion_Delete
(
    @TipoHabitacionId INT,
    @TipoCargoId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.CargosHabitacion
    WHERE
        TipoHabitacionId = @TipoHabitacionId
        AND TipoCargoId = @TipoCargoId;
END;
GO

--Crear habitacion
CREATE OR ALTER PROCEDURE dbo.sp_Habitacion_Add
(
    @CedulaJuridica NVARCHAR(50),
    @Numero NVARCHAR(20),
    @TipoHabitacionId INT,
    @Activa BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Habitacion
    (
        CedulaJuridica,
        Numero,
        TipoHabitacionId,
        Activa
    )
    VALUES
    (
        @CedulaJuridica,
        @Numero,
        @TipoHabitacionId,
        @Activa
    );
END;
GO

--Editar habitacion
CREATE OR ALTER PROCEDURE dbo.sp_Habitacion_Update
(
    @HabitacionId INT,
    @Numero NVARCHAR(20),
    @Activa BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Habitacion
    SET
        Numero = @Numero,
        Activa = @Activa
    WHERE HabitacionId = @HabitacionId;
END;
GO

--Borrar habitacion
CREATE OR ALTER PROCEDURE dbo.sp_Habitacion_Delete
(
    @HabitacionId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.Habitacion
    WHERE HabitacionId = @HabitacionId;
END;
GO

--Crear enlace tipo cama
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionCama_Add
(
    @TipoHabitacionId INT,
    @TipoCamaId INT,
    @Cantidad INT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TipoHabitacionCama (
        TipoHabitacionId,
        TipoCamaId,
        Cantidad
    )
    VALUES (
        @TipoHabitacionId,
        @TipoCamaId,
        @Cantidad
    );
END;
GO

--Editar enlace tipo cama
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionCama_Update
(
    @TipoHabitacionId INT,
    @TipoCamaId INT,
    @Cantidad INT
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TipoHabitacionCama
    SET Cantidad = @Cantidad
    WHERE
        TipoHabitacionId = @TipoHabitacionId
        AND TipoCamaId = @TipoCamaId;
END;
GO

--Borrar enlace tipo cama
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionCama_Delete
(
    @TipoHabitacionId INT,
    @TipoCamaId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.TipoHabitacionCama
    WHERE
        TipoHabitacionId = @TipoHabitacionId
        AND TipoCamaId = @TipoCamaId;
END;
GO

--Crear comodidades habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionComodidad_Add
(
    @TipoHabitacionId INT,
    @ComodidadId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TipoHabitacionComodidad (
        TipoHabitacionId,
        ComodidadId
    )
    VALUES (
        @TipoHabitacionId,
        @ComodidadId
    );
END;
GO

--Borrar comodidades habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionComodidad_Delete
(
    @TipoHabitacionId INT,
    @ComodidadId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.TipoHabitacionComodidad
    WHERE
        TipoHabitacionId = @TipoHabitacionId
        AND ComodidadId = @ComodidadId;
END;
GO

--Crear imagen habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionImagen_Add
(
    @TipoHabitacionId INT,
    @UrlImagen NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TipoHabitacionImagen (
        TipoHabitacionId,
        UrlImagen
    )
    VALUES (
        @TipoHabitacionId,
        @UrlImagen
    );
END;
GO

--Borrar imagen habitacion
CREATE OR ALTER PROCEDURE dbo.sp_TipoHabitacionImagen_Delete
(
    @TipoHabitacionImagenID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.TipoHabitacionImagen
    WHERE TipoHabitacionImagenID = @TipoHabitacionImagenID;
END;
GO

--Crear actividad 
CREATE OR ALTER PROCEDURE dbo.sp_Actividad_Add
(
    @CedulaJuridica   NVARCHAR(50),
    @Nombre           NVARCHAR(200),
    @Descripcion      NVARCHAR(600) = NULL,
    @PersonaContacto  NVARCHAR(200),
    @Precio           DECIMAL(12,2),
    @UrlImagen        NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Actividades (
        CedulaJuridica,
        Nombre,
        Descripcion,
        PersonaContacto,
        Precio,
        UrlImagen
    )
    VALUES (
        @CedulaJuridica,
        @Nombre,
        @Descripcion,
        @PersonaContacto,
        @Precio,
        @UrlImagen
    );
END;
GO

--Editar actividad
CREATE OR ALTER PROCEDURE dbo.sp_Actividad_Update
(
    @ActividadId      INT,
    @Nombre           NVARCHAR(200),
    @Descripcion      NVARCHAR(600) = NULL,
    @PersonaContacto  NVARCHAR(200),
    @Precio           DECIMAL(12,2),
    @UrlImagen        NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Actividades
    SET
        Nombre = @Nombre,
        Descripcion = @Descripcion,
        PersonaContacto = @PersonaContacto,
        Precio = @Precio,
        UrlImagen = @UrlImagen
    WHERE ActividadId = @ActividadId;
END;
GO

--Borrar actividad
CREATE OR ALTER PROCEDURE dbo.sp_Actividad_Delete
(
    @ActividadId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.Actividades
    WHERE ActividadId = @ActividadId;
END;
GO

--Crear enlace tipo actividad
CREATE OR ALTER PROCEDURE dbo.sp_TipoActividadPorActividad_Add
(
    @ActividadId      INT,
    @TipoActividadId  INT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TipoDeActividadPorActividad (
        ActividadId,
        TipoActividadId
    )
    VALUES (
        @ActividadId,
        @TipoActividadId
    );
END;
GO

--Borrar enlace tipo actividad
CREATE OR ALTER PROCEDURE dbo.sp_TipoActividadPorActividad_Delete
(
    @ActividadId      INT,
    @TipoActividadId  INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.TipoDeActividadPorActividad
    WHERE ActividadId = @ActividadId
      AND TipoActividadId = @TipoActividadId;
END;
GO

----------------------------------------------
-- Views Admin
----------------------------------------------

--Listado para admin de clientes
CREATE OR ALTER VIEW dbo.vs_AdminUsuariosClientes
AS
SELECT
    u.IdUsuario,
    u.CorreoUsuario,
    Nombre = CONCAT(
        c.Nombre, N' ',
        c.Apellido1,
        ISNULL(N' ' + c.Apellido2, N'')
    ),
    u.EsAdministrador
FROM dbo.Usuarios u
INNER JOIN dbo.Cliente c
    ON c.IdUsuario = u.IdUsuario;
GO

--Listado para admin de empresas hospedaje
CREATE OR ALTER VIEW dbo.vs_AdminEmpresasHoteles
AS
SELECT
    u.IdUsuario,
    u.CorreoUsuario,
    e.Nombre AS EmpresaNombre,
    e.CedulaJuridica,

    TiposHabitacion = (
        SELECT
            th.TipoHabitacionId,
            th.TipoHabitacionNombre,
            th.Descripcion,
            th.Precio,
            th.NumeroDePersonas
        FROM dbo.vw_TiposHabitacion th
        WHERE th.CedulaJuridica = e.CedulaJuridica
        FOR JSON PATH
    )

FROM dbo.Usuarios u
INNER JOIN dbo.Empresas e
    ON e.IdUsuario = u.IdUsuario
WHERE e.TipoEmpresaId <> 01;
GO

--Listado para admin de empresas actividades
CREATE OR ALTER VIEW dbo.vs_AdminEmpresasActividades
AS
SELECT
    u.IdUsuario,
    u.CorreoUsuario,
    e.Nombre AS EmpresaNombre,
    e.CedulaJuridica,

    Actividades = (
        SELECT
            a.ActividadId,
            a.ActividadNombre,
            a.Descripcion,
            a.PersonaContacto,
            a.Precio,
            a.UrlImagen
        FROM dbo.vw_ActividadesPorEmpresa a
        WHERE a.CedulaJuridica = e.CedulaJuridica
        FOR JSON PATH
    )

FROM dbo.Usuarios u
INNER JOIN dbo.Empresas e
    ON e.IdUsuario = u.IdUsuario
WHERE e.TipoEmpresaId = 01;
GO

select * from Usuarios