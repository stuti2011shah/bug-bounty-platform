# Bug Bounty Web Platform

A web-based Bug Bounty platform where users can post bugs with rewards, and others can submit solutions. The bug creator reviews submissions and approves a winner who receives the bounty.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Auth:** JWT (jsonwebtoken), bcrypt

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend

```bash
cd server
npm install
# Create a local .env from the example
# Unix / macOS:
cp .env.example .env
# Windows (PowerShell / CMD):
copy .env.example .env
# Edit `.env` with your `MONGO_URI` and `JWT_SECRET`, then run the server
npm run dev

# Optional: seed the development database with demo users and sample bugs
# This runs `server/src/seed/devSeed.js`. From the repo root:
cd server
npm run seed
```

**Required env vars:**
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing
- `PORT` – (optional) defaults to 5000

Example `.env` values:

- `MONGO_URI=mongodb://localhost:27017/bugbounty` (or your Atlas URI)
- `JWT_SECRET=replace_with_a_secure_random_string`
- `PORT=5000`

### Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The client proxies `/api` to the backend (port 5000) in dev.

### Production build

```bash
cd client && npm run build
# Serve the dist/ folder (e.g. with nginx, or Express static)
```

## Assumptions

- Currency is Indian Rupee (₹); amount stored as number, display uses ₹
- Proof for submissions: upload images/videos from device (jpg, png, gif, webp, mp4, webm) or paste URLs.
- One winner per bug; approval closes the bug and rejects other submissions
- Bug creator cannot submit to their own bug
- Role `admin` exists in schema; no admin-specific UI yet (future scope)
- No real payment gateway; reward tracking is logic-level only (`totalWon`, `winsCount`)

## Troubleshooting

- Node version: use Node.js 18+ (use `node -v` to verify).
- Frontend `npm run dev` may fail if port `5173` is in use or proxy to backend fails — try changing ports or ensure the backend is running on `5000`.
- If MongoDB connection fails, confirm `MONGO_URI` and that the DB allows connections from your IP (Atlas).
- If uploads fail, check `server/uploads/` exists and has write permissions.

## Limitations

- No email verification
- No password reset
- File uploads stored locally in `server/uploads/` (use cloud storage for production)
- No admin dashboard or moderation
- Single currency (₹) hardcoded

## Project Structure

```
bug-bounty/
├── client/          # React frontend
│   └── src/
│       ├── api/     # API client
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
├── server/          # Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── validators/
│       └── utils/
├── docs/            # API docs, ER diagram
└── README.md
```

## API Documentation

See [docs/API.md](./docs/API.md) for endpoint details.

## Database Schema

See [docs/SCHEMA.md](./docs/SCHEMA.md) for ER diagram and schema description.
