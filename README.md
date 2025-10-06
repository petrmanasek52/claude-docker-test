# 📝 Full-Stack TODO Application

Moderní full-stack TODO aplikace postavená na Node.js, Express.js, PostgreSQL a Vanilla JavaScript s Tailwind CSS. Projekt demonstruje čistou architekturu, REST API design a responzivní UI.

## ✨ Features

- ✅ **Full REST API** - CRUD operace pro todos
- ✅ **PostgreSQL databáze** - Automatické migrace při startu
- ✅ **Moderní UI** - Tailwind CSS s responzivním designem
- ✅ **Real-time updates** - Okamžitá aktualizace UI po každé akci
- ✅ **Error handling** - Komplexní validace a error zpracování
- ✅ **Docker containerizace** - Jednoduchý deployment
- ✅ **Zero dependencies frontend** - Vanilla JavaScript

## 🎯 Požadavky

- Node.js 16+
- Docker & Docker Compose
- GitHub CLI (gh) - volitelné
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
# 1. Spustit PostgreSQL (automaticky spustí migrace)
docker compose up -d

# 2. Instalovat závislosti
npm install

# 3. Spustit Node.js server
npm run dev
```

**Aplikace běží na http://localhost:3000** 🎉

## 🧪 Testování

### Přes prohlížeč
Otevři http://localhost:3000 a začni používat TODO aplikaci.

### Přes API (curl)

```bash
# Health check
curl http://localhost:3000/health

# Database test
curl http://localhost:3000/api/test

# Získat všechny todos
curl http://localhost:3000/api/todos

# Vytvořit nové todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Můj první úkol"}'

# Přepnout completed status (ID=1)
curl -X PATCH http://localhost:3000/api/todos/1

# Smazat todo (ID=1)
curl -X DELETE http://localhost:3000/api/todos/1
```

## 📚 API Dokumentace

### Základní Endpointy

#### GET /health
Vrací stav serveru.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-06T12:00:00.000Z",
  "service": "claude-docker-test"
}
```

#### GET /api/test
Testuje připojení k PostgreSQL databázi.

**Response:**
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

---

### TODO API Endpointy

#### GET /api/todos
Vrací všechny todos seřazené podle data vytvoření (nejnovější první).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Vyzkoušet TODO aplikaci",
      "completed": false,
      "created_at": "2025-10-06T12:30:00.000Z"
    },
    {
      "id": 1,
      "title": "Přidat první úkol",
      "completed": true,
      "created_at": "2025-10-06T12:00:00.000Z"
    }
  ]
}
```

#### POST /api/todos
Vytvoří nové todo.

**Request Body:**
```json
{
  "title": "Můj nový úkol"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Můj nový úkol",
    "completed": false,
    "created_at": "2025-10-06T12:45:00.000Z"
  }
}
```

**Validace:**
- `title` je povinné pole
- `title` nesmí být prázdný string

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Title is required and cannot be empty"
}
```

#### PATCH /api/todos/:id
Přepne completed status todo (false → true nebo true → false).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Přidat první úkol",
    "completed": true,
    "created_at": "2025-10-06T12:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Todo not found"
}
```

#### DELETE /api/todos/:id
Smaže todo.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "id": 1,
    "title": "Přidat první úkol",
    "completed": true,
    "created_at": "2025-10-06T12:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Todo not found"
}
```

### Error Handling

Všechny endpointy vrací standardní error response v případě chyby:

**Error Response:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

**HTTP Status Codes:**
- `200 OK` - Úspěšná operace
- `201 Created` - Úspěšné vytvoření resource
- `400 Bad Request` - Validační chyba
- `404 Not Found` - Resource nenalezen
- `500 Internal Server Error` - Chyba serveru/databáze

## 🛠 Tech Stack

- **Backend:** Node.js + Express.js + CORS
- **Database:** PostgreSQL 16 (Docker)
- **Frontend:** Vanilla JavaScript + Tailwind CSS (CDN)
- **Containerization:** Docker + Docker Compose
- **Dev Tools:** nodemon, GitHub CLI

## 📁 Struktura projektu

```
claude-docker-test/
├── migrations/
│   └── 001_create_todos.sql    # DB migrace (auto-run při startu)
├── public/
│   ├── index.html              # Frontend UI
│   └── app.js                  # Frontend logika
├── server.js                   # Express server + REST API
├── docker-compose.yml          # PostgreSQL container config
├── package.json                # Node.js dependencies
├── Claude.MD                   # Technická dokumentace
└── README.md                   # Tento soubor
```

## 🗄️ Databázová struktura

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Frontend Features

- 📱 **Responzivní design** - Mobile-first přístup
- ⚡ **Real-time updates** - Okamžitá aktualizace UI
- 🎭 **Loading states** - Vizuální feedback během operací
- ⚠️ **Error handling** - User-friendly error zprávy
- 📊 **Statistiky** - Celkem/Hotovo/Zbývá úkoly
- ✨ **Animace** - Smooth přidání nových todos
- 🛡️ **Potvrzení** - Dialog před smazáním

## 🐛 Troubleshooting

### PostgreSQL migrace se nespustily
```bash
# Smaž existující data a restartuj
docker compose down
rm -rf postgres-data/
docker compose up -d
```

### Port 3000 je obsazený
```bash
# Změň port v .env souboru
echo "PORT=3001" >> .env
npm run dev
```

## 📝 License

MIT

## 👤 Author

Petr Maňásek (@petrmanasek52)

---

**Vytvořeno s ❤️ pomocí [Claude Code](https://claude.com/claude-code)**
