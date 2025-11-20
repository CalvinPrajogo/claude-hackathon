# MadSocial Backend Architecture

## Overview

MadSocial is a clean, modular backend built with TypeScript, Express, and Prisma following industry best practices.

## Architecture Patterns

### 1. Layered Architecture

```
Routes → Controllers → Services → Database (Prisma)
         ↓
    Middleware (Auth, Validation, Error Handling)
```

**Routes** (`/routes`)
- Define API endpoints
- Map HTTP methods to controller functions
- Apply middleware (authentication, validation)

**Controllers** (`/controllers`)
- Handle HTTP request/response
- Validate input using Zod schemas
- Call service methods
- Return appropriate HTTP status codes
- Thin layer - minimal business logic

**Services** (`/services`)
- Contain all business logic
- Interact with database via Prisma
- Handle complex operations and transactions
- Reusable across multiple controllers

**Middleware** (`/middleware`)
- `auth.ts`: JWT token verification
- `errorHandler.ts`: Centralized error handling

**Validators** (`/validators`)
- Zod schemas for request validation
- Type-safe input/output

**Utils** (`/utils`)
- `jwt.ts`: Token generation and verification
- `password.ts`: Password hashing and comparison

## Data Flow Examples

### User Signup Flow
```
POST /api/users/signup
  ↓
userRoutes.ts (route definition)
  ↓
UserController.signup() (validation with Zod)
  ↓
UserService.signup() (business logic)
  ↓
- Check if email exists
- Hash password
- Create user in database
- Generate JWT token
  ↓
Return { user, token }
```

### Join Pregame Flow (OPEN)
```
POST /api/pregames/:id/join
  ↓
authenticate middleware (verify JWT)
  ↓
pregameRoutes.ts
  ↓
PregameController.joinPregame()
  ↓
PregameService.joinPregame()
  ↓
- Find pregame
- Check access type (must be OPEN)
- Check capacity
- Check if already attending
- Add user to attendees
  ↓
Return success message
```

### Host Approve Request Flow
```
POST /api/pregames/:id/approve
  ↓
authenticate middleware
  ↓
PregameController.approveJoinRequest()
  ↓
PregameService.approveJoinRequest()
  ↓
- Find join request
- Verify user is host
- Check request status
- Check capacity
- Use transaction:
  - Update request status to APPROVED
  - Add user to pregame attendees
  ↓
Return success message
```

## Data Models

### User
```typescript
{
  id: string (cuid)
  name: string
  email: string (unique)
  password: string (hashed)
  year: string
  major: string
  dorm: string
  bio?: string
  avatarUrl?: string
  createdAt: DateTime

  // Relations
  hostedPregames: Pregame[]
  joinedPregames: Pregame[]
  joinRequests: JoinRequest[]
}
```

### Event
```typescript
{
  id: string (cuid)
  title: string
  date: DateTime
  location: string
  vibeTags: string[]
  createdAt: DateTime

  // Relations
  pregames: Pregame[]
}
```

### Pregame
```typescript
{
  id: string (cuid)
  title: string
  description?: string
  meetingTime: DateTime
  meetingLocation: string
  accessType: OPEN | REQUEST_ONLY
  capacity?: number
  createdAt: DateTime

  // Relations
  hostId: string
  host: User
  eventId: string
  event: Event
  attendees: User[]
  joinRequests: JoinRequest[]
}
```

### JoinRequest
```typescript
{
  id: string (cuid)
  status: PENDING | APPROVED | DECLINED
  createdAt: DateTime

  // Relations
  userId: string
  user: User
  pregameId: string
  pregame: Pregame
}
```

## Authentication Flow

```
Client sends credentials
  ↓
POST /api/users/login
  ↓
Validate with Zod
  ↓
Find user by email
  ↓
Compare password with bcrypt
  ↓
Generate JWT token (7 day expiry)
  ↓
Return { user, token }

---

Protected Route Request
  ↓
Client sends: Authorization: Bearer <token>
  ↓
authenticate middleware
  ↓
Extract token from header
  ↓
Verify JWT signature
  ↓
Decode userId from token
  ↓
Attach userId to request object
  ↓
Continue to controller
```

## Mutual Overlaps System

**Option A Implementation** (MVP - based on user properties)

```typescript
// Three types of overlaps:
1. Same dorm
2. Same major
3. Same year

// Algorithm:
getMutualOverlaps(currentUserId, targetUserIds[])
  ↓
Fetch current user (dorm, major, year)
  ↓
Fetch target users
  ↓
For each target user:
  - Compare dorm → if match, add "Same dorm"
  - Compare major → if match, add "Same major"
  - Compare year → if match, add "Same year"
  ↓
Filter users with at least 1 overlap
  ↓
Return mutuals with overlap labels
```

**API Usage:**
- `GET /api/mutuals/event/:eventId` - Finds all attendees in event pregames
- `GET /api/mutuals/pregame/:pregameId` - Finds attendees in specific pregame

## Request/Response Shapes

### Today Events Response
```json
[
  {
    "id": "clx123",
    "title": "Homecoming Party",
    "date": "2024-01-20T19:00:00Z",
    "location": "Camp Randall",
    "vibeTags": ["party", "sports"],
    "pregameCount": 5,
    "totalAttendees": 42
  }
]
```

### Event Detail Response
```json
{
  "id": "clx123",
  "title": "Homecoming Party",
  "date": "2024-01-20T19:00:00Z",
  "location": "Camp Randall",
  "vibeTags": ["party", "sports"],
  "pregames": [
    {
      "id": "clx456",
      "title": "Pre-party at Sellery",
      "description": "Chill vibes before the game",
      "meetingTime": "2024-01-20T17:00:00Z",
      "meetingLocation": "Sellery Hall Lounge",
      "accessType": "OPEN",
      "capacity": 30,
      "host": {
        "id": "clx789",
        "name": "John Doe",
        "major": "Computer Science",
        "dorm": "Sellery"
      },
      "attendeeCount": 15,
      "attendees": [...],
      "requestsPending": 3  // only if current user is host
    }
  ]
}
```

### Pregame Host Info Response
```json
{
  "id": "clx456",
  "title": "Pre-party at Sellery",
  "attendees": [
    {
      "id": "clx111",
      "name": "Jane Smith",
      "email": "jane@wisc.edu",
      "major": "Biology",
      "dorm": "Sellery",
      "year": "Sophomore"
    }
  ],
  "joinRequests": [
    {
      "id": "clx999",
      "user": {
        "id": "clx888",
        "name": "Bob Johnson",
        "major": "Engineering",
        "dorm": "Witte",
        "year": "Junior"
      },
      "status": "PENDING",
      "createdAt": "2024-01-20T12:00:00Z"
    }
  ]
}
```

### Mutual Overlaps Response
```json
[
  {
    "userId": "clx111",
    "name": "Jane Smith",
    "major": "Computer Science",
    "dorm": "Sellery",
    "year": "Sophomore",
    "avatarUrl": "https://...",
    "overlaps": ["Same dorm", "Same major"]
  }
]
```

## Security Measures

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Never return password in responses

2. **JWT Security**
   - Secret key from environment variables
   - 7-day expiration
   - Verified on every protected route

3. **Input Validation**
   - Zod schemas validate all inputs
   - Type safety guaranteed
   - Prevents injection attacks

4. **Database Security**
   - Prisma prevents SQL injection
   - Parameterized queries
   - Indexes for performance

5. **Authorization**
   - Host-only endpoints verified
   - User can't approve own requests
   - User can't see other's private data

6. **CORS**
   - Configured for specific frontend origin
   - Credentials support enabled

## Performance Optimizations

### Database Indexes
```prisma
@@index([email])      // User lookups
@@index([hostId])     // Pregame host queries
@@index([eventId])    // Event pregame queries
@@index([userId])     // Join request queries
@@index([pregameId])  // Join request queries
@@index([date])       // Today's events query
@@index([status])     // Pending requests filter
@@index([meetingTime])// Upcoming pregames
```

### Query Optimization
- Use `select` to fetch only needed fields
- Use `include` for related data in single query
- Avoid N+1 queries

### Transactions
- Used for approve/decline flows
- Ensures data consistency
- Atomic operations

## Error Handling

```typescript
// Centralized error handler
errorHandler(error, req, res, next)
  ↓
Check error type
  ↓
if ZodError → 400 with validation details
if Custom Error → appropriate status
if Unknown → 500 internal server error
  ↓
Log error (development: show message)
```

## Scalability Considerations

### Current (MVP)
- Single server
- Direct database connection
- In-memory sessions

### Future Enhancements
1. **Caching**: Redis for frequently accessed data
2. **Load Balancing**: Multiple server instances
3. **Database**: Read replicas for scaling reads
4. **Queue System**: Bull/BullMQ for async jobs
5. **WebSockets**: Real-time notifications
6. **Rate Limiting**: Prevent abuse
7. **Logging**: Winston/Morgan for production logs
8. **Monitoring**: Datadog/New Relic

## Testing Strategy

### Unit Tests
- Service layer methods
- Utility functions (JWT, password)
- Validation schemas

### Integration Tests
- API endpoint flows
- Database interactions
- Authentication flows

### E2E Tests
- Complete user journeys
- Signup → Login → Join pregame → Host approve

## Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use production PostgreSQL
- [ ] Enable SSL for database
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up logging
- [ ] Enable rate limiting
- [ ] Run migrations
- [ ] Test all endpoints
- [ ] Monitor error rates

## Future Extensions

1. **Friendships System**
   - Add Friendship model
   - Friend requests
   - Mutual friends calculation

2. **Notifications**
   - Push notifications
   - Email notifications
   - Join request alerts

3. **Image Upload**
   - Avatar uploads
   - Event images
   - S3/Cloudinary integration

4. **Analytics**
   - Event popularity
   - User engagement
   - Pregame statistics

5. **Search & Filters**
   - Search events by tags
   - Filter by date/location
   - Discover pregames
