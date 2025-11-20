# MadSocial API Documentation

Base URL: `http://localhost:3000/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Events](#events)
4. [Pregames](#pregames)
5. [Mutuals](#mutuals)
6. [Error Responses](#error-responses)

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Users

### POST /users/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@wisc.edu",
  "password": "securepass123",
  "year": "Sophomore",
  "major": "Computer Science",
  "dorm": "Sellery Hall",
  "bio": "Love sports and music",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `year`: Required, one of: "Freshman", "Sophomore", "Junior", "Senior"
- `major`: Required, non-empty string
- `dorm`: Required, non-empty string
- `bio`: Optional string
- `avatarUrl`: Optional valid URL

**Success Response (201):**
```json
{
  "user": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@wisc.edu",
    "year": "Sophomore",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "bio": "Love sports and music",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-20T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Email already in use
- `400`: Validation errors

---

### POST /users/login
Login an existing user.

**Request Body:**
```json
{
  "email": "john@wisc.edu",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@wisc.edu",
    "year": "Sophomore",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "bio": "Love sports and music",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-20T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid credentials

---

### GET /users/:id
Get user profile by ID. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "clx123abc",
  "name": "John Doe",
  "email": "john@wisc.edu",
  "year": "Sophomore",
  "major": "Computer Science",
  "dorm": "Sellery Hall",
  "bio": "Love sports and music",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-20T12:00:00Z"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `404`: User not found

---

## Events

### GET /events/today
Get all events happening today.

**Success Response (200):**
```json
[
  {
    "id": "clx456def",
    "title": "Homecoming Party",
    "date": "2024-01-20T19:00:00Z",
    "location": "Camp Randall Stadium",
    "vibeTags": ["party", "sports", "social"],
    "pregameCount": 5,
    "totalAttendees": 42
  },
  {
    "id": "clx789ghi",
    "title": "Concert at Memorial Union",
    "date": "2024-01-20T20:00:00Z",
    "location": "Memorial Union",
    "vibeTags": ["music", "concert"],
    "pregameCount": 2,
    "totalAttendees": 18
  }
]
```

---

### GET /events/:eventId
Get detailed event information with all pregames. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "clx456def",
  "title": "Homecoming Party",
  "date": "2024-01-20T19:00:00Z",
  "location": "Camp Randall Stadium",
  "vibeTags": ["party", "sports", "social"],
  "pregames": [
    {
      "id": "clx111aaa",
      "title": "Pre-party at Sellery",
      "description": "Chill vibes before the game",
      "meetingTime": "2024-01-20T17:00:00Z",
      "meetingLocation": "Sellery Hall Lounge",
      "accessType": "OPEN",
      "capacity": 30,
      "host": {
        "id": "clx123abc",
        "name": "John Doe",
        "major": "Computer Science",
        "dorm": "Sellery Hall",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "attendeeCount": 15,
      "attendees": [
        {
          "id": "clx222bbb",
          "name": "Jane Smith",
          "major": "Biology",
          "dorm": "Sellery Hall",
          "year": "Junior",
          "avatarUrl": "https://example.com/jane.jpg"
        }
      ],
      "requestsPending": 3
    }
  ]
}
```

**Note:** `requestsPending` only appears if the current user is the host of that pregame.

**Error Responses:**
- `401`: No token provided or invalid token
- `404`: Event not found

---

### POST /events
Create a new event. (Protected - typically admin use)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Spring Bash",
  "date": "2024-04-15T18:00:00Z",
  "location": "Library Mall",
  "vibeTags": ["party", "music", "outdoor"]
}
```

**Success Response (201):**
```json
{
  "id": "clx999zzz",
  "title": "Spring Bash",
  "date": "2024-04-15T18:00:00Z",
  "location": "Library Mall",
  "vibeTags": ["party", "music", "outdoor"],
  "createdAt": "2024-01-20T12:00:00Z"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Validation errors

---

## Pregames

### POST /pregames
Create a new pregame. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Pre-party at Witte",
  "description": "Bring your friends!",
  "meetingTime": "2024-01-20T17:30:00Z",
  "meetingLocation": "Witte Hall 4th Floor Lounge",
  "accessType": "REQUEST_ONLY",
  "capacity": 25,
  "eventId": "clx456def"
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `description`: Optional string
- `meetingTime`: Required, ISO 8601 datetime
- `meetingLocation`: Required, non-empty string
- `accessType`: Optional, "OPEN" or "REQUEST_ONLY" (default: "OPEN")
- `capacity`: Optional, positive integer
- `eventId`: Required, valid event ID

**Success Response (201):**
```json
{
  "id": "clx333ccc",
  "title": "Pre-party at Witte",
  "description": "Bring your friends!",
  "meetingTime": "2024-01-20T17:30:00Z",
  "meetingLocation": "Witte Hall 4th Floor Lounge",
  "accessType": "REQUEST_ONLY",
  "capacity": 25,
  "createdAt": "2024-01-20T12:00:00Z",
  "hostId": "clx123abc",
  "host": {
    "id": "clx123abc",
    "name": "John Doe",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "eventId": "clx456def",
  "event": {
    "id": "clx456def",
    "title": "Homecoming Party",
    "date": "2024-01-20T19:00:00Z",
    "location": "Camp Randall Stadium",
    "vibeTags": ["party", "sports"]
  }
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Event not found or validation errors

---

### GET /pregames/event/:eventId
Get all pregames for a specific event. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "clx111aaa",
    "title": "Pre-party at Sellery",
    "description": "Chill vibes before the game",
    "meetingTime": "2024-01-20T17:00:00Z",
    "meetingLocation": "Sellery Hall Lounge",
    "accessType": "OPEN",
    "capacity": 30,
    "host": {
      "id": "clx123abc",
      "name": "John Doe",
      "major": "Computer Science",
      "dorm": "Sellery Hall",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "attendeeCount": 15,
    "attendees": [...]
  }
]
```

**Error Responses:**
- `401`: No token provided or invalid token

---

### POST /pregames/:id/join
Join an OPEN pregame instantly. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Successfully joined pregame"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Pregame not found
- `400`: This pregame requires a join request (use /request instead)
- `400`: Pregame is at full capacity
- `400`: You are already attending this pregame

---

### POST /pregames/:id/request
Request to join a REQUEST_ONLY pregame. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (201):**
```json
{
  "id": "clx555eee",
  "status": "PENDING",
  "createdAt": "2024-01-20T12:00:00Z",
  "userId": "clx123abc",
  "pregameId": "clx333ccc"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Pregame not found
- `400`: This pregame does not require a join request (use /join instead)
- `400`: You are already attending this pregame
- `400`: You already have a pending request for this pregame

---

### GET /pregames/:id/host
Get host-only information (attendees and join requests). (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "clx333ccc",
  "title": "Pre-party at Witte",
  "attendees": [
    {
      "id": "clx222bbb",
      "name": "Jane Smith",
      "email": "jane@wisc.edu",
      "major": "Biology",
      "dorm": "Witte Hall",
      "year": "Junior",
      "avatarUrl": "https://example.com/jane.jpg"
    }
  ],
  "joinRequests": [
    {
      "id": "clx555eee",
      "user": {
        "id": "clx666fff",
        "name": "Bob Johnson",
        "email": "bob@wisc.edu",
        "major": "Engineering",
        "dorm": "Chadbourne",
        "year": "Sophomore",
        "avatarUrl": "https://example.com/bob.jpg"
      },
      "status": "PENDING",
      "createdAt": "2024-01-20T12:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `403`: Only the host can view this information
- `400`: Pregame not found

---

### POST /pregames/:id/approve
Approve a join request. (Protected - Host only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "requestId": "clx555eee"
}
```

**Success Response (200):**
```json
{
  "message": "Join request approved"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Join request not found
- `400`: Only the host can approve join requests
- `400`: This request has already been processed
- `400`: Pregame is at full capacity

---

### POST /pregames/:id/decline
Decline a join request. (Protected - Host only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "requestId": "clx555eee"
}
```

**Success Response (200):**
```json
{
  "message": "Join request declined"
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Join request not found
- `400`: Only the host can decline join requests
- `400`: This request has already been processed

---

## Mutuals

### GET /mutuals/event/:eventId
Get all users in the event with mutual overlaps (same dorm, major, or year). (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "userId": "clx222bbb",
    "name": "Jane Smith",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "year": "Sophomore",
    "avatarUrl": "https://example.com/jane.jpg",
    "overlaps": ["Same dorm", "Same major", "Same year"]
  },
  {
    "userId": "clx777ggg",
    "name": "Alice Brown",
    "major": "Biology",
    "dorm": "Sellery Hall",
    "year": "Junior",
    "avatarUrl": "https://example.com/alice.jpg",
    "overlaps": ["Same dorm"]
  }
]
```

**Note:** Only returns users with at least one overlap.

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Event not found

---

### GET /mutuals/pregame/:pregameId
Get all users in the pregame with mutual overlaps. (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "userId": "clx222bbb",
    "name": "Jane Smith",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "year": "Sophomore",
    "avatarUrl": "https://example.com/jane.jpg",
    "overlaps": ["Same major", "Same dorm"]
  }
]
```

**Error Responses:**
- `401`: No token provided or invalid token
- `400`: Pregame not found

---

## Error Responses

All error responses follow this format:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

or

```json
{
  "error": "Pregame is at full capacity"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

or

```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Only the host can view this information"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message (development only)"
}
```

---

## Common Workflows

### 1. User Registration & Login
```
1. POST /api/users/signup → Receive token
2. Store token in client
3. Use token for all subsequent requests
```

### 2. Browse Today's Events
```
1. GET /api/events/today → Get event list
2. GET /api/events/:eventId → Get event details + pregames
3. GET /api/mutuals/event/:eventId → See mutual overlaps
```

### 3. Join an OPEN Pregame
```
1. POST /api/pregames/:id/join → Instant join
```

### 4. Request to Join REQUEST_ONLY Pregame
```
1. POST /api/pregames/:id/request → Create pending request
2. Wait for host approval
```

### 5. Host Managing Pregame
```
1. GET /api/pregames/:id/host → View attendees and requests
2. POST /api/pregames/:id/approve → Approve request
   OR
   POST /api/pregames/:id/decline → Decline request
```

### 6. Create a Pregame
```
1. Find event ID from today's events
2. POST /api/pregames → Create pregame
3. GET /api/pregames/:id/host → Monitor join requests
```

---

## Rate Limiting (Future)
Consider implementing rate limiting for production:
- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- General API: 100 requests per 15 minutes

---

## Pagination (Future)
For large datasets, consider adding pagination:
```
GET /api/events?page=1&limit=10
```

Response:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```
