# PulseDesk
Multi-tenant support-desk SaaS built with Laravel 11 + React 19.

## Stack
- Backend: PHP 8.2+, Laravel 11, MySQL 8, Laravel Sanctum
- Frontend: React 19, Vite, Tailwind CSS
- Agents: Hermes (orchestrator) + OpenClaw (coder) via EastRouter

## Quick Start
### Backend
```bash
cd backend
composer install
cp .env.example .env
# Fill in DB credentials in .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api
npm run dev
```

### Demo Credentials
Admin:    admin@acme.com / password
Agent 1:  agent1@acme.com / password
Agent 2:  agent2@acme.com / password
Customer: customer1@acme.com / password

## Agent Loop
See agent-log.md for the complete Hermes->OpenClaw loop.
Slack export: slack-export/ directory.
Sprint docs: sprints/ directory.