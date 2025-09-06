<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Mini Event Management

Quick dev setup and API summary for the Event Management project.

Prereqs: PHP >= 8.1, Composer, Docker (for Postgres) or PostgreSQL installed.

1. Start Postgres with Docker (recommended):

```powershell
# replace passwords as needed
docker run --name pg-event -e POSTGRES_USER=events_user -e POSTGRES_PASSWORD=secret_password -e POSTGRES_DB=events_db -p 5432:5432 -d postgres:15
```

2. Update `.env` (project root) with DB credentials:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=events_db
DB_USERNAME=events_user
DB_PASSWORD=secret_password
```

3. Install composer deps (already done for you):
```
composer install
```

4. Generate app key and run migrations:
```
php artisan key:generate
php artisan migrate
```

5. Run the dev server:
```
php artisan serve
```

API Endpoints (prefix /api/v1):
- POST /events
- GET /events
- GET /events/{id}
- PUT /events/{id}
- DELETE /events/{id}
- POST /events/{id}/register
- GET /events/{id}/attendees?per_page=20

Notes:
- Time fields are stored as timezone-aware timestamps (postgres timestamptz) in UTC.
- Duplicate registrations per (event_id, email) are prevented at DB level.
- Capacity is enforced in registration logic.

## CORS
- Enabled for API paths and Next.js dev origins: http://localhost:3000 and http://127.0.0.1:3000.
- If you change the frontend port or domain, update `config/cors.php` and run: `php artisan config:clear`.

## Timezone policy
- All event times are stored in UTC (PostgreSQL timestamptz).
- On create/update, backend accepts local times and converts to UTC using the provided timezone.
- Frontend should auto-detect timezone and pass it either as query `?tz=Asia/Kolkata` or header `X-Timezone: Asia/Kolkata`.
- GET responses convert event times to requested timezone; default is UTC.

Examples:
- Create in IST
```
POST /api/v1/events?tz=Asia/Kolkata
{
  "name": "Demo",
  "location": "BLR",
  "start_time": "2025-09-08T10:00:00",
  "end_time": "2025-09-08T11:00:00",
  "max_capacity": 50
}
```
- List in browser tz
```
GET /api/v1/events?tz=Asia/Kolkata
```

## API Docs (Swagger)
- Package: L5-Swagger
- Generate docs:
  - php artisan l5-swagger:generate
- Serve UI (json served under storage/api-docs/openapi.json). You can use a Swagger UI docker or VS Code extension to view it.
- Endpoint configured: /api/documentation (if using L5 routing).

### Generate Swagger (Windows PowerShell)
- cd "d:\\Code\\Omnify Project\\event-management"
- php artisan config:clear
- php artisan l5-swagger:generate
- The JSON will be at storage/api-docs/api-docs.json

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
