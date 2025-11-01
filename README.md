# Claude Docker Test Project - Full-Stack TODO App

Modern full-stack TODO application built with Node.js, Express, PostgreSQL, and Vanilla JavaScript. Features a clean REST API and responsive UI with Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Start PostgreSQL
docker compose up -d

# 4. Start development server
npm run dev

# 5. Open in browser
# Visit: http://localhost:3000
```

## Features

- ✅ Create, read, update, and delete TODO items
- ✅ Mark TODOs as completed/incomplete
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time UI updates
- ✅ Loading states and error handling
- ✅ PostgreSQL database with migrations
- ✅ RESTful API architecture

## API Reference

### Health Check
```bash
GET /health
```
Returns server status and uptime.

### Get All TODOs
```bash
GET /api/todos
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My first TODO",
      "completed": false,
      "created_at": "2025-11-01T12:00:00.000Z"
    }
  ]
}
```

### Create TODO
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Buy groceries",
    "completed": false,
    "created_at": "2025-11-01T12:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

**Validation:**
- `title` is required and cannot be empty
- Returns `400` if validation fails

### Toggle TODO Completion
```bash
PATCH /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My first TODO",
    "completed": true,
    "created_at": "2025-11-01T12:00:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - TODO not found
- `500` - Database error

### Delete TODO
```bash
DELETE /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My first TODO",
    "completed": false,
    "created_at": "2025-11-01T12:00:00.000Z"
  },
  "message": "Todo deleted successfully"
}
```

**Error Responses:**
- `400` - Invalid ID
- `404` - TODO not found
- `500` - Database error

## Project Structure

```
.
├── Claude.MD              # Detailed technical documentation
├── README.md              # This file
├── docker-compose.yml     # Docker services configuration
├── package.json           # Node.js dependencies
├── server.js              # Express API server
├── public/                # Frontend files
│   ├── index.html         # Main HTML with Tailwind CSS
│   └── app.js             # JavaScript (CRUD operations)
├── migrations/            # Database migrations
│   └── 001_create_todos.sql
├── .env.example           # Environment variables template
└── .gitignore            # Git ignore rules
```

## Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL 16
- pg (node-postgres)

**Frontend:**
- Vanilla JavaScript (no frameworks)
- Tailwind CSS (CDN)
- Fetch API

**DevOps:**
- Docker & Docker Compose
- Automated database migrations

## Requirements

- Node.js 18+
- Docker & Docker Compose
- GitHub CLI (gh)

## Troubleshooting

If you encounter issues, check:

1. Docker is running: `docker ps`
2. PostgreSQL is healthy: `docker compose ps`
3. Environment variables are set: `cat .env`
4. Port 3000 and 5432 are not in use

For detailed documentation, see [Claude.MD](Claude.MD).

## Author

Petr Maňásek - petrmanasek52@gmail.com

## License

MIT
