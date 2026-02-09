# Barber Pro WhatsApp Booking Bot Backend

This project includes an MVP backend API and Supabase schema for a WhatsApp booking bot.

## Implemented backend structure

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

## Required environment variables

Set these before running API routes:

```bash
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Apply SQL migration

Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor.

## API testing with curl

Use `http://localhost:3000` as base URL.

### 1. Start conversation (NEW -> WAIT_SERVICE)

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"Hi"}'
```

### 2. Complete full booking flow

```bash
# WAIT_SERVICE -> WAIT_DAY
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"haircut"}'

# WAIT_DAY -> WAIT_TIME
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"tomorrow"}'

# WAIT_TIME -> WAIT_NAME
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"1"}'

# WAIT_NAME -> CONFIRMED (creates appointment + resets conversation to NEW)
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"from":"+972501234567","body":"John Doe"}'
```

### 3. List appointments

```bash
# All appointments
curl -X GET http://localhost:3000/api/appointments

# Appointments on a specific day
curl -X GET "http://localhost:3000/api/appointments?date=2026-02-10"
```

### 4. Confirm an appointment

```bash
curl -X POST http://localhost:3000/api/appointments/<APPOINTMENT_ID>/confirm
```

### 5. Cancel an appointment

```bash
curl -X POST http://localhost:3000/api/appointments/<APPOINTMENT_ID>/cancel
```

### 6. Get conversation by phone

```bash
curl -X GET http://localhost:3000/api/conversations/%2B972501234567
```

### 7. Reset conversation

```bash
curl -X DELETE http://localhost:3000/api/conversations/%2B972501234567
```