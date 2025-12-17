# 🎯 Next Steps - Getting Started with OzBridge CRM

## You're Almost Ready! 🚀

The authentication system is fully implemented. Here's what you need to do to start using it:

## Step 1: Set Up Google OAuth (5 minutes)

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create or Select Project
- Click "Select a project" → "New Project"
- Name it "OzBridge CRM" or similar
- Click "Create"

### 1.3 Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click it and press "Enable"

### 1.4 Create OAuth Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- If prompted, configure OAuth consent screen:
  - User Type: External
  - App name: OzBridge CRM
  - User support email: your email
  - Developer contact: your email
  - Save and continue through the steps
- Back to Create OAuth client ID:
  - Application type: Web application
  - Name: OzBridge CRM
  - Authorized redirect URIs:
    - Add: `http://localhost:3000/api/auth/callback/google`
  - Click "Create"

### 1.5 Copy Credentials
- You'll see a popup with Client ID and Client Secret
- Keep this window open or download the JSON

## Step 2: Generate NextAuth Secret

Open your terminal and run:

```bash
openssl rand -base64 32
```

Copy the output (it will look like: `abc123xyz789...`)

## Step 3: Update .env.local

Open `.env.local` and update these lines:

```env
# Replace these values:
NEXTAUTH_SECRET=paste-the-output-from-step-2-here
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

Your `.env.local` should look like:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://crm-mason028.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# Admin
ADMIN_KEY=test_admin_key_123

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Kx7vN2mP9qR4sT8wY3zA6bC1dE5fG0hJ2kL4mN7pQ9=
GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz789
```

## Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 5: Test Authentication! 🎉

1. Open http://localhost:3000
2. Click "Sign In" in the navbar
3. You'll be redirected to `/auth/signin`
4. Click "Sign in with Google"
5. Choose your Google account
6. You'll be redirected back to the homepage
7. Your profile picture and name appear in the navbar!
8. Visit http://localhost:3000/dashboard to see the protected page

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth credentials created
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] NextAuth secret generated
- [ ] `.env.local` updated with all credentials
- [ ] Development server restarted
- [ ] Successfully signed in with Google
- [ ] Can see profile in navbar
- [ ] Can access `/dashboard`

## 🎨 What You Can Do Now

### As a User
- ✅ Sign in with Google
- ✅ Access protected dashboard
- ✅ See your profile information
- ✅ Sign out

### As a Developer
- ✅ Protect any page with authentication
- ✅ Protect API routes
- ✅ Access user information in components
- ✅ Build user-specific features

## 📚 Need Help?

### Common Issues

**"Configuration error"**
- Make sure `NEXTAUTH_SECRET` is set
- Restart the dev server

**Google OAuth not working**
- Check redirect URI matches exactly
- Verify Google+ API is enabled
- Check Client ID and Secret are correct

**Session not persisting**
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Try incognito mode

### Documentation

- **Quick Setup**: [QUICKSTART.md](./QUICKSTART.md)
- **Detailed Auth Guide**: [AUTH_SETUP.md](./AUTH_SETUP.md)
- **System Overview**: [AUTHENTICATION.md](./AUTHENTICATION.md)
- **Full Setup**: [SETUP.md](./SETUP.md)
- **Project Info**: [README.md](./README.md)

## 🚀 Production Deployment

When you're ready to deploy:

1. **Generate new production secret**
   ```bash
   openssl rand -base64 32
   ```

2. **Add production redirect URI in Google Console**
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. **Set environment variables in Vercel**
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=new-production-secret`
   - `GOOGLE_CLIENT_ID=same-as-dev`
   - `GOOGLE_CLIENT_SECRET=same-as-dev`

4. **Deploy!**

## 🎯 What's Next?

After authentication is working, you can:

1. **Add more features to dashboard**
   - Client management
   - Case tracking
   - Email inbox

2. **Protect more routes**
   - Add authentication to other pages
   - Create role-based access

3. **Store user data**
   - Save user preferences in Turso
   - Track user activity

4. **Add more auth providers**
   - Email magic links
   - GitHub OAuth
   - Microsoft OAuth

## 💡 Tips

- Keep your `.env.local` file secure (never commit it!)
- Use different secrets for development and production
- Test authentication in incognito mode to verify it works for new users
- Check the browser console for any errors

---

**You're all set! Start by setting up Google OAuth and you'll be signing in within 5 minutes! 🎉**
