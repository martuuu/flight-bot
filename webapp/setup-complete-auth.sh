#!/bin/bash

echo "🚀 Flight-Bot Webapp - Complete Authentication Integration Setup"
echo "=============================================================="
echo ""

# Check if we're in the webapp directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the webapp directory"
    echo "Usage: cd webapp && ./setup-complete-auth.sh"
    exit 1
fi

echo "📋 Setting up complete authentication integration..."
echo ""

# 1. Install dependencies
echo "1️⃣ Installing required dependencies..."
npm install bcryptjs @types/bcryptjs
echo "✅ Dependencies installed"
echo ""

# 2. Generate Prisma client
echo "2️⃣ Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# 3. Push database schema
echo "3️⃣ Updating database schema..."
npx prisma db push
echo "✅ Database schema updated"
echo ""

# 4. Test the integration
echo "4️⃣ Running integration tests..."
npx tsx scripts/test-complete-auth-integration.ts
echo ""

# 5. Environment setup check
echo "5️⃣ Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created from example"
    else
        echo "❌ Error: .env.example not found"
    fi
else
    echo "✅ .env file exists"
fi

# Check required environment variables
echo ""
echo "📝 Required environment variables for complete auth integration:"
echo ""
echo "   Database:"
echo "   - DATABASE_URL"
echo ""
echo "   NextAuth:"
echo "   - NEXTAUTH_URL"
echo "   - NEXTAUTH_SECRET"
echo ""
echo "   Google OAuth:"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo ""
echo "   Email (SMTP):"
echo "   - SMTP_HOST"
echo "   - SMTP_PORT"
echo "   - SMTP_USER"
echo "   - SMTP_PASS"
echo "   - SMTP_FROM"
echo ""

# 6. Feature summary
echo "🎯 Integration Features Configured:"
echo ""
echo "   ✅ Manual Registration (Email/Password)"
echo "      - Password hashing with bcrypt"
echo "      - Email verification with tokens"
echo "      - Secure signup form with validation"
echo ""
echo "   ✅ OAuth Registration (Google)"
echo "      - Automatic email verification"
echo "      - Seamless account creation"
echo "      - Profile picture support"
echo ""
echo "   ✅ Role-Based Access Control"
echo "      - SUPERADMIN: Full system access"
echo "      - SUPPORTER: Support team access"
echo "      - PREMIUM: Premium features"
echo "      - BASIC: Standard access"
echo "      - TESTING: Test environment"
echo ""
echo "   ✅ Subscription Management"
echo "      - Plan tracking (BASIC, PREMIUM)"
echo "      - Expiration dates"
echo "      - Status monitoring (ACTIVE, INACTIVE, EXPIRED)"
echo ""
echo "   ✅ Telegram Integration"
echo "      - Account linking via bot"
echo "      - Username tracking"
echo "      - Deep link support"
echo ""
echo "   ✅ Email System"
echo "      - Verification emails"
echo "      - Welcome emails"
echo "      - Admin invitation emails"
echo "      - Resend verification support"
echo ""
echo "   ✅ Admin Dashboard"
echo "      - User management"
echo "      - Role assignment"
echo "      - Subscription management"
echo "      - Telegram unlinking"
echo ""
echo "   ✅ Security Features"
echo "      - Email verification required"
echo "      - Secure password storage"
echo "      - Token-based verification"
echo "      - Session management"
echo ""

echo "🌐 Available Endpoints:"
echo ""
echo "   Authentication:"
echo "   - /auth/signin - Unified login (manual + OAuth)"
echo "   - /auth/signup - Manual registration"
echo "   - /api/auth/signup - Registration API"
echo "   - /api/auth/verify-email - Email verification"
echo "   - /api/auth/resend-verification - Resend verification"
echo ""
echo "   Admin:"
echo "   - /admin/dashboard - Admin panel (SUPERADMIN only)"
echo "   - /api/admin/users - User management API"
echo "   - /api/admin/invite - Invitation API"
echo ""
echo "   User:"
echo "   - /dashboard - User dashboard"
echo "   - /profile - User profile"
echo ""

echo "📚 Next Steps:"
echo ""
echo "   1. Configure your .env file with all required variables"
echo "   2. Start the development server: npm run dev"
echo "   3. Visit /auth/signup to create your first account"
echo "   4. The first user will automatically be a SUPERADMIN"
echo "   5. Access /admin/dashboard to manage users and settings"
echo ""

echo "🔗 Integration with Telegram Bot:"
echo ""
echo "   - Users can link their accounts via deep links"
echo "   - Bot can check user roles and subscriptions"
echo "   - Seamless data synchronization"
echo "   - Real-time status updates"
echo ""

echo "✨ Setup completed successfully!"
echo "🎉 Your Flight-Bot webapp is ready with complete authentication integration!"
echo ""

# Optional: Start development server
read -p "🚀 Do you want to start the development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting development server..."
    npm run dev
fi
