# A1 Invoicing

Custom, self-hosted invoicing app. Stack: Django REST API, React frontend, PostgreSQL, Docker. Stripe for payments, WeasyPrint for PDFs, SMTP for email.

## Quick Start (Docker)

1. Create env files:
- Copy .env.example to .env
- Copy backend/.env.example to backend/.env
- Copy frontend/.env.example to frontend/.env

2. Start services:
docker compose up --build

API: http://localhost:8000
Frontend: http://localhost:5173
DB: postgres:5432

## Local Dev without Docker

- Backend
  - python -m venv .venv && source .venv/bin/activate
  - pip install -r backend/requirements.txt
  - cp backend/.env.example backend/.env
  - cd backend
  - python manage.py migrate
  - python manage.py createsuperuser
  - python manage.py runserver
  - Auth endpoints:
    - POST /api/auth/login/ { username, password } (session cookie; CSRF not required for login)
    - GET /api/auth/me/ (requires session)
    - POST /api/auth/logout/ (requires session; CSRF not required)

- Frontend
  - cd frontend
  - npm i
  - cp .env.example .env
  - npm run dev
  - Ensure VITE_API_BASE matches backend (default http://localhost:8000/api) and that fetch uses credentials: include

## Auth & Permissions

- Session-based authentication using Django sessions and cookies
- CORS_ALLOW_CREDENTIALS enabled; CSRF trusted origins include FRONTEND_URL
- Groups seeded via migration: Admin, Staff, Client
- Permissions:
  - Authenticated users: read-only access to Clients and Invoices (GET/HEAD/OPTIONS)
  - Staff/Admin: full write access (POST/PUT/PATCH/DELETE) to Clients and Invoices
  - TaxRate: Staff/Admin only

## PDF

- GET /api/invoices/{id}/pdf/ returns application/pdf using WeasyPrint
- Template located at backend/templates/invoice.html

## Environment Variables

See .env.example at repo root and backend/.env.example for DB, Stripe, SMTP, Redis, and allowed hosts.

## Deployment

See env vars above. Use production-ready WSGI (e.g., gunicorn/uvicorn workers behind nginx). Set:
- DEBUG=0
- SESSION_COOKIE_SECURE=1, CSRF_COOKIE_SECURE=1
- Proper ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS
