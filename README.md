# Shortly

Shortly is a full-stack URL shortener and analytics dashboard built with React, Vite, Tailwind CSS, Express, MongoDB, and Mongoose.

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, nanoid

## Features

- JWT signup, login, profile editing, and password changes
- Protected dashboard routes
- Nanoid short-link generation and optional custom aliases
- HTTP 302 redirects with active, expired, and disabled link handling
- Click tracking for timestamp, referrer, browser, device, and operating system
- MongoDB aggregation analytics, charts, link management, filtering, and sorting
- QR codes, copy actions, toast notifications, responsive dashboard, and loading/empty states

## Project structure

```text
frontend/
  src/components
  src/context
  src/layouts
  src/pages
  src/services
backend/
  src/config
  src/controllers
  src/middleware
  src/models
  src/routes
  src/utils
```

## Local setup

### 1. Database

Create a MongoDB database locally or with MongoDB Atlas.

Use `mongosh` or MongoDB Compass to verify the database connection. Database credentials and secrets must remain in `backend/.env`, never in source control.

### 2. Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `BASE_URL` in `backend/.env`.

### 3. Frontend

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

### Backend

| Variable | Example |
| --- | --- |
| PORT | `5000` |
| MONGODB_URI | `mongodb://127.0.0.1:27017/shortly` |
| JWT_SECRET | a long random value |
| JWT_EXPIRES_IN | `7d` |
| CLIENT_URL | `http://localhost:5173` |
| BASE_URL | `http://localhost:5000` |

### Frontend

| Variable | Example |
| --- | --- |
| VITE_API_URL | `http://localhost:5000/api` |
| VITE_PUBLIC_BASE_URL | `http://localhost:5000` |

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `POST /api/links`
- `GET /api/links`
- `GET /api/links/:id`
- `PUT /api/links/:id`
- `DELETE /api/links/:id`
- `PATCH /api/links/:id/status`
- `GET /api/analytics/overview`
- `GET /api/analytics/links/:id`
- `GET /api/analytics/clicks`
- `GET /api/analytics/top-links`
- `GET /:shortCode`

## Deployment

### Backend on Render

1. Create a Web Service from this repository and set the root directory to `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, and `BASE_URL`.
5. Set `BASE_URL` to the Render service URL and `CLIENT_URL` to the Vercel URL.

The included `render.yaml` provides a Render blueprint configuration.

### Frontend on Vercel

1. Import the repository and set the root directory to `frontend`.
2. Framework preset: Vite.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL=https://your-api-url/api` and `VITE_PUBLIC_BASE_URL=https://your-api-url`.

The included `vercel.json` enables client-side route rewrites.
