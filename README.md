<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Mini Event Management

Quick dev setup and API summary for the Event Management project.

Prereqs: PHP >= 8.1, Composer, Docker (for Postgres) or PostgreSQL installed, Node 20+ (for frontend).

## TL;DR Quickstart
1) Backend (Laravel + PostgreSQL on port 5433)
- Copy `.env` and set DB_* to your Postgres, run:
```
php artisan key:generate
php artisan migrate
php artisan serve
```
- Swagger UI: GET /api/docs (if enabled)

2) Frontend (Next.js)
- event-frontend/.env.local:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```
- Then:
```
cd event-frontend
npm install
npm run dev
```

## CORS in deployments
- Add allowed origins in `.env` (comma-separated):
```
CORS_ALLOWED_ORIGINS=https://your-frontend.example.com,https://staging.example.com
```
- Or rely on the localhost patterns for local dev.

## Loom walkthrough
- Video: <ADD_LINK_HERE>
- Covers: CRUD, register, 409 duplicate/at-capacity, 409 capacity-lowering, IST tz demo, pagination, include_past, attendees search/sort.

## Backend (Laravel + PostgreSQL)

1) Start PostgreSQL with Docker (Windows PowerShell)

```powershell
# Host port 5433 -> container 5432 (matches .env)
docker run --name pg-event `
  -e POSTGRES_USER=events_user `
  -e POSTGRES_PASSWORD=Secret_271919 `
  -e POSTGRES_DB=events_db `
  -p 5433:5432 -d postgres:15
```

2) Configure environment

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=events_db
DB_USERNAME=events_user
DB_PASSWORD=Secret_271919
```

3) Install dependencies and bootstrap
```
composer install
php artisan key:generate
php artisan migrate
```

4) Run the dev server
```
php artisan serve
# => http://127.0.0.1:8000
```

### CORS
- Enabled for API paths and Next.js dev origins: http://localhost:3000 and http://127.0.0.1:3000.
- If you change the frontend port or domain, update `config/cors.php` and run: `php artisan config:clear`.

### Timezone policy
- All event times are stored in UTC (PostgreSQL `timestamptz`).
- On create/update, backend interprets provided times using the timezone from `?tz=` or `X-Timezone` header, then converts to UTC for storage.
- On reads, times are converted back to the requested timezone; default is UTC if not provided.
- Works with IST (`Asia/Kolkata`) and any IANA timezone.

### API Endpoints (prefix `/api/v1`)
- POST `/events`
- GET `/events` (paginated; upcoming by default, use `include_past=1` to show all)
- GET `/events/{id}`
- PUT `/events/{id}`
- DELETE `/events/{id}`
- POST `/events/{id}/register`
- GET `/events/{id}/attendees?per_page=20`

Query params (GET /events)
- `page` (default 1)
- `per_page` (default 10)
- `include_past=1` to include events whose `end_time` is in the past

### GET /events/{id}/attendees
Supports pagination and now search/sort.

Query params
- `page` (default 1)
- `per_page` (default 20)
- `q` optional: case-insensitive search over name and email (ILIKE)
- `sort` optional: one of `created_at_desc` (default), `created_at_asc`, `name_asc`, `name_desc`

Examples
```powershell
# Page 1, 20 per page, search by name/email containing "ali", newest first
curl.exe "http://127.0.0.1:8000/api/v1/events/1/attendees?page=1&per_page=20&q=ali&sort=created_at_desc"

# Sort by name A→Z
curl.exe "http://127.0.0.1:8000/api/v1/events/1/attendees?page=1&per_page=20&sort=name_asc"
```

### Sample requests (PowerShell uses curl.exe)

Create event in IST
```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/v1/events?tz=Asia/Kolkata" `
  -H "Content-Type: application/json" `
  -H "X-Timezone: Asia/Kolkata" `
  -d "{\"name\":\"Demo\",\"location\":\"BLR\",\"start_time\":\"2025-09-08T10:00:00\",\"end_time\":\"2025-09-08T11:00:00\",\"max_capacity\":50}"
```

List upcoming (in browser tz or explicit tz)
```powershell
curl.exe "http://127.0.0.1:8000/api/v1/events?page=1&per_page=10&tz=Asia/Kolkata" -H "X-Timezone: Asia/Kolkata"
```

List including past events
```powershell
curl.exe "http://127.0.0.1:8000/api/v1/events?include_past=1&tz=Asia/Kolkata" -H "X-Timezone: Asia/Kolkata"
```

Get one
```powershell
curl.exe "http://127.0.0.1:8000/api/v1/events/1?tz=Asia/Kolkata" -H "X-Timezone: Asia/Kolkata"
```

Update
```powershell
curl.exe -X PUT "http://127.0.0.1:8000/api/v1/events/1?tz=Asia/Kolkata" `
  -H "Content-Type: application/json" -H "X-Timezone: Asia/Kolkata" `
  -d "{\"name\":\"Demo Updated\",\"start_time\":\"2025-09-08T10:30:00\",\"end_time\":\"2025-09-08T11:30:00\",\"max_capacity\":80}"
```

Register attendee (duplicate and capacity conflicts return 409)
```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/v1/events/1/register" `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\"}"
```

List attendees (paginated)
```powershell
curl.exe "http://127.0.0.1:8000/api/v1/events/1/attendees?page=1&per_page=10"
```

409 Conflict cases
- PUT /events/{id}: attempting to lower `max_capacity` below current attendee count.
- POST /events/{id}/register: when event is at capacity or the email is already registered for that event.

### API Docs (Swagger / OpenAPI)
- Generate docs:
```
php artisan config:clear
php artisan l5-swagger:generate
```
- UI: http://127.0.0.1:8000/api/documentation
- JSON: `storage/api-docs/api-docs.json`

### Tests
```
php artisan test
# or
vendor\bin\phpunit
```

### Common pitfalls
- Connection refused: ensure host port `5433` maps to container `5432` and matches `.env`.
- CORS errors: confirm `config/cors.php` allows your frontend origin, then `php artisan config:clear`.
- Timezone: use valid IANA tz names like `Asia/Kolkata`.

## Frontend (Next.js 14 + TypeScript)

Folder: `event-frontend/`

1) Configure `.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

2) Install and run
```powershell
cd event-frontend
npm install
npm run dev
# => http://localhost:3000
```

Pages
- `/events` — list events (paginated, upcoming by default)
- `/events/new` — create event
- `/events/[id]` — event details, register, attendees pagination
- `/events/[id]/edit` — edit event

- Event detail attendees view uses a table with search (q), sort selector, pagination, and a copy-to-clipboard button for emails.
- Global friendly error page (`app/error.tsx`) shows a helpful message and a Try again button.

Timezone is auto-detected in the browser and sent as both `?tz=` and `X-Timezone`.

---

Project uses: Laravel (API), PostgreSQL, L5-Swagger, Next.js App Router, Tailwind, minimal shadcn-style UI components.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
