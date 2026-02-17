# Bug Bounty API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Protected routes require header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/register

Register a new user.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:** 400 if email already exists or validation fails.

---

### POST /auth/login

Login and receive token.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "totalWon": 0,
    "winsCount": 0
  }
}
```

**Errors:** 401 for invalid credentials.

---

### GET /auth/me

Get current user profile. **Protected.**

**Response (200):**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "totalWon": 4000,
    "winsCount": 1
  }
}
```

---

## Bugs

### GET /bugs

List all bugs (public).

**Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Login fails on mobile",
    "description": "...",
    "bountyAmount": 4000,
    "status": "OPEN",
    "creator": { "name": "Alice", "email": "alice@example.com" },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### GET /bugs/:id

Get single bug (public).

**Response (200):**
```json
{
  "_id": "...",
  "title": "...",
  "description": "...",
  "bountyAmount": 4000,
  "status": "CLOSED",
  "rewarded": true,
  "creator": { "name": "Alice", "email": "alice@example.com" },
  "winner": { "name": "Bob", "email": "bob@example.com" },
  "winningSubmission": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors:** 404 if not found.

---

### POST /bugs

Create a bug. **Protected.**

**Request body:**
```json
{
  "title": "Bug title",
  "description": "Detailed description (min 10 chars)",
  "bountyAmount": 4000
}
```

**Response (201):** Bug object.

**Errors:** 400 validation, 401 if not logged in.

---

## Submissions

### GET /bugs/:bugId/submissions

List submissions for a bug (public).

**Response (200):**
```json
[
  {
    "_id": "...",
    "bug": "...",
    "submitter": { "name": "Bob", "email": "bob@example.com" },
    "fixDescription": "Fixed by...",
    "proofLinks": ["https://example.com/proof.png"],
    "status": "PENDING",
    "createdAt": "..."
  }
]
```

---

### POST /bugs/:bugId/submissions

Create a submission. **Protected.** Creator cannot submit to own bug.

**Request body:**
```json
{
  "fixDescription": "Description of the fix (min 10 chars)",
  "proofLinks": ["https://example.com/screenshot.png"]
}
```

`proofLinks` is optional; must be array of valid URLs.

**Response (201):** Submission object.

**Errors:** 400 if bug closed, creator submitting, or validation; 404 if bug not found.

---

### POST /bugs/:bugId/submissions/:submissionId/approve

Approve a submission and declare winner. **Protected.** Only bug creator.

**Response (200):**
```json
{
  "message": "Winner approved ✅",
  "bug": { ... },
  "approvedSubmission": { ... }
}
```

**Errors:** 403 if not creator; 400 if already closed; 404 if not found.
