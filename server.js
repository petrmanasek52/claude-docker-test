require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'testuser',
  password: process.env.DB_PASSWORD || 'testpass',
  database: process.env.DB_NAME || 'testdb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log('[' + now + '] ' + req.method + ' ' + req.path);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection test endpoint
app.get('/api/test', async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');

    res.json({
      message: 'Database connected successfully',
      time: result.rows[0].current_time,
      postgresql_version: result.rows[0].pg_version,
      connection_info: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'testdb',
        user: process.env.DB_USER || 'testuser'
      }
    });

  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      code: error.code,
      hint: 'Make sure PostgreSQL is running: docker compose up -d'
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// Create a test table and insert data
app.post('/api/init', async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    await client.query('CREATE TABLE IF NOT EXISTS test_messages (id SERIAL PRIMARY KEY, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    await client.query("INSERT INTO test_messages (message) VALUES ('Hello from Claude Docker Test!')");

    res.json({
      message: 'Database initialized successfully',
      table_created: 'test_messages'
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      error: 'Database initialization failed',
      message: error.message
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// Get all messages from test table
app.get('/api/messages', async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM test_messages ORDER BY created_at DESC');

    res.json({
      count: result.rows.length,
      messages: result.rows
    });

  } catch (error) {
    console.error('Query error:', error);
    if (error.code === '42P01') {
      res.status(404).json({
        error: 'Table not found',
        message: 'Run POST /api/init to create the test table first',
        code: error.code
      });
    } else {
      res.status(500).json({
        error: 'Query failed',
        message: error.message
      });
    }

  } finally {
    if (client) {
      client.release();
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    available_endpoints: ['GET /health', 'GET /api/test', 'POST /api/init', 'GET /api/messages']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing HTTP server and database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing HTTP server and database pool...');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('=' * 60);
  console.log('Server is running on http://localhost:' + PORT);
  console.log('=' * 60);
  console.log('Available endpoints:');
  console.log('  GET  http://localhost:' + PORT + '/health');
  console.log('  GET  http://localhost:' + PORT + '/api/test');
  console.log('  POST http://localhost:' + PORT + '/api/init');
  console.log('  GET  http://localhost:' + PORT + '/api/messages');
  console.log('=' * 60);
});
