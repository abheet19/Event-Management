# Event Frontend (Next.js 14)

Prereqs:
- Node 20+
- Backend running at http://127.0.0.1:8000 (Laravel)

Setup:
- Copy .env.local (already created) and adjust if needed:
  - NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

Run (PowerShell):
- cd event-frontend
- npm install
- npm run dev
- Open http://localhost:3000

Features:
- Pages:
  - /events — list upcoming events
  - /events/new — create event
  - /events/[id] — details, registration form, attendees pagination
  - /events/[id]/edit — edit or delete event
- Timezone: auto-detected via Intl and sent as ?tz and X-Timezone.

Troubleshooting:
- If requests fail with CORS, ensure backend allows http://localhost:3000 in config/cors.php and run `php artisan config:clear`.
- If times look off, verify your system timezone and that ?tz= is appended (network tab). Backend stores UTC and converts per tz.
- Confirm NEXT_PUBLIC_API_BASE_URL matches your Laravel server base URL.

Extras:
- Swagger UI: http://127.0.0.1:8000/api/documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
