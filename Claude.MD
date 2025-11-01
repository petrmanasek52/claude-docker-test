# Claude Docker Test Project

## Popis projektu

Testovací projekt pro ověření vývojového prostředí s následujícími komponentami:
- **Docker** pro kontejnerizaci služeb
- **PostgreSQL 16** jako databázový systém
- **Node.js + Express** jako aplikační server
- **GitHub CLI** pro správu repozitáře

---

## Tech Stack

### Backend
- Node.js (v18+)
- Express.js (web framework)
- pg (PostgreSQL client)
- nodemon (development server)

### Database
- PostgreSQL 16 (latest stable)

### DevOps
- Docker & Docker Compose
- GitHub CLI (gh)

---

## Architektura

Express Server (Port 3000) → PostgreSQL Container (Port 5432)

Endpointy:
- GET /health - health check
- GET /api/test - test databázového připojení
- POST /api/init - inicializace test tabulky
- GET /api/messages - načtení zpráv z tabulky

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

### 6. Test endpointů
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/test
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
