# Claude.MD - Dokumentace projektu

## 📋 Popis projektu
Full-stack TODO aplikace postavená na Node.js, Express.js, PostgreSQL a Vanilla JavaScript. Projekt demonstruje moderní web development s Docker containerizací a čistým, responzivním UI designem.

## 🛠 Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL 16 (Docker container)
- **Frontend:** Vanilla JavaScript + Tailwind CSS (CDN)
- **Tools:** Docker, Docker Compose, GitHub CLI
- **Package Manager:** npm

## 🏗 Architektura

```
┌─────────────────────────────────────────┐
│         Browser (Client)                │
│   HTML + Tailwind CSS + Vanilla JS     │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
                 │
┌────────────────▼────────────────────────┐
│       Express Server (Backend)          │  Port 3000
│   - REST API Endpoints                  │
│   - Static File Serving                 │
│   - CORS Middleware                     │
└────────────────┬────────────────────────┘
                 │ TCP/IP (pg driver)
                 │
┌────────────────▼────────────────────────┐
│       PostgreSQL Database               │  Port 5432
│   - todos table                         │  (Docker)
│   - Auto migrations on startup          │
└─────────────────────────────────────────┘
```

## 🚀 Jak spustit

### 1. Spuštění PostgreSQL
```bash
docker compose up -d
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spuštění serveru
```bash
npm run dev
```

## 📡 API Endpointy

### Základní endpointy
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/` | GET | Uvítací zpráva a seznam endpointů |
| `/health` | GET | Health check serveru |
| `/api/test` | GET | Test DB připojení |

### TODO API
| Endpoint | Metoda | Popis | Request Body | Response |
|----------|--------|-------|--------------|----------|
| `/api/todos` | GET | Získat všechny todos | - | `{success: boolean, data: Todo[]}` |
| `/api/todos` | POST | Vytvořit nové todo | `{title: string}` | `{success: boolean, data: Todo}` |
| `/api/todos/:id` | PATCH | Přepnout completed status | - | `{success: boolean, data: Todo}` |
| `/api/todos/:id` | DELETE | Smazat todo | - | `{success: boolean, message: string}` |

**Todo objekt:**
```json
{
  "id": 1,
  "title": "Vyzkoušet TODO aplikaci",
  "completed": false,
  "created_at": "2025-10-06T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (optional)"
}
```

## 🔧 Příkazy

### Docker
```bash
docker compose up -d          # Spustit services
docker compose down           # Zastavit services
docker compose logs postgres  # Zobrazit logy
docker ps                     # Seznam běžících kontejnerů
```

### GitHub CLI
```bash
gh repo view --web           # Otevřít repo v browseru
gh repo list                 # Seznam repozitářů
gh auth status               # Status autentizace
```

## 🐛 Troubleshooting

### PostgreSQL se nepřipojí
```bash
docker compose logs postgres
docker compose restart postgres
```

### Port 5432 je obsazený
```bash
sudo lsof -i :5432
docker compose down
```

### Node.js dependency chyby
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

Vytvořte `.env` soubor podle `.env.example`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=testdb
PORT=3000
```

## 🗄️ Databáze

### Struktura tabulky `todos`
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Automatické migrace
SQL migrace v složce `migrations/` se automaticky spustí při prvním startu PostgreSQL containeru díky volume mappingu v `docker-compose.yml`.

## 🎨 Frontend

### Struktura
```
public/
├── index.html  - HTML struktura s Tailwind CSS
└── app.js      - Vanilla JavaScript logika
```

### Features
- ✅ Responzivní design (mobile-first)
- ✅ Real-time aktualizace UI
- ✅ Loading states
- ✅ Error handling s automatickým skrytím
- ✅ Prázdný stát když nejsou žádné todos
- ✅ Statistiky (celkem/hotovo/zbývá)
- ✅ Animace při přidání todo
- ✅ Potvrzení před smazáním
