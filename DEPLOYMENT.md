# Deployment Guide

## Production Deployment on flight-bot.com

### Prerequisites

- Vercel account connected to GitHub
- Domain configured: `flight-bot.com`
- Environment variables configured

### Environment Variables

Configure these variables in Vercel Dashboard > Settings > Environment Variables:

#### Critical Variables
```bash
NEXTAUTH_SECRET=c77f1458e3b587fb4a840ead1242ce87559ad21e713395baa05ad96c8084d1c3
NEXTAUTH_URL=https://flight-bot.com
JWT_SECRET=6652b18e4e19206525163b01c15a481f4ed685fa091ff65be77b68eda8eb8604
DATABASE_URL=file:./dev.db
```

#### Google OAuth
```bash
GOOGLE_CLIENT_ID=1079216797376-q65td72utp8d9u12e7d9jm9t12slevgg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

#### Telegram Bot
```bash
TELEGRAM_BOT_TOKEN=7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw
TELEGRAM_BOT_USERNAME=ticketscannerbot_bot
```

#### Optional Services (Email Notifications)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=martin.navarro.dev@gmail.com
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=martin.navarro.dev@gmail.com
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Configure Vercel**
   - Import project from GitHub
   - Set root directory to `/webapp`
   - Configure environment variables
   - Deploy

3. **Configure Domain**
   - Add `flight-bot.com` to Vercel domains
   - Add `www.flight-bot.com` to Vercel domains
   - Update DNS records as instructed

4. **Verify Deployment**
   - Test webapp at `https://flight-bot.com`
   - Verify authentication flow
   - Test alert creation and management

### Post-Deployment

1. **Test Authentication**
   - Google OAuth login
   - User registration
   - Role assignment

2. **Test Core Features**
   - Alert creation
   - Price monitoring
   - Notification system

3. **Monitor Logs**
   - Check Vercel function logs
   - Monitor error rates
   - Verify database connections

### Maintenance

- Regular database backups
- Monitor API rate limits
- Update environment variables as needed
- Check SSL certificate renewal
