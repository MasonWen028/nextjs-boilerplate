# Authentication Setup Guide

This project uses NextAuth.js for authentication with Google OAuth.

## Setup Steps

### 1. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and update `NEXTAUTH_SECRET` in `.env.local`

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
   - Click "Create"

5. Copy the credentials:
   - Copy the "Client ID" to `GOOGLE_CLIENT_ID` in `.env.local`
   - Copy the "Client Secret" to `GOOGLE_CLIENT_SECRET` in `.env.local`

### 3. Update Environment Variables

Edit `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL when deploying
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 4. Restart Development Server

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

## Features Implemented

### Sign In Page
- Beautiful branded sign-in page at `/auth/signin`
- Google OAuth button with official Google branding
- Responsive design

### Authentication Button
- Shows "Sign In" button when not authenticated
- Shows user avatar, name, and "Sign Out" button when authenticated
- Integrated into the navbar

### Protected Routes (Optional)

To protect a page, add this to the top of your page component:

```typescript
'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user?.name}!</p>
    </div>
  );
}
```

### API Route Protection

To protect an API route:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Your protected API logic here
  return NextResponse.json({ data: "Protected data" });
}
```

## Testing

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign In" in the navbar
4. You'll be redirected to `/auth/signin`
5. Click "Sign in with Google"
6. Complete Google authentication
7. You'll be redirected back to the homepage
8. Your profile picture and name will appear in the navbar

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add your production callback URL to Google OAuth settings
3. Generate a new secure `NEXTAUTH_SECRET` for production
4. Never commit `.env.local` to version control

## Troubleshooting

### "Configuration error" message
- Make sure all environment variables are set correctly
- Restart the development server after changing `.env.local`

### Google OAuth not working
- Check that redirect URIs match exactly in Google Console
- Ensure Google+ API is enabled
- Verify Client ID and Secret are correct

### Session not persisting
- Check that `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check browser console for errors

## Security Notes

- Never expose your `NEXTAUTH_SECRET` or `GOOGLE_CLIENT_SECRET`
- Use different secrets for development and production
- Keep your `.env.local` file out of version control
- Consider adding rate limiting for sign-in attempts in production
