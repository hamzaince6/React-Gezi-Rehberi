const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

exports.handler = async (event, context) => {
  // CORS ayarları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Preflight requestlerini handle etme
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Stories`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.recordset)
    };
  } catch (err) {
    console.error('Database Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database Connection Error', 
        details: err.message 
      })
    };
  } finally {
    try {
      await sql.close();
    } catch {}
  }
};
