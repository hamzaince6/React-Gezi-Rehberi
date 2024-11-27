const sql = require('mssql');

exports.handler = async (event, context) => {
  // Detaylı hata ayıklama için konsol logları
  console.log('Stories Function Triggered');
  console.log('Environment Variables:', {
    DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
    DB_SERVER: process.env.DB_SERVER ? 'SET' : 'NOT SET',
    DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
    DB_PORT: process.env.DB_PORT ? 'SET' : 'NOT SET'
  });

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
      trustServerCertificate: false,
      // Detaylı bağlantı ayarları
      connectTimeout: 30000,
      requestTimeout: 30000,
      debug: {
        packet: true,
        data: true,
        payload: true,
        log: true
      }
    },
    // Azure için ek kimlik doğrulama ayarları
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    }
  };

  try {
    console.log('Veritabanı bağlantısı başlatılıyor...');
    console.log('Bağlantı Parametreleri:', {
      server: config.server,
      database: config.database,
      port: config.port
    });
    
    await sql.connect(config);
    console.log('Veritabanı bağlantısı kuruldu');

    // Hata ayıklama için tablo şemasını kontrol etme
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
      SELECT 
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
    console.log('İlk Hikaye:', result.recordset[0] || 'Hikaye yok');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.recordset)
    };
  } catch (err) {
    // Detaylı hata günlüğü
    console.error('Veritabanı Hatası:', {
      message: err.message,
      name: err.name,
      code: err.code,
      number: err.number,
      state: err.state,
      class: err.class,
      serverName: err.serverName,
      procName: err.procName,
      originalError: err.originalError ? err.originalError.message : 'Orijinal hata yok'
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
