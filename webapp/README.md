# Flight Alerts Web Application

Modern Next.js web application for flight price alerts with WhatsApp notifications integration.

## Overview

This web application provides a user-friendly interface for managing flight price alerts, complementing the existing Telegram bot with web-based access and WhatsApp notifications.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation
- **Notifications**: WhatsApp via Twilio API
- **State Management**: TanStack Query

## Installation

```bash
# Install dependencies
cd webapp
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## Environment Configuration

```bash
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Flight API
ARAJET_API_URL=https://arajet-api.ezycommerce.sabre.com
ARAJET_API_KEY=your-arajet-key

# Security
JWT_SECRET=your-jwt-secret
```

## Features

### Core Functionality
- User authentication and registration
- Flight alert creation and management
- WhatsApp notifications for price alerts
- Responsive design for mobile and desktop
- Real-time price monitoring dashboard
- Price history tracking

### Integration
- Shared database with Telegram bot
- Reuses existing flight monitoring services
- Cross-platform user management
- Unified notification system

## Project Structure

```
webapp/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── sections/         # Page sections
│   ├── layout/           # Layout components
│   ├── ui/              # Reusable UI components
│   └── forms/           # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
├── prisma/               # Database schema
├── types/                # TypeScript definitions
└── public/              # Static assets
```

## API Routes

- `POST /api/auth/signup` - User registration
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/[id]` - Update alert
- `DELETE /api/alerts/[id]` - Delete alert
- `POST /api/notifications/test` - Test WhatsApp notification

## WhatsApp Integration

### Setup
1. Create a Twilio account at console.twilio.com
2. Enable WhatsApp sandbox for testing
3. Configure webhook URL for incoming messages
4. For production, apply for WhatsApp Business API approval

### Message Types
- Welcome messages on user registration
- Price alerts when deals are found
- System notifications for important updates
- Test messages for verification

### Cost Considerations
- Twilio WhatsApp: ~$0.005 per message
- WhatsApp Business API: ~$0.025-0.15 per message
- Recommended: Start with Twilio, upgrade to Business API at scale

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

## Database Commands

```bash
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Seed database with initial data
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Configure environment variables in Vercel dashboard.

### Docker
```bash
docker build -t flight-webapp .
docker run -p 3000:3000 --env-file .env flight-webapp
```

### Traditional VPS
```bash
npm run build
pm2 start npm --name "flight-webapp" -- start
```

## Security

- Secure password hashing with bcrypt
- JWT tokens for session management
- Input validation with Zod
- SQL injection prevention with Prisma
- Rate limiting for API endpoints

## Integration with Main Bot

The webapp integrates seamlessly with the existing Telegram bot:

1. **Shared Database**: Uses the same SQLite/PostgreSQL database
2. **Shared Services**: Reuses flight monitoring and alert logic
3. **Cross-Platform**: Users can access via both Telegram and web
4. **Unified Notifications**: Supports both Telegram and WhatsApp

## Operating Costs

### Monthly Costs (Small Scale)
- Hosting (Vercel): $0-20
- Database: $0-25
- WhatsApp notifications: ~$0.005 per message
- Total: $0-50/month

### Scaling Considerations
- Start with Twilio for WhatsApp
- Upgrade to WhatsApp Business API at 1000+ users
- Consider PostgreSQL for production database

## Support

For issues or questions:
1. Check environment variables configuration
2. Verify Twilio credentials for WhatsApp
3. Run database migrations: `npm run db:push`
4. Review logs for error details

## License

MIT License - Same as main project
