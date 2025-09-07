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
  -e POSTGRES_PASSWORD=Secret_271919 `
  -e POSTGRES_DB=events_db `
  -p 5433:5432 -d postgres:15
```

### 2. Backend Setup
```powershell
cd event-management
composer install
php artisan key:generate
php artisan migrate
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

```powershell
# Run all tests
php artisan test

# Generate API docs
php artisan l5-swagger:generate
```

**Swagger UI**: http://127.0.0.1:8000/api/documentation

## Detailed Setup

### Backend (Laravel + PostgreSQL)

1) **Start PostgreSQL with Docker**
```powershell
docker run --name pg-event `
  -e POSTGRES_USER=events_user `
  -e POSTGRES_PASSWORD=Secret_271919 `
  -e POSTGRES_DB=events_db `
  -p 5433:5432 -d postgres:15
```

2) **Configure and run**
```powershell
composer install
php artisan key:generate
php artisan migrate
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

### Loom Walkthrough
- **Video**: <ADD_LINK_HERE>
- **Coverage**: Complete requirements validation - CRUD, registration conflicts, timezone management (IST), pagination, testing, Swagger docs

### Troubleshooting
- **500 Error**: PostgreSQL not running - start Docker container first
- **CORS Issues**: Update `config/cors.php` and run `php artisan config:clear`
- **Timezone**: Use valid IANA names (e.g., `Asia/Kolkata`)

---

## Project Stack

**Backend**: Laravel 11 + PostgreSQL + L5-Swagger  
**Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS  
**Features**: Timezone-aware API, pagination, search/sort, conflict handling, comprehensive testing
