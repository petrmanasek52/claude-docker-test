# Claude Docker Test

Testovací projekt pro nastavení vývojového prostředí s Docker, Node.js, PostgreSQL a GitHub CLI.

## 🎯 Požadavky

- Node.js 16+
- Docker & Docker Compose
- GitHub CLI (gh)
- Git

## 📦 Instalace

```bash
# Clone repository
git clone https://github.com/petrmanasek52/claude-docker-test.git
cd claude-docker-test

# Instalace závislostí
npm install

# Kopírování environment variables
cp .env.example .env
```

## 🚀 Spuštění

```bash
# 1. Spustit PostgreSQL
docker compose up -d

# 2. Spustit Node.js server
npm run dev
```

Server běží na **http://localhost:3000**

## 🧪 Testování

```bash
# Health check
curl http://localhost:3000/health

# Database test
curl http://localhost:3000/api/test
```

## 📚 API Dokumentace

### GET /health
Vrací stav serveru.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-06T12:00:00.000Z",
  "service": "claude-docker-test"
}
```

### GET /api/test
Testuje připojení k PostgreSQL databázi.

**Response (úspěch):**
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "current_time": "2025-10-06T12:00:00.000Z",
    "pg_version": "PostgreSQL 16.x..."
  }
}
```

**Response (chyba):**
```json
{
  "success": false,
  "message": "Database connection failed",
  "error": "Connection refused"
}
```

## 🛠 Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose
- **Dev Tools:** nodemon, GitHub CLI

## 📝 License

MIT

## 👤 Author

Petr Maňásek (@petrmanasek52)
