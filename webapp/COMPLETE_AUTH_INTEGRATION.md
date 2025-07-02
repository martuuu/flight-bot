# 🔐 Complete Authentication Integration - Flight-Bot

## 📋 Overview

This document outlines the complete authentication and user management system integration between the Flight-Bot webapp and Telegram bot. The system supports both manual registration (email/password) and OAuth authentication (Google) with a unified user experience.

## 🎯 Features Implemented

### ✅ Authentication Methods

#### Manual Registration (Email/Password)
- **Secure Form**: React Hook Form with Zod validation
- **Password Security**: bcrypt hashing with salt rounds
- **Email Verification**: Token-based verification system
- **User Feedback**: Success/error states with toast notifications
- **Responsive UI**: Modern design with Framer Motion animations

#### OAuth Authentication (Google)
- **Seamless Login**: One-click Google authentication
- **Auto-verification**: OAuth users are automatically verified
- **Profile Integration**: Automatic name and image import
- **Fallback Support**: Works alongside manual authentication

### ✅ Role-Based Access Control (RBAC)

| Role | Description | Permissions |
|------|-------------|-------------|
| **SUPERADMIN** | System administrator | Full access to admin panel, user management, system settings |
| **SUPPORTER** | Customer support team | Access to user support features, limited admin functions |
| **PREMIUM** | Premium subscribers | Access to premium features, extended limits |
| **BASIC** | Standard users | Basic flight alert features |
| **TESTING** | Test accounts | Limited access for testing purposes |

### ✅ Subscription Management

#### Subscription Plans
- **BASIC**: Standard plan with basic features
- **PREMIUM**: Enhanced plan with advanced features

#### Subscription Status
- **ACTIVE**: User has active subscription
- **INACTIVE**: Subscription paused or pending
- **EXPIRED**: Subscription has expired

#### Features
- Automatic expiration tracking
- Admin-controlled subscription extensions
- Plan upgrade/downgrade capabilities
- Status-based feature access control

### ✅ Email System

#### Verification Emails
- **Purpose**: Verify email addresses for manual registrations
- **Token**: Secure, time-limited verification tokens (24h expiry)
- **Template**: Professional HTML email with Flight-Bot branding
- **Resend**: Users can request new verification emails

#### Welcome Emails
- **Trigger**: Sent automatically after successful registration
- **Content**: Welcome message with platform introduction
- **Branding**: Consistent with Flight-Bot visual identity

#### Admin Invitation Emails
- **Purpose**: Invite new users via email from admin panel
- **Security**: Pre-authorized invitations with role assignment
- **Tracking**: Track invitation status and acceptance

### ✅ Telegram Integration

#### Account Linking
- **Deep Links**: Secure linking via Telegram bot commands
- **User Sync**: Real-time synchronization of user data
- **Status Tracking**: Monitor link status and activity

#### Data Synchronization
- **Role Sync**: Bot access based on webapp user roles
- **Subscription Sync**: Feature access based on subscription status
- **Real-time Updates**: Instant updates when user data changes

### ✅ Admin Dashboard

#### User Management
- **User List**: Paginated view of all users with search/filter
- **User Details**: Complete user profile with edit capabilities
- **Role Management**: Change user roles with permission validation
- **Status Control**: Activate/deactivate user accounts

#### Subscription Management
- **Plan Changes**: Upgrade/downgrade user subscriptions
- **Expiration Control**: Extend or modify subscription dates
- **Bulk Operations**: Apply changes to multiple users

#### Telegram Management
- **Link Status**: View and manage Telegram account links
- **Unlink Accounts**: Disconnect Telegram accounts when needed
- **Usage Analytics**: Monitor Telegram bot usage by user

## 🔧 Technical Implementation

### Database Schema

```prisma
model User {
  // Basic user info
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  phone         String?   // For WhatsApp
  password      String?   // For manual auth
  
  // Email verification
  verificationToken    String?
  verificationExpires  DateTime?
  
  // Role and permissions
  role          String  @default("BASIC")
  
  // Telegram integration
  telegramId       String?   @unique
  telegramUsername String?
  telegramLinked   Boolean   @default(false)
  telegramLinkedAt DateTime?
  
  // Subscription system
  subscriptionStatus   String   @default("ACTIVE")
  subscriptionPlan     String   @default("BASIC")
  subscriptionExpires  DateTime?
  
  // Metadata
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  alerts        Alert[]
  // ... other relations
}
```

### NextAuth Configuration

#### Providers
```typescript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // Email/password validation logic
      // Email verification check
      // Role and subscription data return
    },
  }),
]
```

#### Callbacks
```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // Token enrichment with role and subscription data
  },
  async session({ session, token }) {
    // Session enhancement with user metadata
  },
  async signIn({ user, account, profile }) {
    // Provider-specific login logic
    // Email verification for OAuth users
  },
}
```

#### Events
```typescript
events: {
  async createUser({ user }) {
    // Role assignment (first user = SUPERADMIN)
    // Subscription setup
    // Email verification token generation
    // Welcome email sending
  },
}
```

### API Endpoints

#### Authentication APIs
- `POST /api/auth/signup` - Manual user registration
- `GET /api/auth/verify-email` - Email verification handler
- `POST /api/auth/resend-verification` - Resend verification email

#### Admin APIs
- `GET /api/admin/users` - List users with filters
- `PUT /api/admin/users` - Update user data
- `DELETE /api/admin/users` - Delete user account
- `POST /api/admin/invite` - Send invitation email

### Frontend Components

#### Authentication Pages
- `/auth/signin` - Unified login page (manual + OAuth)
- `/auth/signup` - Registration form with validation
- `/auth/verified` - Email verification success page
- `/auth/error` - Authentication error handling

#### User Pages
- `/dashboard` - User dashboard with alerts
- `/profile` - User profile management

#### Admin Pages
- `/admin/dashboard` - Admin control panel (SUPERADMIN only)

## 🔒 Security Features

### Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 8 characters with complexity requirements
- **Storage**: Never store plaintext passwords

### Email Verification
- **Required**: Manual registrations must verify email
- **Tokens**: Cryptographically secure random tokens
- **Expiry**: 24-hour token expiration
- **Single Use**: Tokens invalidated after successful verification

### Session Management
- **JWT Strategy**: Secure token-based sessions
- **Automatic Refresh**: Token updates on role/subscription changes
- **Secure Cookies**: HTTP-only, secure session cookies

### Role-Based Security
- **Route Protection**: Pages restricted by user role
- **API Authorization**: Endpoint access control
- **Data Filtering**: Users see only their own data (except admins)

## 🔄 User Flows

### Manual Registration Flow
1. User visits `/auth/signup`
2. Fills registration form (name, email, phone, password)
3. System creates user with `emailVerified: null`
4. Verification email sent with secure token
5. User clicks email link → `/api/auth/verify-email?token=xxx`
6. Email verified → user can sign in
7. Welcome email sent automatically

### OAuth Registration Flow
1. User visits `/auth/signin`
2. Clicks "Continue with Google"
3. OAuth flow completes
4. System creates user with `emailVerified: now()`
5. Welcome email sent automatically
6. User redirected to dashboard

### Sign In Flow
1. User visits `/auth/signin`
2. Can choose email/password or Google OAuth
3. Credentials validated (email verification checked)
4. Session created with role and subscription data
5. Redirected to dashboard

### Admin Management Flow
1. SUPERADMIN visits `/admin/dashboard`
2. Views user list with search/filter
3. Can edit user details, roles, subscriptions
4. Can send invitation emails to new users
5. Can unlink Telegram accounts
6. All changes logged and tracked

## 🌐 Integration Points

### Telegram Bot Integration
- **User Verification**: Bot checks webapp user status
- **Role Access**: Feature access based on webapp roles
- **Deep Linking**: Account linking via secure tokens
- **Real-time Sync**: Instant updates between platforms

### Email Service Integration
- **SMTP Configuration**: Flexible email provider support
- **Template System**: HTML email templates
- **Error Handling**: Graceful degradation on email failures
- **Delivery Tracking**: Monitor email delivery status

### Database Integration
- **Prisma ORM**: Type-safe database operations
- **SQLite Support**: Development database
- **Migration System**: Schema versioning and updates
- **Connection Pooling**: Efficient database connections

## 📊 Monitoring & Analytics

### User Metrics
- Registration conversion rates
- Email verification rates
- OAuth vs manual registration preferences
- Role distribution
- Subscription status tracking

### System Health
- Authentication success/failure rates
- Email delivery success rates
- Database performance metrics
- Session duration and activity

## 🚀 Deployment Considerations

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Flight-Bot <noreply@flight-bot.com>"
```

### Production Setup
1. Configure production database (PostgreSQL recommended)
2. Set up email service (SendGrid, AWS SES, etc.)
3. Configure OAuth credentials for production domain
4. Set secure NEXTAUTH_SECRET
5. Enable HTTPS for secure cookies
6. Configure rate limiting for APIs
7. Set up monitoring and logging

## 🧪 Testing

### Integration Tests
- Complete authentication flow testing
- Role-based access verification
- Email system testing
- Subscription management validation
- Telegram integration testing

### Test Script Usage
```bash
# Run complete integration test
npm run test:auth-integration

# Or manually
npx tsx scripts/test-complete-auth-integration.ts
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register new user with email/password.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BASIC"
  },
  "needsVerification": true
}
```

#### GET /api/auth/verify-email?token=xxx
Verify user email address.

**Success Response:**
- Redirects to `/auth/verified`

**Error Response:**
- Redirects to `/auth/error?error=InvalidToken`

#### POST /api/auth/resend-verification
Resend verification email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully"
}
```

### Admin Endpoints

#### GET /api/admin/users
List all users (SUPERADMIN only).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term (name or email)
- `role` - Filter by role
- `status` - Filter by subscription status

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### PUT /api/admin/users
Update user data (SUPERADMIN only).

**Request:**
```json
{
  "userId": "clxxx...",
  "updates": {
    "role": "PREMIUM",
    "subscriptionExpires": "2025-12-31T23:59:59.999Z"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Email Verification Not Working
1. Check SMTP configuration in `.env`
2. Verify email provider settings
3. Check spam/junk folders
4. Validate email server connectivity

#### OAuth Authentication Failing
1. Verify Google OAuth credentials
2. Check authorized redirect URIs
3. Ensure NEXTAUTH_URL is correct
4. Validate domain configuration

#### Database Connection Issues
1. Check DATABASE_URL format
2. Verify database file permissions
3. Run `npx prisma db push` to sync schema
4. Check for migration conflicts

#### Role/Permission Issues
1. Verify user role assignment
2. Check middleware configuration
3. Validate session data
4. Review role-based routing

## 📈 Future Enhancements

### Planned Features
- Two-factor authentication (2FA)
- Social login with additional providers
- Advanced subscription billing
- Enhanced audit logging
- User activity analytics
- Mobile app authentication
- API key management for developers

### Performance Optimizations
- Redis session storage
- Database query optimization
- Email queue system
- CDN integration for assets
- Rate limiting implementation

---

**Last Updated:** July 2, 2025  
**Version:** 1.0.0  
**Contributors:** Flight-Bot Team
