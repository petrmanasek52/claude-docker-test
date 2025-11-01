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
app.use(express.static('public')); // Serve static files from public directory

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

// TODO API Endpoints

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM todos ORDER BY created_at DESC');

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// POST /api/todos - Create new todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  let client;

  // Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty'
    });
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Todo created successfully'
    });

  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// PATCH /api/todos/:id - Toggle completed status
app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  let client;

  // Validation
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Valid todo ID is required'
    });
  }

  try {
    client = await pool.connect();

    // Toggle the completed status
    const result = await client.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Todo updated successfully'
    });

  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  let client;

  // Validation
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Valid todo ID is required'
    });
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Todo deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    });

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
    available_endpoints: [
      'GET /health',
      'GET /api/todos',
      'POST /api/todos',
      'PATCH /api/todos/:id',
      'DELETE /api/todos/:id'
    ]
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
  console.log('='.repeat(60));
  console.log('TODO App Server is running on http://localhost:' + PORT);
  console.log('='.repeat(60));
  console.log('Available endpoints:');
  console.log('  GET    http://localhost:' + PORT + '/health');
  console.log('  GET    http://localhost:' + PORT + '/api/todos');
  console.log('  POST   http://localhost:' + PORT + '/api/todos');
  console.log('  PATCH  http://localhost:' + PORT + '/api/todos/:id');
  console.log('  DELETE http://localhost:' + PORT + '/api/todos/:id');
  console.log('='.repeat(60));
  console.log('Frontend: http://localhost:' + PORT);
  console.log('='.repeat(60));
});
