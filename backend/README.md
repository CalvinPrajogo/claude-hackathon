# MadSocial Backend

A Madison-only social platform backend focused on social events, pregames, and connecting students.

## Features

- User authentication with JWT
- Event management
- Pregame creation and management
- Join request system for exclusive pregames
- Mutual overlaps detection (same dorm, major, or year)
- Host approval flows
- RESTful API

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + bcrypt

## Project Structure

```
src/
├── controllers/       # Request handlers
├── services/         # Business logic
├── routes/           # API route definitions
├── middleware/       # Auth and error handling
├── validators/       # Zod validation schemas
├── utils/            # JWT and password utilities
└── index.ts          # Application entry point

prisma/
└── schema.prisma     # Database schema
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```npm 

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://soumya:claude@localhost:5432/madsocial?schema=public"
JWT_SECRET="soumya_claude"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

## Development

Start the development server:
```bash
npm run dev
```

## Build & Production

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile (protected)

### Events

- `GET /api/events/today` - Get today's events
- `GET /api/events/:eventId` - Get event details with pregames (protected)
- `POST /api/events` - Create event (protected)

### Pregames

- `POST /api/pregames` - Create pregame (protected)
- `GET /api/pregames/event/:eventId` - Get all pregames for event (protected)
- `POST /api/pregames/:id/join` - Join OPEN pregame (protected)
- `POST /api/pregames/:id/request` - Request to join REQUEST_ONLY pregame (protected)
- `GET /api/pregames/:id/host` - Get host info (attendees, requests) (protected)
- `POST /api/pregames/:id/approve` - Approve join request (protected)
- `POST /api/pregames/:id/decline` - Decline join request (protected)

### Mutuals

- `GET /api/mutuals/event/:eventId` - Get mutual overlaps in event (protected)
- `GET /api/mutuals/pregame/:pregameId` - Get mutual overlaps in pregame (protected)

## Database Schema

### User
- id, name, email, password (hashed)
- year, major, dorm, bio, avatarUrl
- Relations: hostedPregames, joinedPregames, joinRequests

### Event
- id, title, date, location, vibeTags
- Relations: pregames

### Pregame
- id, title, description, meetingTime, meetingLocation
- accessType (OPEN | REQUEST_ONLY), capacity
- Relations: host, event, attendees, joinRequests

### JoinRequest
- id, status (PENDING | APPROVED | DECLINED)
- Relations: user, pregame

## Business Rules

1. Users only see mutuals inside an event after clicking that event
2. Users only see pregame attendees after opening a specific pregame
3. Only hosts can see join requests
4. OPEN pregames: users join instantly
5. REQUEST_ONLY pregames: users must request, host must approve
6. Every pregame belongs to exactly one event
7. Capacity is optional

## Security

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Protected routes require Bearer token authentication
- Input validation with Zod
- SQL injection prevention via Prisma
- CORS configured for frontend origin

## Performance Optimizations

- Database indexes on: userId, hostId, eventId, date, email, status
- Efficient queries with Prisma includes
- Transaction support for approval flows

## License

MIT
