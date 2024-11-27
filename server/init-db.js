import sql from 'mssql';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

async function initializeDatabase() {
  try {
    // Create a new connection pool
    const pool = await sql.connect(config);
    console.log('Connected to database');

    // Drop existing Guides table if exists
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='Guides' AND xtype='U')
      DROP TABLE Guides
    `);
    console.log('Dropped existing Guides table');

    // Create Guides table
    await pool.request().query(`
      CREATE TABLE Guides (
        id INT PRIMARY KEY IDENTITY(1,1),
        fullName NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        phone NVARCHAR(20) NOT NULL,
        email NVARCHAR(100) NOT NULL,
        twitter NVARCHAR(200),
        instagram NVARCHAR(200),
        linkedin NVARCHAR(200),
        createdAt DATETIME DEFAULT GETDATE(),
        isActive BIT DEFAULT 1
      )
    `);
    console.log('Created new Guides table');

    // Create a test guide
    await pool.request().query(`
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
        'Test Rehber',
        'Test açıklama',
        '+90 555 555 5555',
        'test@example.com',
        'twitter',
        'instagram',
        'linkedin',
        1,
        GETDATE()
      )
    `);
    console.log('Created test guide');

    // Create Stories table if it doesn't exist
    await pool.request().query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Stories' and xtype='U')
      CREATE TABLE Stories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        excerpt NVARCHAR(MAX) NOT NULL,
        image NVARCHAR(MAX),
        authorName NVARCHAR(100) NOT NULL,
        authorAvatar NVARCHAR(MAX),
        readTime NVARCHAR(50),
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        createdAt DATETIME DEFAULT GETDATE(),
        locationLat FLOAT,
        locationLng FLOAT,
        locationTitle NVARCHAR(255),
        routeStartLat FLOAT,
        routeStartLng FLOAT,
        routeEndLat FLOAT,
        routeEndLng FLOAT
      )
    `;

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    await sql.close();
  }
}

initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});