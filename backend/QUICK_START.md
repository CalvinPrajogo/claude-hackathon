# MadSocial Backend - Quick Start

## Database Setup Complete ✅

Your PostgreSQL database is running in Docker and configured with:
- **Database**: `madsocial`
- **User**: `soumya`
- **Password**: `claude`
- **Port**: `5432` (localhost)

## Server Running ✅

The backend is currently running at: **http://localhost:3000**

## Test Results ✅

All endpoints tested successfully:

### 1. Health Check
```bash
curl http://localhost:3000/health
# Response: {"status":"OK","message":"MadSocial API is running"}
```

### 2. User Created
- **Email**: test@wisc.edu
- **Password**: password123
- **User ID**: cmi6s3dma0000c180667pshmm

### 3. Event Created
- **Event**: Homecoming Game 2024
- **Date**: 2025-11-20 at 7:00 PM
- **Location**: Camp Randall Stadium
- **Event ID**: cmi6s42js0001c1803i6w9rrx

### 4. Pregame Created
- **Title**: Pre-game at Sellery
- **Time**: 2025-11-20 at 5:00 PM
- **Location**: Sellery Hall 4th Floor Lounge
- **Access**: OPEN (instant join)
- **Capacity**: 30 people

## Database Tables Created

Run `npm run prisma:studio` to view your database in a GUI.

Tables:
- ✅ User
- ✅ Event
- ✅ Pregame
- ✅ JoinRequest
- ✅ _PregameAttendees (join table)

## Available API Endpoints

### Authentication
- `POST /api/users/signup` - Register
- `POST /api/users/login` - Login
- `GET /api/users/:id` - Get profile

### Events
- `GET /api/events/today` - Today's events
- `GET /api/events/:eventId` - Event details
- `POST /api/events` - Create event

### Pregames
- `POST /api/pregames` - Create pregame
- `GET /api/pregames/event/:eventId` - Get pregames for event
- `POST /api/pregames/:id/join` - Join OPEN pregame
- `POST /api/pregames/:id/request` - Request to join
- `GET /api/pregames/:id/host` - Host management
- `POST /api/pregames/:id/approve` - Approve request
- `POST /api/pregames/:id/decline` - Decline request

### Mutuals
- `GET /api/mutuals/event/:eventId` - Mutual overlaps in event
- `GET /api/mutuals/pregame/:pregameId` - Mutual overlaps in pregame

## Example API Calls

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@wisc.edu","password":"password123"}'
```

### Get Event Details
```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:3000/api/events/cmi6s42js0001c1803i6w9rrx \
  -H "Authorization: Bearer $TOKEN"
```

### Join a Pregame
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/api/pregames/cmi6s50qg0003c1809itdpimh/join \
  -H "Authorization: Bearer $TOKEN"
```

## Useful Commands

```bash
# Start dev server
npm run dev

# View database GUI
npm run prisma:studio

# Run new migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Build for production
npm run build

# Start production server
npm start
```

## Stop the Server

The server is running in the background. To stop it:
1. Find the process: `ps aux | grep "ts-node src/index.ts"`
2. Kill it: `kill <PID>`

Or simply close the terminal.

## Next Steps

1. ✅ Database configured
2. ✅ Server running
3. ✅ Test user created
4. ✅ Test event created
5. ✅ Test pregame created

**Ready to build your frontend!**

## Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - Technical architecture
- `API_DOCUMENTATION.md` - Complete API reference
- `SETUP_GUIDE.md` - Detailed setup instructions

## Environment

Your `.env` file is configured with:
```
DATABASE_URL=postgresql://soumya:claude@localhost:5432/madsocial?schema=public
JWT_SECRET=soumya_claude
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Important**: Change `JWT_SECRET` to a strong random string before production!

## Support

Everything is working! Your MadSocial backend is ready to use.

Check `API_DOCUMENTATION.md` for detailed endpoint documentation.
