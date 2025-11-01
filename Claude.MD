# Claude Docker Test Project

## Popis projektu

Full-stack TODO aplikace s následujícími komponentami:
- **Docker** pro kontejnerizaci služeb
- **PostgreSQL 16** jako databázový systém
- **Node.js + Express** jako aplikační server s REST API
- **Vanilla JavaScript** frontend s Tailwind CSS
- **GitHub CLI** pro správu repozitáře

---

## Tech Stack

### Backend
- Node.js (v18+)
- Express.js (web framework)
- pg (PostgreSQL client)
- nodemon (development server)

### Frontend
- Vanilla JavaScript (žádné frameworky)
- Tailwind CSS (z CDN)
- Fetch API pro komunikaci s backendem

### Database
- PostgreSQL 16 (latest stable)

### DevOps
- Docker & Docker Compose
- GitHub CLI (gh)

---

## Architektura

```
Frontend (public/) → Express Server (Port 3000) → PostgreSQL Container (Port 5432)
```

### REST API Endpointy:

**Health Check:**
- `GET /health` - Kontrola stavu serveru

**TODO API:**
- `GET /api/todos` - Vrátí všechny TODO items seřazené podle created_at DESC
- `POST /api/todos` - Vytvoří nové TODO (body: `{title: string}`)
- `PATCH /api/todos/:id` - Přepne completed status TODO
- `DELETE /api/todos/:id` - Smaže TODO

**API Response Format:**
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Optional message"
}
```

### Frontend Struktura:
- `public/index.html` - Hlavní HTML s Tailwind CSS
- `public/app.js` - JavaScript logika (CRUD operace, state management)

---

## Jak spustit

### 1. Prerekvizity
```bash
docker --version
docker compose version
node --version
npm --version
gh --version
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Konfigurace prostředí
```bash
cp .env.example .env
```

### 4. Spuštění databáze
```bash
docker compose up -d
docker compose ps
```

### 5. Spuštění aplikace
```bash
npm run dev
```

### 6. Otevřít aplikaci v prohlížeči
```
http://localhost:3000
```

### 7. Test API endpointů (volitelné)
```bash
# Health check
curl http://localhost:3000/health

# Získat všechny TODO items
curl http://localhost:3000/api/todos

# Vytvořit nové TODO
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Moje nové TODO"}'

# Přepnout completed status
curl -X PATCH http://localhost:3000/api/todos/1

# Smazat TODO
curl -X DELETE http://localhost:3000/api/todos/1
```

---

## Příkazy a Troubleshooting

### Docker příkazy
```bash
# Start služeb
docker compose up -d

# Stop služeb
docker compose down

# Restart služeb
docker compose restart

# Zobrazení logů
docker compose logs -f

# Vyčištění dat
docker compose down -v
```

### Databázové příkazy
```bash
# Přímé připojení
docker compose exec postgres psql -U testuser -d testdb

# Export databáze
docker compose exec postgres pg_dump -U testuser testdb > backup.sql

# Import databáze
docker compose exec -T postgres psql -U testuser testdb < backup.sql
```

### Časté problémy

**1. Port 5432 already in use**
```bash
sudo lsof -i :5432
# Nebo změňte port v docker-compose.yml
```

**2. Connection refused**
```bash
docker compose ps
docker compose restart postgres
docker compose exec postgres pg_isready -U testuser
```

**3. Node.js nepřipojí k databázi**
- Zkontrolujte .env konfiguraci
- Z hosta použijte: localhost
- Z Docker kontejneru: postgres

---

## Environment Variables

| Proměnná        | Výchozí hodnota | Popis                    |
|-----------------|-----------------|--------------------------|
| DB_HOST         | localhost       | PostgreSQL host          |
| DB_PORT         | 5432            | PostgreSQL port          |
| DB_USER         | testuser        | Databázový uživatel      |
| DB_PASSWORD     | testpass        | Databázové heslo         |
| DB_NAME         | testdb          | Název databáze           |
| PORT            | 3000            | Port Express serveru     |

---

## Autor

Petr Maňásek (petrmanasek52@gmail.com)

## Licence

MIT License
