const sql = require('mssql');

exports.handler = async (event, context) => {
  // CORS ayarları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Ortam değişkeni kontrolü
  const requiredVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME', 'DB_PORT'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.error('Eksik ortam değişkenleri:', missingVars);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Konfigürasyon Hatası', 
        details: `Eksik değişkenler: ${missingVars.join(', ')}` 
      })
    };
  }

  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };

  try {
    console.log('Veritabanı bağlantısı başlatılıyor...');
    
    await sql.connect(config);
    console.log('Veritabanı bağlantısı kuruldu');

    const result = await sql.query`
      SELECT 
        id, 
        fullName, 
        description, 
        phone, 
        email, 
        twitter, 
        instagram, 
        linkedin, 
        isActive, 
        createdAt 
      FROM Guides 
      WHERE isActive = 1
    `;

    console.log(`Toplam ${result.recordset.length} rehber bulundu`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.recordset)
    };
  } catch (err) {
    console.error('Veritabanı Hatası:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Veritabanı Bağlantı Hatası', 
        details: err.message 
      })
    };
  } finally {
    try {
      await sql.close();
    } catch {}
  }
};
