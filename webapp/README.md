# 🌐 Travo Flight Alerts - Web Application

Modern Next.js webapp for flight price alerts with WhatsApp notifications, built with the "Travo" design system.

## 🚀 Quick Start

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

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Travo design system
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **WhatsApp**: Twilio API
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)

## 📱 Features

### ✅ Core Features
- [x] User authentication (signup/signin)
- [x] Flight alert creation and management
- [x] WhatsApp notifications via Twilio
- [x] Responsive design with Travo aesthetics
- [x] Real-time price monitoring dashboard
- [x] Price history tracking and analytics

### 🎨 Design System
- [x] Purple gradient theme with circular effects
- [x] Mobile-first responsive design
- [x] Smooth animations and transitions
- [x] Glass morphism effects
- [x] Custom Tailwind configuration
- [x] Consistent component patterns

### 📊 Dashboard Features
- [x] Alert management interface
- [x] Savings tracking
- [x] Price history charts
- [x] Notification preferences
- [x] User profile management

## 🔧 Configuration

### Environment Variables

```bash
# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Flight API (from main bot)
ARAJET_API_URL=https://arajet-api.ezycommerce.sabre.com
ARAJET_API_KEY=your-arajet-key

# Security
JWT_SECRET=your-jwt-secret
```

### WhatsApp Setup (Twilio)

1. **Create Twilio Account**: [console.twilio.com](https://console.twilio.com)
2. **Get WhatsApp Sandbox**: Enable WhatsApp sandbox for testing
3. **Production Setup**: Apply for WhatsApp Business API approval
4. **Configure Webhook**: Set webhook URL for incoming messages

**Costs**:
- Twilio: ~$0.005 per message (very affordable for MVP)
- WhatsApp Business API: ~$0.025-0.15 per message (more expensive)

**Recommendation**: Start with Twilio for MVP, migrate to WhatsApp Business API when you have more users.

## 📁 Project Structure

```
webapp/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── sections/         # Page sections
│   ├── layout/           # Layout components
│   ├── ui/              # Reusable UI components
│   └── forms/           # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── whatsapp.ts      # WhatsApp service
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Helper functions
├── prisma/               # Database schema
├── types/                # TypeScript definitions
└── public/              # Static assets
```

## 🎨 Design System

### Color Palette
```css
/* Primary Purple */
--primary-500: #7c3aed
--primary-600: #6d28d9

/* Gradients */
--gradient-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--circular-gradient: radial-gradient(circle...)
```

### Components
- **Cards**: Shadow with hover effects
- **Buttons**: Primary/secondary with animations
- **Forms**: Rounded inputs with focus states
- **Alerts**: Toast notifications
- **Charts**: Purple-themed data visualization

## 🔌 API Integration

### Flight Data
The webapp integrates with your existing bot's flight monitoring system:

```typescript
// Reuses your existing services
import { ArajetAlertService } from '../../../src/services/ArajetAlertService'
import { AlertManager } from '../../../src/services/AlertManager'
```

### API Routes
- `POST /api/auth/signup` - User registration
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/[id]` - Update alert
- `DELETE /api/alerts/[id]` - Delete alert
- `POST /api/notifications/test` - Test WhatsApp

## 📱 WhatsApp Integration

### Message Types
1. **Welcome Message**: Sent on signup
2. **Price Alerts**: When deals are found
3. **System Updates**: Important notifications
4. **Test Messages**: For verification

### Example Alert Message
```
🚨 Flight Price Alert!

✈️ Miami → Punta Cana
📅 Dec 15 - Dec 22

💵 $329 USD
💰 You save: $121!
🛫 Arajet

Book now: [link]
```

## 🚀 Deployment

### Development
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Production Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
```

#### 2. Docker
```bash
# Build image
docker build -t travo-webapp .

# Run container
docker run -p 3000:3000 --env-file .env travo-webapp
```

#### 3. Traditional VPS
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "travo-webapp" -- start
```

## 🔐 Security Considerations

### Authentication
- Secure password hashing with bcrypt
- JWT tokens for session management
- NextAuth.js for OAuth integration

### Data Protection
- Input validation with Zod
- SQL injection prevention with Prisma
- XSS protection with Content Security Policy

### WhatsApp Security
- Phone number validation
- Rate limiting for notifications
- Secure webhook handling

## 📊 Analytics & Monitoring

### Metrics to Track
- User registration rate
- Alert creation rate
- WhatsApp delivery rate
- User engagement
- Cost per notification

### Monitoring Tools
- Vercel Analytics (built-in)
- Sentry for error tracking
- Twilio Console for WhatsApp metrics

## 🧪 Testing

```bash
# Run tests
npm run test

# Test WhatsApp integration
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'
```

## 🤝 Integration with Bot

The webapp complements your existing Telegram bot:

1. **Shared Database**: Same SQLite/PostgreSQL database
2. **Shared Services**: Reuses flight monitoring logic
3. **Cross-Platform**: Users can use both Telegram and web
4. **Unified Notifications**: WhatsApp + Telegram options

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Basic alert management
- [x] WhatsApp notifications
- [x] Responsive design

### Phase 2: Enhanced Features
- [ ] Advanced filtering
- [ ] Price prediction
- [ ] Social sharing
- [ ] Mobile app (React Native)

### Phase 3: Enterprise
- [ ] Team accounts
- [ ] API for third parties
- [ ] White-label solution
- [ ] Advanced analytics

## 💰 Costs Breakdown

### Development (One-time)
- Design & Development: $0 (using this template)
- Domain: ~$10/year
- SSL Certificate: Free (Let's Encrypt)

### Monthly Operating Costs
- Hosting (Vercel): $0-20/month
- Database (PostgreSQL): $0-25/month
- WhatsApp (Twilio): ~$0.005 per message
- Total: ~$0-50/month for small scale

### WhatsApp API Comparison
| Provider | Cost per Message | Features | Approval |
|----------|------------------|----------|----------|
| Twilio | $0.005 | Basic messaging | Instant |
| WhatsApp Business API | $0.025-0.15 | Rich media, buttons | Manual review |

**Recommendation**: Start with Twilio, upgrade to WhatsApp Business API when you reach 1000+ users.

## 🆘 Support

### Common Issues
1. **WhatsApp not working**: Check Twilio credentials
2. **Database errors**: Run `npx prisma db push`
3. **Build failures**: Clear `.next` folder
4. **Styling issues**: Check Tailwind compilation

### Getting Help
- Check the main project README
- Review Twilio documentation
- Open GitHub issues
- Contact support

---

**Ready to launch your flight deals webapp! ✈️🚀**
