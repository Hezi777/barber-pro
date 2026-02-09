<h1 align="center">
  <img width="220" height="220" alt="Barber Pro Logo" src="https://img.icons8.com/fluency/480/barbershop.png" />
  <br/>
  <b>Barber Pro - WhatsApp Booking Bot Backend</b>
</h1>

<p align="center">
  API-first MVP backend for WhatsApp-style appointment booking flows.<br/>
  Built with TypeScript route handlers and Supabase Postgres.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" />
</p>

---

## Features

- Conversation state machine: `NEW -> WAIT_SERVICE -> WAIT_DAY -> WAIT_TIME -> WAIT_NAME -> CONFIRMED`
- Webhook-like message endpoint (JSON in, JSON reply text out)
- Conversation persistence (`customers`, `conversations`, `messages`)
- Appointment lifecycle endpoints (`PENDING`, `CONFIRMED`, `CANCELED`)
- Supabase schema migration with indexes for booking and history queries
- Idempotent-safe customer upsert and duplicate-booking prevention logic

---

## Project Structure

```text
supabase/
  migrations/
    001_initial_schema.sql

lib/
  supabaseServer.ts
  types.ts
  stateMachine.ts

app/
  api/
    webhooks/
      whatsapp/
        route.ts
    appointments/
      route.ts
      [id]/
        confirm/
          route.ts
        cancel/
          route.ts
    conversations/
      [phone]/
        route.ts
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| API Runtime | Next.js App Router Route Handlers |
| Language | TypeScript (strict types for backend modules) |
| Database | Supabase Postgres |
| DB Client | `@supabase/supabase-js` |
| Hosting Target | Vercel |

---

## Environment Variables

Create a `.env.local` (or runtime env vars) with:

```bash
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

## Database Setup

Run SQL from:

- `supabase/migrations/001_initial_schema.sql`

This creates:

- `customers`
- `conversations`
- `appointments`
- `messages`

With constraints and indexes for:

- conversation history
- availability checks
- appointment status filters

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/whatsapp` | Accept inbound message and return reply text |
| GET | `/api/appointments` | List appointments (optional `?date=YYYY-MM-DD`) |
| POST | `/api/appointments/:id/confirm` | Set appointment status to `CONFIRMED` |
| POST | `/api/appointments/:id/cancel` | Set appointment status to `CANCELED` |
| GET | `/api/conversations/:phone` | Fetch conversation state/context |
| DELETE | `/api/conversations/:phone` | Reset conversation to `NEW` |

---

## Quick Test (curl)

### 1. Start conversation

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"Hi"}'
```

### 2. Complete booking flow

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp -H "Content-Type: application/json" -d '{"from":"+972501234567","body":"haircut"}'
curl -X POST http://localhost:3000/api/webhooks/whatsapp -H "Content-Type: application/json" -d '{"from":"+972501234567","body":"tomorrow"}'
curl -X POST http://localhost:3000/api/webhooks/whatsapp -H "Content-Type: application/json" -d '{"from":"+972501234567","body":"1"}'
curl -X POST http://localhost:3000/api/webhooks/whatsapp -H "Content-Type: application/json" -d '{"from":"+972501234567","body":"John Doe"}'
```

### 3. List appointments

```bash
curl -X GET http://localhost:3000/api/appointments
curl -X GET "http://localhost:3000/api/appointments?date=2026-02-10"
```

### 4. Confirm / cancel appointment

```bash
curl -X POST http://localhost:3000/api/appointments/<APPOINTMENT_ID>/confirm
curl -X POST http://localhost:3000/api/appointments/<APPOINTMENT_ID>/cancel
```

### 5. Conversation lookup and reset

```bash
curl -X GET http://localhost:3000/api/conversations/%2B972501234567
curl -X DELETE http://localhost:3000/api/conversations/%2B972501234567
```

---

## Notes

- No authentication is required for this MVP.
- No direct WhatsApp provider integration is included; webhook endpoint is provider-agnostic.
- Responses are JSON-based and suitable for later integration with Twilio/360dialog/Meta Cloud API.