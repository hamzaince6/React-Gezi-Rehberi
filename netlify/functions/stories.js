const sql = require('mssql');

// Bağlantı konfigürasyonunu dışarı çıkaralım
const getConfig = () => ({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
});

exports.handler = async (event, context) => {
  // CORS ayarları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS isteğine yanıt
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

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

  try {
    console.log('Veritabanı bağlantısı başlatılıyor...');
    const config = getConfig();
    
    await sql.connect(config);
    console.log('Veritabanı bağlantısı kuruldu');

    const result = await sql.query`
      SELECT TOP 50
        id, 
        title, 
        content, 
        author, 
        location, 
        imageUrl, 
        createdAt 
      FROM TravelStories 
      ORDER BY createdAt DESC
    `;

    console.log(`Toplam ${result.recordset.length} hikaye bulundu`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.recordset)
    };
  } catch (err) {
    console.error('Veritabanı Hatası:', {
      message: err.message,
      name: err.name,
      code: err.code,
      number: err.number,
      details: err
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Veritabanı Bağlantı Hatası', 
        details: err.message,
        fullError: JSON.stringify(err)
      })
    };
  } finally {
    try {
      await sql.close();
      console.log('Veritabanı bağlantısı kapatıldı');
    } catch (closeErr) {
      console.error('Veritabanı Bağlantı Kapatma Hatası:', closeErr);
    }
  }
};
