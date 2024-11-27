import sql from 'mssql';

const config = {
  user: 'HamzaSQL',
  password: '19@kSG5YvFV_H7hX',
  server: '194.105.5.193',
  database: 'React-Gezi-Rehberi',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function getDbConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

export async function closeDbConnection() {
  try {
    await sql.close();
  } catch (err) {
    console.error('Error closing database connection:', err);
    throw err;
  }
}
