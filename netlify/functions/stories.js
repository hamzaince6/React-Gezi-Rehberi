const sql = require('mssql');

// Detaylı bağlantı konfigürasyonu
const getConfig = () => {
  // Tüm ortam değişkenlerini konsola yazdır
  console.log('Tüm Ortam Değişkenleri:', {
    DB_USER: process.env.DB_USER,
    DB_SERVER: process.env.DB_SERVER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    // Şifreyi güvenlik için kısmen gizle
    DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'NOT SET'
  });

  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    options: {
      encrypt: true, // Azure SQL için gerekli
      trustServerCertificate: false,
      connectTimeout: 60000, // 1 dakika
      requestTimeout: 60000,  // 1 dakika
      // Azure için ek güvenlik ayarları
      authentication: {
        type: 'default'
      }
    }
  };
};

exports.handler = async (event, context) => {
  // CORS ve hata yakalama ayarları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS isteği kontrolü
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Zorunlu ortam değişkenleri kontrolü
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
    
    // Bağlantı parametrelerini güvenli bir şekilde konsola yazdır
    console.log('Bağlantı Parametreleri:', {
      server: config.server,
      database: config.database,
      port: config.port,
      user: config.user ? '***' : 'Kullanıcı Yok'
    });

    await sql.connect(config);
    console.log('Veritabanı bağlantısı kuruldu');

    // Tablo şemasını kontrol et (hata ayıklama için)
    const schemaQuery = `
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'TravelStories'
    `;
    
    const schemaResult = await sql.query(schemaQuery);
    console.log('Tablo Şeması:', schemaResult.recordset);

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
    // Detaylı hata günlüğü
    console.error('Veritabanı Bağlantı Hatası:', {
      message: err.message,
      name: err.name,
      code: err.code,
      number: err.number,
      sqlState: err.state,
      sqlClass: err.class
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Veritabanı Bağlantı Hatası', 
        details: err.message,
        debugInfo: {
          name: err.name,
          code: err.code,
          number: err.number
        }
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
