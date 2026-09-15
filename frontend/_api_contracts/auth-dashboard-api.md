# API Contracts - Authentication & Dashboard

**Status:** Temporary documentation for backend team | **Shared:** [Date]  
**Backend Team Note:** Implement endpoints according to these contracts. Once implemented, frontend will replace mock data with actual API calls. Remove this file once contracts are confirmed live.

---

## Authentication Endpoints

### 1. POST /api/auth/login

**Purpose:** Email/password authentication

**Request:**
```json
{
  "email": "user@bank.example",
  "password": "encrypted_password_hash",
  "rememberMe": false
}
```

**Request Headers:**
```
Content-Type: application/json
X-Requested-With: XMLHttpRequest
X-CSRF-Token: [token from session]
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_12345",
      "email": "user@bank.example",
      "firstName": "John",
      "lastName": "Doe",
      "role": "responder",
      "avatar": "JD"
    },
    "sessionToken": "jwt_token_here",
    "expiresIn": 28800,
    "workspace": "acme-bank"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Response (429 Too Many Requests):**
```json
{
  "status": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many login attempts. Try again after 15 minutes.",
  "retryAfter": 900
}
```

**Notes:**
- Session token stored in httpOnly, Secure, SameSite=Strict cookie
- Password sent encrypted via AES-GCM if VITE_ENCRYPTION_KEY set
- Response also encrypted if backend detects encryption header
- Session expires after 28800 seconds (8 hours)

---

### 2. POST /api/auth/sso-callback

**Purpose:** Okta SSO authentication callback

**Request:**
```json
{
  "code": "okta_auth_code",
  "state": "random_state_nonce",
  "redirectUri": "https://app.bank.example/auth/callback"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "sso_user_789",
      "email": "user@bank.example",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "admin",
      "avatar": "JS"
    },
    "sessionToken": "jwt_token_sso",
    "expiresIn": 28800,
    "workspace": "acme-bank",
    "mfaRequired": false
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "SSO_AUTH_FAILED",
  "message": "Okta authentication failed or user not found",
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Notes:**
- Validate state nonce to prevent CSRF
- Return `mfaRequired: true` if 2FA enrollment pending
- Store session in same httpOnly cookie as email/password auth

---

### 3. POST /api/auth/logout

**Purpose:** Terminate session and clear cookies

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Logged out successfully",
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Notes:**
- Clear httpOnly cookie on client
- Invalidate session token server-side
- Redirect to /login after logout

---

### 4. POST /api/auth/refresh-token

**Purpose:** Refresh expired session token

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "sessionToken": "new_jwt_token",
    "expiresIn": 28800
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "SESSION_EXPIRED",
  "message": "Session expired. Please log in again.",
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Notes:**
- Triggered by axios interceptor on 401 response
- New token stored in httpOnly cookie
- Queued requests retry with new token

---

### 5. POST /api/auth/forgot-password

**Purpose:** Initiate password reset flow

**Request:**
```json
{
  "email": "user@bank.example"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Password reset link sent to your email",
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Notes:**
- Send reset token via email (backend responsibility)
- Reset link expires after 1 hour
- Respond with success regardless of whether email exists (security measure)

---

## Dashboard Endpoints

### 6. GET /api/dashboard/stats

**Purpose:** Fetch KPI metrics

**Request:**
```
GET /api/dashboard/stats?timeframe=7d
```

**Query Parameters:**
- `timeframe` (optional): '7d', '30d', '90d' (default: '7d')

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "kpis": [
      {
        "id": "total_runs",
        "label": "Runs this week",
        "value": 127,
        "delta": "+12%",
        "deltaFg": "#3F7A52",
        "bg": "rgba(90,66,112,0.08)",
        "fg": "#5A4270"
      },
      {
        "id": "verified_pct",
        "label": "Verified answers",
        "value": "84%",
        "delta": "+3%",
        "deltaFg": "#3F7A52",
        "bg": "rgba(63,122,82,0.08)",
        "fg": "#3F7A52"
      },
      {
        "id": "avg_duration",
        "label": "Avg time to answer",
        "value": "38.4s",
        "delta": "-2.1s",
        "deltaFg": "#3F7A52",
        "bg": "rgba(154,108,20,0.08)",
        "fg": "#9A6C14"
      },
      {
        "id": "sources_connected",
        "label": "Evidence sources",
        "value": 6,
        "delta": "all operational",
        "deltaFg": "#3F7A52",
        "bg": "rgba(90,66,112,0.08)",
        "fg": "#5A4270"
      }
    ]
  }
}
```

---

### 7. GET /api/dashboard/run-outcomes

**Purpose:** Fetch run outcomes chart data (last 7 days)

**Request:**
```
GET /api/dashboard/run-outcomes?days=7
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "bars": [
      {
        "day": "Mon",
        "verified": "95px",
        "withheld": "25px"
      },
      {
        "day": "Tue",
        "verified": "102px",
        "withheld": "18px"
      },
      {
        "day": "Wed",
        "verified": "88px",
        "withheld": "32px"
      },
      {
        "day": "Thu",
        "verified": "110px",
        "withheld": "15px"
      },
      {
        "day": "Fri",
        "verified": "98px",
        "withheld": "28px"
      },
      {
        "day": "Sat",
        "verified": "72px",
        "withheld": "12px"
      },
      {
        "day": "Sun",
        "verified": "65px",
        "withheld": "22px"
      }
    ]
  }
}
```

**Notes:**
- Heights as pixel strings; CSS will render bars proportionally
- Verified = solid bar, Withheld = stacked on top

---

### 8. GET /api/dashboard/evidence-sources

**Purpose:** Fetch connected evidence sources and their status

**Request:**
```
GET /api/dashboard/evidence-sources
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "sources": [
      {
        "id": "prometheus",
        "name": "Prometheus",
        "status": "connected",
        "dot": "#3F7A52",
        "fg": "#3F7A52",
        "lastCheck": "2 seconds ago"
      },
      {
        "id": "loki",
        "name": "Loki",
        "status": "connected",
        "dot": "#3F7A52",
        "fg": "#3F7A52",
        "lastCheck": "5 seconds ago"
      },
      {
        "id": "tempo",
        "name": "Tempo",
        "status": "connected",
        "dot": "#3F7A52",
        "fg": "#3F7A52",
        "lastCheck": "1 second ago"
      },
      {
        "id": "argocd",
        "name": "ArgoCD",
        "status": "connected",
        "dot": "#3F7A52",
        "fg": "#3F7A52",
        "lastCheck": "8 seconds ago"
      },
      {
        "id": "github",
        "name": "GitHub",
        "status": "connected",
        "dot": "#3F7A52",
        "fg": "#3F7A52",
        "lastCheck": "12 seconds ago"
      },
      {
        "id": "datadog",
        "name": "Datadog",
        "status": "down",
        "dot": "#A9503C",
        "fg": "#A9503C",
        "lastCheck": "3 minutes ago"
      }
    ],
    "totalConnected": 5,
    "totalDown": 1
  }
}
```

---

### 9. GET /api/dashboard/attention-queue

**Purpose:** Fetch runs requiring user attention (sorted by priority)

**Request:**
```
GET /api/dashboard/attention-queue?limit=10
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "queue": [
      {
        "id": "run_12345",
        "state": "Paused",
        "state_badge": {
          "bg": "rgba(255,193,7,0.12)",
          "fg": "#F59E0B"
        },
        "question": "Why did checkout service latency spike around 14:20?",
        "who": "alice@bank.example",
        "age": "2m ago"
      },
      {
        "id": "run_12346",
        "state": "Withheld",
        "state_badge": {
          "bg": "rgba(244,63,94,0.12)",
          "fg": "#E11D48"
        },
        "question": "Is the current payment error rate unusual?",
        "who": "bob@bank.example",
        "age": "8m ago"
      },
      {
        "id": "run_12347",
        "state": "Running",
        "state_badge": {
          "bg": "rgba(59,130,246,0.12)",
          "fg": "#1D4ED8"
        },
        "question": "What caused the database connection pool saturation?",
        "who": "carol@bank.example",
        "age": "45s ago"
      },
      {
        "id": "run_12348",
        "state": "Paused",
        "state_badge": {
          "bg": "rgba(255,193,7,0.12)",
          "fg": "#F59E0B"
        },
        "question": "Did the recent deploy affect API response times?",
        "who": "dave@bank.example",
        "age": "12m ago"
      }
    ]
  }
}
```

**Notes:**
- Sorted by priority (Paused first, then urgent Withheld, then active Running)
- Clicking row should navigate to run detail/dossier
- Status states: "Paused" (needs input), "Withheld" (blocked by missing evidence), "Running" (in progress), "Verified" (answered), "Failed" (errored)

---

### 10. GET /api/dashboard/recent-runs

**Purpose:** Fetch recent investigation runs

**Request:**
```
GET /api/dashboard/recent-runs?limit=8
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "runs": [
      {
        "id": "run_abc123",
        "outcome": "Verified",
        "bg": "#ECFDF5",
        "fg": "#15803D",
        "question": "Why did p99 latency spike on checkout service?",
        "service": "checkout",
        "coverage": "4 of 5",
        "covPct": "80%",
        "covFg": "#E11D48",
        "duration": "38.4s",
        "timestamp": "2026-09-15 14:22:00 UTC"
      },
      {
        "id": "run_def456",
        "outcome": "Verified",
        "bg": "#ECFDF5",
        "fg": "#15803D",
        "question": "What caused payment processing to slow down?",
        "service": "payments-api",
        "coverage": "5 of 5",
        "covPct": "100%",
        "covFg": "#16A34A",
        "duration": "41.2s",
        "timestamp": "2026-09-15 13:45:00 UTC"
      },
      {
        "id": "run_ghi789",
        "outcome": "Withheld",
        "bg": "#FFF1F2",
        "fg": "#9F1239",
        "question": "Is the current error rate unusual for this time of day?",
        "service": "api-gateway",
        "coverage": "2 of 5",
        "covPct": "40%",
        "covFg": "#E11D48",
        "duration": "120.5s",
        "timestamp": "2026-09-15 12:30:00 UTC"
      },
      {
        "id": "run_jkl012",
        "outcome": "Verified",
        "bg": "#ECFDF5",
        "fg": "#15803D",
        "question": "Did the database schema change cause query slowness?",
        "service": "postgres-primary",
        "coverage": "5 of 5",
        "covPct": "100%",
        "covFg": "#16A34A",
        "duration": "52.1s",
        "timestamp": "2026-09-15 11:15:00 UTC"
      }
    ]
  }
}
```

**Notes:**
- Sorted by recency (newest first)
- Outcome states: "Verified" (green), "Withheld" (red), "Running" (blue), "Paused" (orange)
- Coverage calculated as sources examined / required sources
- Clicking row should open run detail/dossier view

---

## Error Response Format

All error responses follow this structure:

```json
{
  "status": "error",
  "code": "ERROR_CODE_HERE",
  "message": "Human-readable error message",
  "details": {
    "field": "fieldName (optional, for validation errors)",
    "validation": ["error details array"]
  },
  "timestamp": "2026-09-15T10:30:00Z"
}
```

**Common Error Codes:**

| Code | HTTP Status | Description |
|------|------------|-------------|
| INVALID_CREDENTIALS | 401 | Email/password incorrect |
| SESSION_EXPIRED | 401 | Auth token expired; refresh required |
| UNAUTHORIZED | 403 | User lacks permission for resource |
| NOT_FOUND | 404 | Requested resource doesn't exist |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests; retry after N seconds |
| INTERNAL_SERVER_ERROR | 500 | Unspecified server error |
| SERVICE_UNAVAILABLE | 503 | Backend service temporarily down |

---

## Mock Data for Frontend (Until Backend Ready)

Use this mock data structure in React state for development/demo purposes:

### Mock Auth User
```javascript
const mockUser = {
  id: "user_12345",
  email: "demo@bank.example",
  firstName: "John",
  lastName: "Doe",
  role: "responder",
  avatar: "JD"
};
```

### Mock Login Credentials
```javascript
const mockCredentials = {
  email: "demo@bank.example",
  password: "password123"
};
```

### Mock Dashboard Data
See individual endpoint responses above for KPI, chart, sources, queue, and runs mock data.

---

## Security Headers Required

All responses should include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## Encryption/Decryption (Optional)

If `VITE_ENCRYPTION_KEY` environment variable is set in frontend:

**Request Encryption:**
- Payload encrypted with AES-GCM using key from env var
- Encrypted payload sent as `{ encrypted: "base64_cipher_text", iv: "base64_iv", tag: "base64_tag" }`
- Backend should detect and decrypt

**Response Encryption:**
- Backend detects encryption header and encrypts response similarly
- Frontend decrypts response before parsing JSON

---

## Rate Limiting

- **Login endpoint:** 5 attempts per IP per 15 minutes (return 429 after limit)
- **Other endpoints:** 100 requests per user per minute (return 429 after limit)
- **Reset time:** Reset counters at 00:00 UTC daily

---

## Data Retention & Compliance

- **Auth tokens:** Clear on logout or expiration
- **Session logs:** Retained for 90 days in audit log
- **User actions:** Every dashboard query logged with timestamp, user ID, endpoint, response time
- **GDPR:** Implement data export and deletion endpoints (TBD in phase 2)

---

## Testing Checklist for Backend

- [ ] Login with valid credentials returns user + session token
- [ ] Login with invalid credentials returns 401 error
- [ ] SSO callback successfully exchanges code for session token
- [ ] Token refresh on 401 returns new valid token
- [ ] Logout clears session server-side
- [ ] Dashboard stats endpoint returns KPI data
- [ ] Evidence sources endpoint returns status for each source
- [ ] Attention queue returns runs sorted by priority
- [ ] Recent runs endpoint returns sorted by timestamp (descending)
- [ ] All responses encrypted if frontend sends encryption header
- [ ] Rate limiting enforced on login endpoint
- [ ] CSRF token validation on POST requests
- [ ] HTTP security headers included in all responses

---

## Questions for Backend Team

1. **Okta Config:** What are the Okta tenant URL, client ID, and expected redirect URI?
2. **Database:** Where should session tokens be stored? (Redis, database, JWT stateless?)
3. **Password Reset:** How long should reset tokens remain valid?
4. **MFA:** Should 2FA be enforced on first login or optional?
5. **Data Freshness:** Should dashboard stats be real-time or cached? If cached, what TTL?
6. **Audit Logging:** What backend event should be logged for each dashboard query?
7. **WebSocket Support:** Will real-time updates to KPIs or Attention Queue use WebSocket or polling?
8. **API Versioning:** Should endpoints use URL versioning (e.g., /api/v1/auth/login)?

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-15  
**Status:** Ready for Backend Implementation
