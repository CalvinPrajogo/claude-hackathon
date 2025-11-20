# MadSocial Backend - Setup Guide

Complete step-by-step guide to get the backend running locally.

## Prerequisites

- Node.js v18+ installed
- PostgreSQL v14+ installed and running
- npm or yarn package manager
- Git (optional)

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Express.js (web framework)
- Prisma (database ORM)
- TypeScript (type safety)
- Zod (validation)
- JWT & bcrypt (authentication)
- CORS (cross-origin requests)

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL:
```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download installer from postgresql.org
```

2. Create database:
```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE madsocial;

# Create user (optional)
CREATE USER madsocial_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE madsocial TO madsocial_user;

# Exit
\q
```

### Option B: PostgreSQL via Docker

```bash
docker run --name madsocial-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=madsocial \
  -p 5432:5432 \
  -d postgres:15
```

### Option C: Cloud Database (Supabase/Railway/Render)

1. Sign up for free tier
2. Create PostgreSQL database
3. Copy connection string

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/madsocial?schema=public"

# JWT secret (generate a random string)
JWT_SECRET="use-openssl-rand-base64-32-to-generate-this"

# Server port
PORT=3000

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:5173
```

### Generate a secure JWT secret:
```bash
# Linux/macOS
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

This creates the Prisma client based on your schema.

## Step 5: Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted, name your migration (e.g., "init" for the first one).

This creates all tables in your database:
- User
- Event
- Pregame
- JoinRequest

### Verify migration:
```bash
npm run prisma:studio
```

This opens Prisma Studio in your browser at `http://localhost:5555` where you can view your database tables.

## Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
Server is running on http://localhost:3000
Environment: development
```

## Step 7: Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MadSocial API is running"
}
```

### Create a User
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@wisc.edu",
    "password": "password123",
    "year": "Sophomore",
    "major": "Computer Science",
    "dorm": "Sellery Hall",
    "bio": "Testing the API"
  }'
```

You should receive a token in the response.

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@wisc.edu",
    "password": "password123"
  }'
```

## Step 8: Seed Sample Data (Optional)

Create a seed file to populate test data:

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: 'Homecoming Game',
      date: new Date('2024-10-12T19:00:00Z'),
      location: 'Camp Randall Stadium',
      vibeTags: ['sports', 'party', 'social'],
    },
  });

  console.log('Created event:', event);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run seed:
```bash
npm install -D ts-node
npx prisma db seed
```

## Common Issues & Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists
- Check firewall/port 5432

### Issue: "JWT secret not configured"

**Solution:**
- Set JWT_SECRET in `.env`
- Generate a strong secret (see Step 3)

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma client errors

**Solution:**
```bash
npm run prisma:generate
```

### Issue: Migration errors

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then re-run migrations
npm run prisma:migrate
```

### Issue: CORS errors from frontend

**Solution:**
- Update CORS_ORIGIN in `.env` to match your frontend URL
- Restart the server

### Issue: Port 3000 already in use

**Solution:**
```bash
# Change PORT in .env to different number
PORT=3001

# Or kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@prod-host:5432/madsocial?schema=public&sslmode=require"
JWT_SECRET="super-secure-random-string-at-least-32-chars"
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production

```bash
npm run build
npm start
```

### Deployment Platforms

**Render.com:**
1. Connect GitHub repo
2. Set environment variables
3. Build command: `npm install && npm run prisma:generate && npm run build`
4. Start command: `npm start`

**Railway.app:**
1. Connect GitHub repo
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy automatically

**Heroku:**
```bash
heroku create madsocial-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

**AWS/DigitalOcean:**
- Use PM2 for process management
- Nginx as reverse proxy
- SSL with Let's Encrypt

### Database Migrations in Production

```bash
# Run migrations (doesn't reset data)
npx prisma migrate deploy
```

## Development Tips

### Hot Reload
The dev server uses nodemon for automatic reloading when you save files.

### Database GUI
```bash
npm run prisma:studio
```

### View Logs
All errors are logged to console. In production, consider using Winston or Morgan.

### API Testing
Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- curl

### TypeScript Type Checking
```bash
npx tsc --noEmit
```

### Database Reset (Development Only)
```bash
# WARNING: Deletes all data
npx prisma migrate reset
```

## Next Steps

1. Test all API endpoints using Postman or curl
2. Build your frontend to consume the API
3. Implement additional features (notifications, search, etc.)
4. Add proper logging and monitoring
5. Write tests (unit, integration, e2e)
6. Set up CI/CD pipeline
7. Deploy to production

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build TypeScript
npm start                      # Start production server

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Run migrations
npm run prisma:studio          # Open database GUI
npx prisma migrate reset       # Reset database (dev only)
npx prisma migrate deploy      # Deploy migrations (prod)

# Testing
curl http://localhost:3000/health  # Health check

# Database access
psql -d madsocial             # Access database directly
```

## Support

For issues or questions:
1. Check this guide
2. Review API_DOCUMENTATION.md
3. Check ARCHITECTURE.md for technical details
4. Review Prisma docs: https://www.prisma.io/docs
5. Check Express docs: https://expressjs.com

## Security Checklist

Before deploying to production:

- [ ] Strong JWT_SECRET set
- [ ] DATABASE_URL uses SSL in production
- [ ] CORS_ORIGIN set to actual frontend domain
- [ ] NODE_ENV=production
- [ ] Environment variables secured (not in code)
- [ ] Rate limiting implemented
- [ ] Input validation working
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Monitoring configured

Happy coding!
