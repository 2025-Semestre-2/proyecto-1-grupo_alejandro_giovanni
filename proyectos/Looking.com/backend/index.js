import session from "express-session";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getConnection, sql } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.get("/whoami", (req, res) => {
  res.send({ user: process.env.USERNAME || process.env.USER });
});

// Get current session info
app.get("/whoamisession", (req, res) => {
  if (!req.session || !req.session.usuarioId) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    usuarioId: req.session.usuarioId,
    uniqueId: req.session.uniqueId,
    role: req.session.role,
    name: req.session.name,
  });
});

app.get("/", (req, res) => {
  res.json({ status: "Backend funciona" });
});

app.get("/db-test", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS ok");
    res.json(result.recordset);
  } catch (err) {
    console.error("DB ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Correo", sql.NVarChar(254), email)
      .input("PasswordHash", sql.VarChar(255), password)
      .execute("sp_LoginUsuario");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.recordset[0];

    req.session.usuarioId = user.IdUsuario;
    req.session.uniqueId = user.UsuarioID;
    req.session.role = user.Role;
    req.session.name = user.Name;

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "No se pudo cerrar sesión" });
    res.clearCookie("sid"); // matches cookie name
    res.json({ message: "Sesión cerrada" });
  });
});

//crear-usuario cliente
app.post("/crear-usuario", async (req, res) => {
  const {
    email,
    password,
    name,
    lastName1,
    lastName2,
    birthDate,
    idType,
    idNumber,
    country,
    district,
    phone,
    extraPhone,
  } = req.body;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("Correo", email)
      .input("PasswordHash", password) // consider hashing before saving
      .input("Nombre", name)
      .input("Apellido1", lastName1)
      .input("Apellido2", lastName2 || null)
      .input("FechaNacimiento", birthDate)
      .input("TipoIdentificacionId", idType)
      .input("NumeroIdentificacion", idNumber)
      .input("PaisResidencia", country)
      .input("IdDistrito", district || null)
      .input("Telefono1", phone)
      .input("Telefono2", extraPhone || null)
      .execute("sp_CrearClienteUsuario");

    res.json({ success: true, message: "Usuario creado correctamente" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//crear-usuario empresa
app.post("/registrar-empresa", async (req, res) => {
  const {
    companyType,
    legalId,
    email,
    phone,
    phone2,
    name,
    province,
    canton,
    district,
    neighborhood,
    exactAddress,
    website,
    password,
    amenities,
    location,
  } = req.body;

  // Basic validation
  if (
    !companyType ||
    !legalId ||
    !email ||
    !phone ||
    !name ||
    !district ||
    !exactAddress ||
    !password
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const pool = await getConnection();

    const distritoResult = await pool
      .request()
      .input("province", sql.NVarChar, province)
      .input("canton", sql.NVarChar, canton)
      .input("district", sql.NVarChar, district).query(`
    SELECT d.IdDistrito
    FROM Distritos d
    INNER JOIN Cantones c ON d.IdCanton = c.IdCanton
    INNER JOIN Provincias p ON c.IdProvincia = p.IdProvincia
    WHERE p.Nombre = @province
      AND c.Nombre = @canton
      AND d.Nombre = @district
  `);

    if (distritoResult.recordset.length === 0) {
      return res.status(400).json({ error: "Distrito no encontrado." });
    }

    const idDistrito = distritoResult.recordset[0].IdDistrito;

    await pool
      .request()
      .input("Correo", sql.NVarChar(254), email)
      .input("Password", sql.VarChar(255), password)
      .input("CedulaJuridica", sql.NVarChar(50), legalId)
      .input("NombreEmpresa", sql.NVarChar(200), name)
      .input("TipoEmpresaId", sql.Int, companyType)
      .input("Telefono1", sql.NVarChar(16), phone)
      .input("Telefono2", sql.NVarChar(16), phone2 || null)
      .input("SitioWeb", sql.NVarChar(300), website || null)
      .input("IdDistrito", sql.Int, idDistrito)
      .input("Barrio", sql.NVarChar(100), neighborhood || null)
      .input("SenasExactas", sql.NVarChar(400), exactAddress)
      .input("Latitud", sql.Decimal(9, 6), location?.lat || null)
      .input("Longitud", sql.Decimal(9, 6), location?.lng || null)
      .execute("sp_CrearEmpresaUsuario");

    if (amenities && amenities.length > 0) {
      for (const amenityId of amenities) {
        await pool
          .request()
          .input("CedulaJuridica", sql.NVarChar(50), legalId)
          .input("AmenidadId", sql.Int, amenityId)
          .execute("sp_AmenidadEmpresa_Add");
      }
    }

    res.json({ message: "Empresa registrada correctamente." });
  } catch (err) {
    console.error("ERROR registering company:", err);
    res.status(500).json({ error: err.message });
  }
});

//change-password cliente y empresa
app.post("/change-password", async (req, res) => {
  const { role, id, password } = req.body;

  if (!role || !id || !password) {
    return res.status(400).json({
      message: "Role, id y password son requeridos",
    });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("UniqueId", sql.NVarChar(50), id)
      .input("Rol", sql.NVarChar(20), role)
      .input("PasswordHash", sql.VarChar(255), password)
      .execute("dbo.sp_ActualizarPasswordUsuario");

    return res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error changing password:", error);

    if (error.number) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

//user-profile con reservaciones
app.get("/user-profile/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const pool = await getConnection(); // your mssql connection

    const result = await pool
      .request()
      .input("ClienteId", sql.Int, parseInt(userid)).query(`
        SELECT *
        FROM dbo.fn_ClienteDetalle(@ClienteId)
      `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userData = result.recordset[0];

    // Reservaciones is returned as JSON string by SQL, so parse it
    let bookings = [];
    if (userData.Reservaciones) {
      bookings = JSON.parse(userData.Reservaciones).map((r, index) => ({
        id: r.ReservacionId,
        roomId: r.ReservacionId, // or some room id if available
        name: r.TipoHabitacionNombre || "Reserva",
        date: new Date(r.FechaHoraIngreso).toLocaleDateString("es-CR"),
        reservationNumber: r.ReservacionId,
        nights: r.Noches,
        people: r.CantidadPersonas,
        checkIn: new Date(r.FechaHoraIngreso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        vehicle: r.TieneVehiculo,
        start: new Date(r.FechaHoraIngreso).toLocaleDateString("es-CR", {
          month: "short",
          day: "numeric",
        }),
        end: new Date(r.FechaSalida).toLocaleDateString("es-CR", {
          month: "short",
          day: "numeric",
        }),
        total: r.TotalPagar,
        pricePerNight: r.Noches > 0 ? r.TotalPagar / r.Noches : r.TotalPagar,
      }));
    }

    // Build frontend-friendly user profile
    const userProfile = {
      id: userData.ClienteId,
      name: [userData.Nombre, userData.Apellido1, userData.Apellido2]
        .filter(Boolean) // removes null, undefined, empty string
        .join(" "),
      birthDate: new Date(userData.FechaNacimiento).toLocaleDateString("es-CR"),
      identification: userData.NumeroIdentificacion,
      country: userData.PaisResidencia,
      email: userData.CorreoCliente || userData.CorreoUsuario,
      phone: userData.Telefono1 || userData.Telefono2,
      address: {
        province: userData.Provincia,
        canton: userData.Canton,
        district: userData.DistritoNombre,
        details: "", // add more details if available in DB
      },
    };

    res.json({ userProfile, bookings });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//user-form-autofill para EditUserInfo
app.get("/user-form-autofill/:userid", async (req, res) => {
  const { userid } = req.params;

  if (!userid) {
    return res.status(400).json({ message: "ClienteId is required" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("ClienteId", sql.Int, Number(userid))
      .query(`
        SELECT *
        FROM dbo.fn_ClienteDetalleLite(@ClienteId)
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching cliente:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//clientes-update para EditUserInfo
app.put("/clientes-update/:clienteId", async (req, res) => {
  const clienteId = Number(req.params.clienteId);

  console.log(req.params.clienteId, "Mi pais")

  const {
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
    CorreoContacto,
  } = req.body;

  if (!clienteId) {
    return res.status(400).json({ error: "ClienteId inválido" });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("ClienteId", sql.Int, clienteId)
      .input("Nombre", sql.NVarChar(120), Nombre)
      .input("Apellido1", sql.NVarChar(120), Apellido1)
      .input("Apellido2", sql.NVarChar(120), Apellido2 || null)
      .input("FechaNacimiento", sql.Date, FechaNacimiento)
      .input("TipoIdentificacionId", sql.Int, TipoIdentificacionId)
      .input("NumeroIdentificacion", sql.NVarChar(50), NumeroIdentificacion)
      .input("PaisResidencia", sql.NVarChar(100), PaisResidencia)
      .input(
        "IdDistrito",
        sql.Int,
        IdDistrito ? Number(IdDistrito) : null,
      )
      .input("Telefono1", sql.NVarChar(16), Telefono1)
      .input("Telefono2", sql.NVarChar(16), Telefono2 || null)
      .input("CorreoContacto", sql.NVarChar(254), CorreoContacto)
      .execute("sp_ActualizarCliente");

    // Successful update
    res.sendStatus(204);
  } catch (err) {
    console.error("Error ejecutando sp_ActualizarCliente:", err);

    // SQL THROW 50001 (Cliente no existe)
    if (err.number === 50001) {
      return res.status(404).json({ error: "Cliente no existe" });
    }

    res.status(500).json({ error: "Error actualizando cliente" });
  }
});

app.delete("/api/cliente/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "ClienteId es requerido",
    });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("ClienteId", sql.Int, userId)
      .execute("dbo.sp_EliminarClienteYUsuario");

    // Destroy session (logout)
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({
          message: "Cuenta eliminada, pero no se pudo cerrar la sesión",
        });
      }

      res.clearCookie("sid"); // same cookie name you already use

      return res.json({
        message: "Cuenta eliminada y sesión cerrada correctamente",
      });
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    if (error.number) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});
