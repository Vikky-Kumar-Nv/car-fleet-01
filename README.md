# Car Fleet Dashboard
 
Monorepo-style project containing:
- **backend/** Express + TypeScript REST API (MongoDB, JWT auth, clustering)
- **project/** React + Vite + TypeScript frontend (TailwindCSS, React Router, React Hook Form, Recharts)

## Features
### Backend
- Clustered Node.js workers (uses all CPU cores; auto-respawn on exit)
- RESTful modular routing (`/api/*`)
- JWT authentication & role-based authorization middleware
- Rate limiting & security headers (helmet, express-rate-limit, CORS)
- MongoDB via Mongoose (companies, drivers, vehicles, bookings, payments, reports, finance, users)
- File uploads (multer) and configurable upload directory
- Input validation with Zod
- Seed script for initial users

### Frontend
- Vite + React 19 + TypeScript
- Tailwind CSS + Headless UI components
- Global context for auth & app state
- Protected routes wrapper
- Recharts for analytics / reports
- Form handling & validation (react-hook-form + zod resolver)
- Toast notifications (react-hot-toast)

## Tech Stack
| Layer | Stack |
|-------|-------|
| Backend Runtime | Node.js + TypeScript |
| Framework | Express |
| DB | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Validation | Zod |
| Frontend | React, Vite, TailwindCSS |
| Charts | Recharts |

## Repository Structure
```
backend/        # API source, build & config
project/        # Frontend application
uploads/        # Runtime upload storage (ignored)
```

## Environment Variables
Create `backend/.env` (NOT committed). Example template is in `backend/.env.example`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/bolt
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```
Adjust `FRONTEND_URL` to match your dev frontend port (Vite default 5173).

## Installation & Setup
### Prerequisites
- Node.js 18+
- MongoDB server running locally or a connection string

### Clone & Install
```bash
# Clone
git clone https://github.com/Vikky-Kumar-Nv/car-fleet.git
cd car-fleet

# Backend deps
cd backend
npm install
cp .env.example .env  # then edit secrets

# In a second terminal install frontend deps
cd ../project
npm install
```

### Run (Development)
Backend (with ts-node + nodemon):
```bash
cd backend
npm run dev
```
Frontend (Vite dev server):
```bash
cd project
npm run dev
```
Default API base: `http://localhost:3000/api` (if `PORT=3000`).

### Build & Production Start
```bash
# Backend build
cd backend
npm run build
npm start

# Frontend build & preview
cd ../project
npm run build
npm run preview
```
Deploy the backend `dist/` output and serve the frontend `dist/` via any static hosting or reverse proxy.

## API Overview
Base path: `/api`

| Resource | Path Prefix | Notes |
|----------|-------------|-------|
| Auth | /auth | Login / token issuance |
| Bookings | /bookings | CRUD with rate limiting & auth layers |
| Drivers | /drivers | Driver management |
| Vehicles | /vehicles | Vehicle inventory & status |
| Companies | /companies | Company entities |
| Payments | /payments | Payment records |
| Reports | /reports | Analytics/report endpoints |
| Finance | /finance | Financial summaries |

(See individual route/controller files under `backend/src/api` for full details.)

## Security & Middleware
- `helmet()` for HTTP headers
- `cors()` restricted by `FRONTEND_URL`
- Rate limiting via `apiLimiter`
- JWT auth middleware enforces role(s)
- Centralized error handler

## Development Notes
- Clustering: Master forks workers equal to CPU cores. For debugging, you can temporarily bypass clustering by running only the worker logic.
- Seeding: `seedUsers()` runs on Mongo connect start; adjust or guard to avoid duplicate seeds in production.
- Validation: Consolidate Zod schemas in `validation/` and reuse across controllers & frontend forms.

## Common Tasks
| Task | Command |
|------|---------|
| Lint frontend | `cd project && npm run lint` |
| Reinstall backend deps | `cd backend && rm -rf node_modules && npm install` |
| Generate TS build | `cd backend && npm run build` |

## Contributing
1. Create a feature branch: `git checkout -b feat/short-name`
2. Commit with conventional style (e.g., `feat: add vehicle export endpoint`)
3. Open PR to `main`

## Troubleshooting
| Issue | Fix |
|-------|-----|
| `.env` showing in git | Ensure root `.gitignore` has `.env` and file not already tracked (`git rm --cached backend/.env`) |
| CORS errors | Verify `FRONTEND_URL` value & restart backend |
| Mongo connect fails | Check `MONGO_URI` & that MongoDB is running |
| Rate limit blocks local testing | Increase limits or disable limiter in dev |

## License
ISC (update if needed).

## Future Enhancements
- Add automated tests (Jest / Vitest)
- CI workflow (lint, build, test)
- Docker Compose for Mongo + services
- Swagger / OpenAPI docs generation
- Role-based UI gating & audit logs

---
Maintained by Vikky-Kumar-Nv. PRs welcome.
