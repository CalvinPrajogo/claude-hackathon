# MadSocial Backend - Ready to Use! 🚀

## ✅ Current Status

**Backend Server:** Running at `http://localhost:3000`
**Database:** PostgreSQL (Docker container `pg-practice`)
**Status:** ✅ Fully operational and frontend-compatible

## 🎯 What's Working

### Database
- ✅ PostgreSQL running in Docker
- ✅ Database `madsocial` created
- ✅ All tables migrated with frontend fields
- ✅ Test data populated

### API Endpoints
All endpoints tested and working:

| Endpoint | Status | Features |
|----------|--------|----------|
| `GET /health` | ✅ | Health check |
| `POST /api/users/signup` | ✅ | User registration |
| `POST /api/users/login` | ✅ | Authentication |
| `POST /api/events` | ✅ | Create events with category |
| `GET /api/events/today` | ✅ | Get today's events |
| `GET /api/events/:id` | ✅ | Event details with pregames |
| `POST /api/pregames` | ✅ | Create pregames with phone |
| `POST /api/pregames/:id/join` | ✅ | Join with bringing items |
| `POST /api/pregames/:id/request` | ✅ | Request with full details |
| `GET /api/mutuals/event/:id` | ✅ | Mutual overlaps |

### Frontend Compatibility
- ✅ All HostPregameForm fields supported
- ✅ All JoinPregameForm fields supported
- ✅ Event categories supported
- ✅ Phone numbers stored
- ✅ Bringing items tracked
- ✅ Group sizes recorded

## 📝 Quick Start

### Start the Backend
```bash
cd /Users/soumya/Developer/claude
npm run dev
```

Server runs at: `http://localhost:3000`

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Expected: {"status":"OK","message":"MadSocial API is running"}
```

### View Database
```bash
npm run prisma:studio
```

Opens GUI at `http://localhost:5555`

## 🔗 Connect Frontend

### 1. Update Frontend API URL

In your frontend (`/Users/soumya/Developer/claude-hackathon/madsocial`):

Create or update `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Example API Integration

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Signup
export async function signup(userData) {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// Create Event
export async function createEvent(eventData, token) {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...eventData,
      vibeTags: eventData.tags, // Map tags to vibeTags
      date: new Date(eventData.date).toISOString()
    })
  });
  return response.json();
}

// Join Pregame
export async function joinPregame(pregameId, joinData, token) {
  const response = await fetch(`${API_URL}/pregames/${pregameId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bringing: [...joinData.bringing, ...joinData.customItems],
      groupSize: joinData.groupSize,
      message: joinData.message,
      phoneNumber: joinData.phoneNumber
    })
  });
  return response.json();
}
```

## 📊 Test Data Available

### Users
1. **Test User**
   - Email: `test@wisc.edu`
   - Password: `password123`
   - Token in QUICK_START.md

2. **Jane Smith**
   - Email: `jane@wisc.edu`
   - Password: `password123`

### Events
- "Badgers vs Iowa - Camp Randall" (Game category)
- "Homecoming Game 2024"

### Pregames
- "Lakeshore Tailgate" (OPEN, with phone number)
- "Pre-game at Sellery"

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `QUICK_START.md` | Quick reference |
| `SETUP_GUIDE.md` | Detailed setup |
| `API_DOCUMENTATION.md` | Complete API docs |
| `ARCHITECTURE.md` | Technical details |
| `FRONTEND_INTEGRATION.md` | **⭐ Start here for frontend** |
| `CHANGES_SUMMARY.md` | What changed |

## 🎨 Frontend Integration Checklist

- [ ] Update API base URL in frontend
- [ ] Install axios or fetch wrapper
- [ ] Create API service layer
- [ ] Add token storage (localStorage)
- [ ] Replace mock data with API calls
- [ ] Transform date/time formats
- [ ] Map field names (meetingLocation → location)
- [ ] Calculate derived fields (status, friendsGoing)
- [ ] Add error handling
- [ ] Test all user flows

## 🔧 Common Commands

```bash
# Start backend
npm run dev

# View database
npm run prisma:studio

# Run migrations
npm run prisma:migrate

# Regenerate Prisma client
npm run prisma:generate

# Build for production
npm run build

# Start production
npm start
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Database Connection Issues
```bash
docker ps | grep postgres  # Check if running
docker start pg-practice   # Start if stopped
```

### CORS Errors
Backend is configured for `http://localhost:5173`. If your frontend runs on a different port, update `.env`:
```env
CORS_ORIGIN=http://localhost:YOUR_PORT
```

### Migration Errors
```bash
# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Or manually in Docker
docker exec -i pg-practice psql -U soumya -d madsocial
```

## 🌟 Key Features

### Authentication
- JWT-based authentication
- 7-day token expiration
- Secure password hashing (bcrypt)

### Pregames
- Two access types: OPEN and REQUEST_ONLY
- Host approval workflow
- Capacity tracking
- Phone number for contact

### Join Requests
- Track what users are bringing
- Group size management
- Messages to hosts
- Contact information

### Mutual Overlaps
- Same dorm detection
- Same major detection
- Same year detection

## 🚀 Next Steps

1. **Start Backend** (if not running)
   ```bash
   npm run dev
   ```

2. **Read Integration Guide**
   - Open `FRONTEND_INTEGRATION.md`
   - Follow step-by-step instructions

3. **Update Frontend**
   - Create API service layer
   - Replace mock data
   - Add authentication

4. **Test Integration**
   - Sign up new user
   - Create event
   - Create pregame
   - Join pregame
   - View mutuals

## 📞 Support

**Documentation:**
- Frontend integration: `FRONTEND_INTEGRATION.md`
- API reference: `API_DOCUMENTATION.md`
- Architecture: `ARCHITECTURE.md`

**Quick Tests:**
```bash
# Health check
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test2@wisc.edu","password":"pass123","year":"Sophomore","major":"CS","dorm":"Witte"}'
```

## ✨ Status Summary

```
Backend Status:       ✅ Running
Database:             ✅ Connected
Migrations:           ✅ Applied
Test Data:            ✅ Loaded
API Endpoints:        ✅ Working
Frontend Compatible:  ✅ Ready
Documentation:        ✅ Complete
```

**You're all set! Check `FRONTEND_INTEGRATION.md` to connect your frontend.** 🎉
