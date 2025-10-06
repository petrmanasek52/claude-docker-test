# Claude.MD - Dokumentace projektu

## 📋 Popis projektu
Testovací projekt demonstrující integraci Docker, Node.js a PostgreSQL s GitHub CLI workflow.

## 🛠 Tech Stack
- **Runtime:** Node.js (Express.js framework)
- **Database:** PostgreSQL 16 (Docker container)
- **Tools:** Docker, Docker Compose, GitHub CLI
- **Package Manager:** npm

## 🏗 Architektura

```
┌─────────────────┐
│  Express Server │  Port 3000
│   (Local Node)  │
└────────┬────────┘
         │
         │ TCP/IP
         │
┌────────▼────────┐
│   PostgreSQL    │  Port 5432
│ (Docker Container)│
└─────────────────┘
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

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/` | GET | Uvítací zpráva |
| `/health` | GET | Health check |
| `/api/test` | GET | Test DB připojení |

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
