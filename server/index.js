import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// ES Module için __dirname ayarı
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env dosyasını yükle
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://gezirehberim.netlify.app'  // Netlify sitenizin URL'i
    ],
    credentials: true
}));
app.use(express.json());

// SQL Server Bağlantı Konfigürasyonu
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Database connection pool
const pool = new sql.ConnectionPool(config);

// Connect to database
let dbConnected = false;

pool.connect().then(() => {
  console.log('Connected to MSSQL successfully');
  dbConnected = true;
}).catch(err => {
  console.error('Database connection failed:', err);
  dbConnected = false;
});

// Middleware to check database connection
app.use((req, res, next) => {
  if (!dbConnected) {
    console.error('Database connection is not established');
    return res.status(500).json({ error: 'Veritabanı bağlantısı kurulamadı' });
  }
  next();
});

// API Routes
app.get('/api/stories', async (req, res) => {
  try {
    console.log('Starting story fetching...');
    const result = await pool.request()
      .query(`
        SELECT 
          id,
          title,
          excerpt,
          image,
          authorName,
          authorAvatar,
          readTime,
          likes,
          comments,
          createdAt,
          locationLat,
          locationLng,
          locationTitle,
          routeStartLat,
          routeStartLng,
          routeEndLat,
          routeEndLng
        FROM Stories
        ORDER BY createdAt DESC
      `);

    console.log('SQL query executed successfully, result:', result);
    // Transform the data to match frontend expectations
    const stories = result.recordset.map(story => ({
      id: story.id,
      title: story.title,
      excerpt: story.excerpt,
      image: story.image,
      author: {
        name: story.authorName,
        avatar: story.authorAvatar
      },
      readTime: story.readTime,
      likes: story.likes,
      comments: story.comments,
      createdAt: story.createdAt,
      ...(story.locationLat && story.locationLng && {
        location: {
          lat: story.locationLat,
          lng: story.locationLng,
          title: story.locationTitle
        }
      }),
      ...(story.routeStartLat && story.routeStartLng && story.routeEndLat && story.routeEndLng && {
        route: {
          start: [story.routeStartLat, story.routeStartLng],
          end: [story.routeEndLat, story.routeEndLng]
        }
      })
    }));

    res.json(stories);
  } catch (err) {
    console.error('Detailed error in story fetching:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Hikayeler alınırken bir hata oluştu',
      details: err.message 
    });
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    console.log('Starting story fetching by id...');
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          id,
          title,
          excerpt,
          image,
          authorName,
          authorAvatar,
          readTime,
          likes,
          comments,
          createdAt,
          locationLat,
          locationLng,
          locationTitle,
          routeStartLat,
          routeStartLng,
          routeEndLat,
          routeEndLng
        FROM Stories
        WHERE id = @id
      `);

    console.log('SQL query executed successfully, result:', result);
    if (result.recordset.length === 0) {
      console.log('Story not found');
      return res.status(404).json({ error: 'Hikaye bulunamadı' });
    }

    const story = result.recordset[0];
    res.json({
      id: story.id,
      title: story.title,
      excerpt: story.excerpt,
      image: story.image,
      author: {
        name: story.authorName,
        avatar: story.authorAvatar
      },
      readTime: story.readTime,
      likes: story.likes,
      comments: story.comments,
      createdAt: story.createdAt,
      ...(story.locationLat && story.locationLng && {
        location: {
          lat: story.locationLat,
          lng: story.locationLng,
          title: story.locationTitle
        }
      }),
      ...(story.routeStartLat && story.routeStartLng && story.routeEndLat && story.routeEndLng && {
        route: {
          start: [story.routeStartLat, story.routeStartLng],
          end: [story.routeEndLat, story.routeEndLng]
        }
      })
    });
  } catch (err) {
    console.error('Detailed error in story fetching by id:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Hikaye alınırken bir hata oluştu',
      details: err.message 
    });
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    console.log('Starting story creation...');
    const { 
      title, 
      excerpt, 
      image, 
      author, 
      readTime,
      location,
      route
    } = req.body;

    console.log('Received story data:', {
      title,
      excerpt,
      image,
      author,
      readTime,
      location,
      route
    });

    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('excerpt', sql.NVarChar, excerpt)
      .input('image', sql.NVarChar, image)
      .input('authorName', sql.NVarChar, author.name)
      .input('authorAvatar', sql.NVarChar, author.avatar)
      .input('readTime', sql.Int, readTime)
      .input('locationLat', sql.Float, location?.lat || null)
      .input('locationLng', sql.Float, location?.lng || null)
      .input('locationTitle', sql.NVarChar, location?.title || null)
      .input('routeStartLat', sql.Float, route?.start?.[0] || null)
      .input('routeStartLng', sql.Float, route?.start?.[1] || null)
      .input('routeEndLat', sql.Float, route?.end?.[0] || null)
      .input('routeEndLng', sql.Float, route?.end?.[1] || null)
      .query(`
        INSERT INTO Stories (
          title,
          excerpt,
          image,
          authorName,
          authorAvatar,
          readTime,
          likes,
          comments,
          createdAt,
          locationLat,
          locationLng,
          locationTitle,
          routeStartLat,
          routeStartLng,
          routeEndLat,
          routeEndLng
        )
        VALUES (
          @title,
          @excerpt,
          @image,
          @authorName,
          @authorAvatar,
          @readTime,
          0,
          0,
          GETDATE(),
          @locationLat,
          @locationLng,
          @locationTitle,
          @routeStartLat,
          @routeStartLng,
          @routeEndLat,
          @routeEndLng
        );
        
        SELECT SCOPE_IDENTITY() as id;
      `);
    
    console.log('SQL query executed successfully, result:', result);
    const id = result.recordset[0].id;
    res.status(201).json({
      id,
      title,
      excerpt,
      image,
      author,
      readTime,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      location,
      route
    });
  } catch (err) {
    console.error('Detailed error in story creation:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Hikaye oluşturulurken bir hata oluştu',
      details: err.message 
    });
  }
});

app.put('/api/stories/:id', async (req, res) => {
  try {
    console.log('Starting story update...');
    const { 
      title, 
      excerpt, 
      image, 
      author, 
      readTime,
      location,
      route
    } = req.body;

    console.log('Received story data:', {
      title,
      excerpt,
      image,
      author,
      readTime,
      location,
      route
    });

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.NVarChar, title)
      .input('excerpt', sql.NVarChar, excerpt)
      .input('image', sql.NVarChar, image)
      .input('authorName', sql.NVarChar, author.name)
      .input('authorAvatar', sql.NVarChar, author.avatar)
      .input('readTime', sql.Int, readTime)
      .input('locationLat', sql.Float, location?.lat || null)
      .input('locationLng', sql.Float, location?.lng || null)
      .input('locationTitle', sql.NVarChar, location?.title || null)
      .input('routeStartLat', sql.Float, route?.start?.[0] || null)
      .input('routeStartLng', sql.Float, route?.start?.[1] || null)
      .input('routeEndLat', sql.Float, route?.end?.[0] || null)
      .input('routeEndLng', sql.Float, route?.end?.[1] || null)
      .query(`
        UPDATE Stories
        SET
          title = @title,
          excerpt = @excerpt,
          image = @image,
          authorName = @authorName,
          authorAvatar = @authorAvatar,
          readTime = @readTime,
          locationLat = @locationLat,
          locationLng = @locationLng,
          locationTitle = @locationTitle,
          routeStartLat = @routeStartLat,
          routeStartLng = @routeStartLng,
          routeEndLat = @routeEndLat,
          routeEndLng = @routeEndLng
        WHERE id = @id
      `);
    console.log('SQL query executed successfully');
    res.json({ message: 'Hikaye başarıyla güncellendi' });
  } catch (err) {
    console.error('Detailed error in story update:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Hikaye güncellenirken bir hata oluştu',
      details: err.message 
    });
  }
});

app.delete('/api/stories/:id', async (req, res) => {
  try {
    console.log('Starting story deletion...');
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Stories WHERE id = @id');
    console.log('SQL query executed successfully');
    res.json({ message: 'Hikaye başarıyla silindi' });
  } catch (err) {
    console.error('Detailed error in story deletion:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Hikaye silinirken bir hata oluştu',
      details: err.message 
    });
  }
});

// Guides endpoints
app.get('/api/guides', async (req, res) => {
  try {
    console.log('Starting guides fetching...');
    const result = await pool.request()
      .query('SELECT * FROM Guides WHERE isActive = 1 ORDER BY createdAt DESC');
    console.log('SQL query executed successfully, result:', result);
    res.json(result.recordset);
  } catch (err) {
    console.error('Detailed error in guides fetching:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Rehberler alınırken bir hata oluştu',
      details: err.message 
    });
  }
});

app.post('/api/guides', async (req, res) => {
  try {
    console.log('Starting guide creation...');
    const { 
      fullName, 
      description, 
      phone, 
      email, 
      twitter, 
      instagram, 
      linkedin 
    } = req.body;

    console.log('Received guide data:', {
      fullName,
      description,
      phone,
      email,
      twitter,
      instagram,
      linkedin
    });

    // Validate required fields
    if (!fullName || !phone || !email) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Zorunlu alanlar eksik',
        details: {
          fullName: !fullName ? 'Ad Soyad gerekli' : null,
          phone: !phone ? 'Telefon gerekli' : null,
          email: !email ? 'Email gerekli' : null
        }
      });
    }
    
    const request = pool.request();

    // Add inputs
    request
      .input('fullName', sql.NVarChar, fullName)
      .input('description', sql.NVarChar, description || '')
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .input('twitter', sql.NVarChar, twitter || '')
      .input('instagram', sql.NVarChar, instagram || '')
      .input('linkedin', sql.NVarChar, linkedin || '');

    console.log('Executing SQL query...');
    const result = await request.query(`
      INSERT INTO Guides (
        fullName, 
        description, 
        phone, 
        email, 
        twitter, 
        instagram, 
        linkedin,
        isActive,
        createdAt
      )
      VALUES (
        @fullName, 
        @description, 
        @phone, 
        @email, 
        @twitter, 
        @instagram, 
        @linkedin,
        1,
        GETDATE()
      );
      SELECT SCOPE_IDENTITY() AS id;
    `);

    console.log('SQL query executed successfully, result:', result);
    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error('Detailed error in guide creation:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Rehber oluşturulurken bir hata oluştu',
      details: err.message 
    });
  }
});

app.put('/api/guides/:id', async (req, res) => {
  try {
    console.log('Starting guide update...');
    const { id } = req.params;
    const { 
      fullName, 
      description, 
      phone, 
      email, 
      twitter, 
      instagram, 
      linkedin 
    } = req.body;
    
    console.log('Received guide data:', {
      fullName,
      description,
      phone,
      email,
      twitter,
      instagram,
      linkedin
    });

    await pool.request()
      .input('id', sql.Int, id)
      .input('fullName', sql.NVarChar, fullName)
      .input('description', sql.NVarChar, description || '')
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .input('twitter', sql.NVarChar, twitter || '')
      .input('instagram', sql.NVarChar, instagram || '')
      .input('linkedin', sql.NVarChar, linkedin || '')
      .query(`
        UPDATE Guides 
        SET fullName = @fullName,
            description = @description,
            phone = @phone,
            email = @email,
            twitter = @twitter,
            instagram = @instagram,
            linkedin = @linkedin
        WHERE id = @id
      `);
    
    console.log('SQL query executed successfully');
    res.json({ message: 'Rehber başarıyla güncellendi' });
  } catch (err) {
    console.error('Detailed error in guide update:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Rehber güncellenirken bir hata oluştu',
      details: err.message 
    });
  }
});

app.delete('/api/guides/:id', async (req, res) => {
  try {
    console.log('Starting guide deletion...');
    const { id } = req.params;
    
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Guides SET isActive = 0 WHERE id = @id');
    
    console.log('SQL query executed successfully');
    res.json({ message: 'Rehber başarıyla silindi' });
  } catch (err) {
    console.error('Detailed error in guide deletion:', err);
    console.error('Error stack:', err.stack);
    
    // Check for specific SQL errors
    if (err instanceof sql.RequestError) {
      console.error('SQL Request Error:', err.message);
      return res.status(500).json({
        error: 'Veritabanı işlemi başarısız oldu',
        details: err.message,
        code: err.code
      });
    }

    res.status(500).json({ 
      error: 'Rehber silinirken bir hata oluştu',
      details: err.message 
    });
  }
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
  console.log('Ortam değişkenleri:', {
    DB_SERVER: process.env.DB_SERVER ? 'SET' : 'NOT SET',
    DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
    DB_PORT: process.env.DB_PORT ? 'SET' : 'NOT SET',
    DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET'
  });
});

// Ortam değişkenlerini kontrol etmek için log ekleyin
console.log('Database Config:', {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // Güvenlik için password'ü loglama
    user: process.env.DB_USER
});
