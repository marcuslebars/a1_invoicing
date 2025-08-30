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
  - cd backend
  - python manage.py migrate
  - python manage.py runserver

- Frontend
  - cd frontend
  - npm i
  - npm run dev

## Deployment

See docs in README for env vars and production notes at bottom.
