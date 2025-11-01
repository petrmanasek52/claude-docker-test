# Claude Docker Test Project

Simple test project to verify your development environment setup with Docker, Node.js, PostgreSQL, and GitHub CLI.

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

# 5. Test the application
curl http://localhost:3000/health
curl http://localhost:3000/api/test
```

## Available Endpoints

- `GET /health` - Health check
- `GET /api/test` - Test database connection
- `POST /api/init` - Initialize test table
- `GET /api/messages` - Get all messages from test table

## Project Structure

```
.
├── Claude.MD              # Detailed technical documentation
├── README.md              # This file
├── docker-compose.yml     # Docker services configuration
├── package.json           # Node.js dependencies
├── server.js              # Express application
├── .env.example           # Environment variables template
└── .gitignore            # Git ignore rules
```

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
