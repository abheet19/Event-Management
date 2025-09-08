# Event Management System

A full-stack event management platform with real-time attendee registration, timezone conversion, and capacity management.

**Tech Stack**: Laravel 11, PostgreSQL, Next.js 14, TypeScript, Tailwind CSS

## Features

- **Event Management**: Create, edit, delete events with capacity limits
- **Attendee Registration**: Real-time registration with duplicate prevention
- **Timezone Support**: Global timezone conversion (UTC storage, local display)
- **Search & Pagination**: Attendee search with sorting and pagination
- **Conflict Handling**: 409 responses for capacity/duplicate violations
- **API Documentation**: Swagger/OpenAPI with comprehensive examples

## Quick Start

### 1. Start PostgreSQL
```powershell

docker run --name pg-event `
  -e POSTGRES_USER=events_user `
  -e POSTGRES_PASSWORD=<YOUR_DB_PASSWORD> `
  -e POSTGRES_DB=events_db `
  -p 5433:5432 -d postgres:15
```

### 2. Backend Setup
```powershell
cd event-management
copy .env.example .env

composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
# Backend: http://127.0.0.1:8000
```

### 3. Frontend Setup
```powershell
cd event-frontend
npm install
npm run dev
# Frontend: http://localhost:3000
```

Create `event-frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## API Endpoints

Base URL: `http://127.0.0.1:8000/api/v1`

### Events
- `GET /events` - List events (paginated, upcoming by default)
- `POST /events` - Create event
- `GET /events/{id}` - Get single event
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

### Registration
- `POST /events/{id}/register` - Register attendee
- `GET /events/{id}/attendees` - List attendees (paginated, searchable)

### Query Parameters
- `?page=1&per_page=10` - Pagination
- `?include_past=1` - Include past events
- `?q=search` - Search attendees by name/email
- `?sort=created_at_desc` - Sort attendees
- `?tz=Asia/Kolkata` - Timezone conversion

## Sample Requests

```powershell
# Create event in IST
curl.exe -X POST "http://127.0.0.1:8000/api/v1/events?tz=Asia/Kolkata" `
  -H "Content-Type: application/json" `
  -H "X-Timezone: Asia/Kolkata" `
  -d "{\"name\":\"Demo Event\",\"location\":\"Mumbai\",\"start_time\":\"2025-09-08T10:00:00\",\"end_time\":\"2025-09-08T11:00:00\",\"max_capacity\":50}"

# Register attendee
curl.exe -X POST "http://127.0.0.1:8000/api/v1/events/1/register" `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}"

# Search attendees
curl.exe "http://127.0.0.1:8000/api/v1/events/1/attendees?q=john&sort=name_asc"
```

## Conflict Scenarios (409 Responses)

- **Duplicate Registration**: Same email for same event
- **Capacity Full**: Registration when event is at max capacity
- **Capacity Reduction**: Lowering capacity below current attendee count

## Testing

Environment separation prevents tests from wiping demo data.

1) Create `.env.testing` (ignored by git):
```
APP_ENV=testing
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=events_test
DB_USERNAME=events_user
DB_PASSWORD=<YOUR_DB_PASSWORD>
```

2) Create the test database in Postgres once:
```powershell
# Inside the same container/session where Postgres runs
# psql -U events_user -h 127.0.0.1 -p 5433 -d events_db -c "CREATE DATABASE events_test;"
```

3) Run tests (uses `.env.testing`):
```powershell
php artisan test
```

4) (Optional) Regenerate API docs:
```powershell
php artisan l5-swagger:generate
```

**Swagger UI**: http://127.0.0.1:8000/api/documentation

## Detailed Setup

### Backend (Laravel + PostgreSQL)

1) **Start PostgreSQL with Docker**
```powershell
docker run --name pg-event `
  -e POSTGRES_USER=events_user `
  -e POSTGRES_PASSWORD=<YOUR_DB_PASSWORD> `
  -e POSTGRES_DB=events_db `
  -p 5433:5432 -d postgres:15
```

2) **Configure and run**
```powershell
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve  # http://127.0.0.1:8000
```
### API Features
- **Timezone Support**: UTC storage, `?tz=Asia/Kolkata` or `X-Timezone` header for conversion
- **Search & Sort**: `/events/{id}/attendees?q=search&sort=name_asc`
- **Conflict Handling**: 409 responses for capacity/duplicate violations
- **Swagger Docs**: http://127.0.0.1:8000/api/documentation

### Frontend (Next.js + TypeScript)

```powershell
cd event-frontend
npm install
npm run dev  # http://localhost:3000
```

Create `event-frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Features: Auto timezone detection, error toasts, pagination, search/sort UI

## Demo & Validation

### Quick Verification
- Backend seeded: `GET http://127.0.0.1:8000/api/v1/events` returns a non-empty `data` array
- Frontend page `/events` loads without 500, shows seeded events
- Attendees list search/sort works for a seeded event
