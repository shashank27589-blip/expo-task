# Project & Task Manager App

A full-stack assignment project with an Expo React Native mobile app, an Express API, PostgreSQL via Prisma, Redux Toolkit state management, Axios API calls, OTP login, JWT-protected routes, project CRUD, and task CRUD.

## Tech Stack

- Mobile: Expo, React Native, React Navigation, Redux Toolkit, Redux Persist, Axios
- API: Node.js, Express, Prisma, PostgreSQL, JWT, Zod
- Auth: demo OTP flow plus JWT session persistence

## Project Structure

```text
apps/
  api/      Express + Prisma backend
  mobile/   Expo React Native app
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example apps/api/.env
cp .env.example apps/mobile/.env
```

3. Update `apps/api/.env` with your PostgreSQL `DATABASE_URL` and a strong `JWT_SECRET`.

4. Prepare the database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the API:

```bash
npm run dev:api
```

6. Start the mobile app:

```bash
npm run dev:mobile
```

For Android emulator use `http://10.0.2.2:4000` as `EXPO_PUBLIC_API_URL`. For a physical phone, use your computer's LAN IP address.

## Demo Auth

The API creates a six digit OTP for the supplied email. In development, the OTP is returned in the `POST /auth/request-otp` response and logged by the API so the flow can be tested without email or SMS infrastructure.

## API Summary

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `GET /auth/me`
- `GET /projects`
- `POST /projects`
- `DELETE /projects/:projectId`
- `GET /projects/:projectId/tasks`
- `POST /projects/:projectId/tasks`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`

All project and task routes require `Authorization: Bearer <token>`.

## Verification

```bash
npm run typecheck
npm run test:api
```
