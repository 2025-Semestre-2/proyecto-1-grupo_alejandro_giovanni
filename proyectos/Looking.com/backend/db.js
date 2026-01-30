import sql from "mssql";

const config = {
    user: 'LookingUser',
    password: 'StrongPassword123!',
    server: 'localhost',          // or 'localhost\\SQLEXPRESS'
    database: 'LookingDB',
    options: {
        encrypt: true,            // SQL Server requires this
        trustServerCertificate: true // trust self-signed cert
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;

export const getConnection = async () => {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("✅ DB Connected via LocalDB Named Pipe using Windows Auth");
  }
  return pool;
};

export { sql };