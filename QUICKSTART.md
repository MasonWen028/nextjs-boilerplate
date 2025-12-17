# 🚀 Quick Start Guide

Get OzBridge CRM running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

### Minimum Configuration (to run locally)

Edit `.env.local` and add:

```env
# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=temporary-secret-for-testing

# Temporary Google OAuth (won't work until you set up real credentials)
GOOGLE_CLIENT_ID=placeholder
GOOGLE_CLIENT_SECRET=placeholder

# Admin key
ADMIN_KEY=test_admin_key_123

# Turso (optional - will use fallback data if not configured)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Step 3: Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

## What You'll See

✅ **Homepage** - Marketing site with all sections
✅ **Navbar** - With "Sign In" button
✅ **Features** - AI Email Intelligence, Client Management, etc.
✅ **Pricing** - Dynamic pricing from database (or fallback data)

## To Enable Authentication

You need real Google OAuth credentials:

### Quick Setup (5 minutes)

1. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Copy output to `NEXTAUTH_SECRET` in `.env.local`

2. **Get Google OAuth Credentials**
   - Go to: https://console.cloud.google.com/
   - Create new project (or select existing)
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to `.env.local`

3. **Restart Server**
   ```bash
   npm run dev
   ```

4. **Test Sign In**
   - Click "Sign In" in navbar
   - Sign in with Google
   - See your profile in navbar
   - Visit `/dashboard` for protected page

**Detailed instructions:** See [AUTH_SETUP.md](./AUTH_SETUP.md)

## To Enable Database

### Option 1: Use Fallback Data (No Setup)
The app works without database setup! It uses default data from `data/licenses.json`

### Option 2: Set Up Turso (Free)

1. **Create Turso Account**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Sign up
   turso auth signup
   
   # Create database
   turso db create crm
   
   # Get credentials
   turso db show crm
   ```

2. **Add to .env.local**
   ```env
   TURSO_DATABASE_URL=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```

3. **Initialize Database**
   ```bash
   node scripts/init-turso.js
   node scripts/init-pricing.js
   ```

**Detailed instructions:** See [TURSO_SETUP.md](./TURSO_SETUP.md)

## Common Issues

### "Configuration error" when signing in
- Make sure `NEXTAUTH_SECRET` is set
- Restart dev server after changing `.env.local`

### Google OAuth not working
- Check redirect URI matches exactly
- Make sure Google+ API is enabled
- Verify Client ID and Secret are correct

### Database errors
- App will automatically use fallback data
- Check Turso credentials if you want to use database

## Next Steps

Once running:

1. ✅ Browse the homepage
2. ✅ Check out the features section
3. ✅ Set up Google OAuth (5 min)
4. ✅ Sign in and visit `/dashboard`
5. ✅ Optionally set up Turso database

## Full Documentation

- **[README.md](./README.md)** - Project overview
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication details
- **[TURSO_SETUP.md](./TURSO_SETUP.md)** - Database setup
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Auth system overview

## Need Help?

Check the troubleshooting sections in:
- [AUTH_SETUP.md](./AUTH_SETUP.md#troubleshooting)
- [SETUP.md](./SETUP.md)

---

**That's it! You're ready to go! 🎉**
