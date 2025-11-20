# Frontend Integration Guide

This document explains how the backend has been adapted to work seamlessly with the MadSocial React frontend.

## Changes Made for Frontend Compatibility

### 1. Database Schema Updates

**Event Model:**
- ✅ Added `description` (string, optional)
- ✅ Added `category` (string) - Party, Bar/Club, Game, Concert, House Event
- ✅ Indexed `category` for fast filtering

**Pregame Model:**
- ✅ Added `phoneNumber` (string) - Host contact information
- ✅ Added `requirements` (string, optional) - Requirements for request-only pregames

**JoinRequest Model:**
- ✅ Added `bringing` (string[]) - Items user is bringing (beer, food, drinks, music, etc.)
- ✅ Added `groupSize` (int, default: 1) - Number of people in user's group
- ✅ Added `message` (string, optional) - Message to host
- ✅ Added `phoneNumber` (string) - User's contact information

### 2. API Endpoint Updates

#### Events

**POST /api/events**
```json
{
  "title": "Badgers vs Iowa - Camp Randall",
  "date": "2025-11-20T19:00:00Z",
  "location": "Camp Randall Stadium",
  "vibeTags": ["Game", "High Energy", "Tailgate"],
  "description": "Big ten rivalry game! Go Badgers!",
  "category": "Game"
}
```

#### Pregames

**POST /api/pregames**
```json
{
  "title": "Lakeshore Tailgate - Dejope 6:30PM",
  "description": "Burgers, beers, and cornhole before the game!",
  "meetingTime": "2025-11-20T18:30:00Z",
  "meetingLocation": "Dejope Hall Parking Lot",
  "accessType": "OPEN",
  "capacity": 20,
  "phoneNumber": "(608) 555-1234",
  "requirements": null,
  "eventId": "event-id-here"
}
```

**POST /api/pregames/:id/join** (for OPEN pregames)
```json
{
  "bringing": ["beer", "food"],
  "groupSize": 2,
  "message": "Excited to tailgate! Bringing my roommate.",
  "phoneNumber": "(608) 555-5678"
}
```

**POST /api/pregames/:id/request** (for REQUEST_ONLY pregames)
```json
{
  "bringing": ["beer", "music"],
  "groupSize": 1,
  "message": "Would love to join! Mutual friends with Sarah and Mike.",
  "phoneNumber": "(608) 555-9999"
}
```

### 3. Frontend Type Mapping

**Frontend → Backend Mapping:**

```typescript
// Frontend types (from src/types.ts)
interface SocialEvent {
  id: string;
  title: string;
  time: string; // "7:00 PM"
  location: string;
  tags: string[]; // → vibeTags
  pregameCount: number; // calculated
  friendsGoing: number; // calculated from mutuals
  description?: string;
  category: 'Party' | 'Bar/Club' | 'Game' | 'Concert' | 'House Event';
}

interface Pregame {
  id: string;
  eventId: string;
  title: string;
  host: Host;
  location: string; // → meetingLocation
  time: string; // → meetingTime (formatted)
  capacity: number;
  currentAttendees: number; // calculated
  mutualFriends: Friend[]; // from mutuals API
  status: 'open' | 'request-only' | 'full'; // → accessType + capacity check
  description?: string;
}

interface Host {
  id: string;
  name: string;
  avatar: string; // → avatarUrl
  year: string;
  major: string;
}

interface JoinRequestData {
  bringing: string[]; // ✅ Now stored in backend
  customItems: string[]; // Merge with bringing
  groupSize: number; // ✅ Now stored in backend
  message: string; // ✅ Now stored in backend
  phoneNumber: string; // ✅ Now stored in backend
}
```

## Response Shape Transformations

The frontend expects slightly different data shapes. Here's how to transform backend responses:

### Event List Response

**Backend Response:**
```json
{
  "id": "...",
  "title": "...",
  "date": "2025-11-20T19:00:00.000Z",
  "location": "...",
  "vibeTags": ["..."],
  "category": "Game",
  "pregameCount": 5,
  "totalAttendees": 42
}
```

**Frontend Transformation:**
```typescript
// Transform date to time string
const event = {
  ...backendEvent,
  time: new Date(backendEvent.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }), // "7:00 PM"
  tags: backendEvent.vibeTags,
  friendsGoing: backendEvent.totalAttendees // or calculate from mutuals
};
```

### Pregame Response

**Backend Response:**
```json
{
  "id": "...",
  "title": "...",
  "meetingTime": "2025-11-20T18:30:00.000Z",
  "meetingLocation": "...",
  "accessType": "OPEN",
  "capacity": 20,
  "host": {...},
  "attendeeCount": 12
}
```

**Frontend Transformation:**
```typescript
const pregame = {
  ...backendPregame,
  location: backendPregame.meetingLocation,
  time: new Date(backendPregame.meetingTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }),
  currentAttendees: backendPregame.attendeeCount,
  status: backendPregame.accessType === 'OPEN'
    ? (backendPregame.attendeeCount >= backendPregame.capacity ? 'full' : 'open')
    : 'request-only'
};
```

## Frontend Integration Checklist

### Required Changes in Frontend

- [ ] **Update API Base URL**
  ```typescript
  const API_BASE_URL = 'http://localhost:3000/api';
  ```

- [ ] **Add Authentication Headers**
  ```typescript
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  ```

- [ ] **Transform Date/Time Fields**
  - Convert ISO datetime strings to display format ("7:00 PM")
  - Use `new Date().toLocaleTimeString()` or date library (date-fns, dayjs)

- [ ] **Map Field Names**
  - `vibeTags` ↔ `tags`
  - `meetingLocation` ↔ `location`
  - `meetingTime` ↔ `time`
  - `avatarUrl` ↔ `avatar`
  - `attendeeCount` ↔ `currentAttendees`

- [ ] **Calculate Derived Fields**
  - `status`: Determine from `accessType` and capacity
  - `pregameCount`: Get from event response
  - `friendsGoing`: Calculate from mutuals endpoint

- [ ] **Handle Join Request Submission**
  ```typescript
  // Merge bringing and customItems
  const bringing = [...selectedItems, ...customItems];

  const joinData = {
    bringing,
    groupSize,
    message,
    phoneNumber
  };
  ```

### API Integration Example

```typescript
// Create Event
async function createEvent(eventData) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: eventData.title,
      date: eventData.date, // ISO string
      location: eventData.location,
      vibeTags: eventData.tags,
      description: eventData.description,
      category: eventData.category
    })
  });
  return response.json();
}

// Get Today's Events
async function getTodayEvents() {
  const response = await fetch(`${API_BASE_URL}/events/today`);
  const events = await response.json();

  // Transform for frontend
  return events.map(event => ({
    ...event,
    time: formatTime(event.date),
    tags: event.vibeTags,
    friendsGoing: event.totalAttendees
  }));
}

// Join Pregame
async function joinPregame(pregameId, joinData) {
  const response = await fetch(
    `${API_BASE_URL}/pregames/${pregameId}/join`,
    {
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
    }
  );
  return response.json();
}

// Get Mutual Friends
async function getMutualFriends(eventId) {
  const response = await fetch(
    `${API_BASE_URL}/mutuals/event/${eventId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  const mutuals = await response.json();

  // Transform for frontend
  return mutuals.map(mutual => ({
    id: mutual.userId,
    name: mutual.name,
    avatar: mutual.avatarUrl || '👤',
    mutualCount: mutual.overlaps.length
  }));
}
```

## Testing with Frontend

### 1. Start Both Servers

```bash
# Backend (Terminal 1)
cd /Users/soumya/Developer/claude
npm run dev

# Frontend (Terminal 2)
cd /Users/soumya/Developer/claude-hackathon/madsocial
npm run dev
```

### 2. Update Frontend Environment

Create `.env` in frontend folder:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Test Flow

1. **Sign up** → Store token
2. **Create event** → Verify in backend
3. **Create pregame** → Include phone number
4. **Join pregame** → Send all required fields
5. **View mutuals** → Check overlap calculation

## Common Issues & Solutions

### CORS Errors
```typescript
// Backend already configured in src/index.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

Make sure frontend URL matches `CORS_ORIGIN` in backend `.env`.

### Date Format Issues
- Backend expects ISO 8601: `"2025-11-20T19:00:00Z"`
- Frontend displays: `"7:00 PM"`
- Use date library for consistent formatting

### Status Calculation
```typescript
function calculatePregameStatus(pregame) {
  if (pregame.accessType === 'REQUEST_ONLY') {
    return 'request-only';
  }
  if (pregame.capacity && pregame.attendeeCount >= pregame.capacity) {
    return 'full';
  }
  return 'open';
}
```

### Mutual Friends vs Overlaps
- Backend returns "overlaps" (same dorm, major, year)
- Frontend expects "mutualCount"
- Transform: `mutualCount = user.overlaps.length`

## Next Steps

1. Create API service layer in frontend (`/src/services/api.ts`)
2. Replace mock data with real API calls
3. Implement token storage (localStorage/sessionStorage)
4. Add error handling and loading states
5. Test all user flows end-to-end

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API is running: `http://localhost:3000/health`
3. Check network tab for request/response
4. Validate token is being sent
5. Review backend logs for errors
