# OzBridge CRM (澳联)

A comprehensive B2B CRM system for immigration and education consulting agents. Built with Next.js, TypeScript, and NextAuth.js.

## 🚀 Features

- **AI Email Intelligence** - Automatically extract visa grants, COE, and offers from emails
- **Client Management** - Complete lifecycle tracking for immigration and education clients
- **Case Management** - Workflow automation for visa applications and student enrollments
- **Financial Tracking** - Billing, invoicing, and commission management
- **Bilingual Platform** - Full English and Chinese support
- **Google OAuth Authentication** - Secure sign-in with NextAuth.js
- **Turso Database** - Free serverless SQLite database for licenses and pricing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials (for authentication)
- Turso account (for database - free tier available)

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
# Turso Database
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin
ADMIN_KEY=your-admin-key
```

### 3. Initialize Database

```bash
node scripts/init-turso.js
node scripts/init-pricing.js
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide for licenses and database
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Detailed authentication setup with Google OAuth
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Authentication system overview
- **[TURSO_SETUP.md](./TURSO_SETUP.md)** - Turso database configuration
- **[PRICING_API.md](./PRICING_API.md)** - Pricing API documentation
- **[FALLBACK_STRATEGY.md](./FALLBACK_STRATEGY.md)** - Database fallback mechanism
- **[PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md)** - Full project overview

## 🔐 Authentication

The project uses NextAuth.js with Google OAuth:

1. Visit `/auth/signin` to sign in
2. Click "Sign in with Google"
3. Access protected routes like `/dashboard`

See [AUTH_SETUP.md](./AUTH_SETUP.md) for setup instructions.

## 🗄️ Database

Uses Turso (serverless SQLite) for:
- License management
- Pricing plans
- User data (future)

Includes automatic fallback to default data if database is unavailable.

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: NextAuth.js
- **Database**: Turso (libSQL)
- **Font**: Sen (Google Fonts)
- **Deployment**: Vercel

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── check/        # License checking
│   │   ├── licenses/     # License management
│   │   └── pricing/      # Pricing data
│   ├── auth/             # Authentication pages
│   ├── components/       # React components
│   ├── dashboard/        # Protected dashboard
│   └── page.tsx          # Homepage
├── data/                 # Fallback data
├── public/               # Static assets
├── scripts/              # Database initialization
└── types/                # TypeScript definitions
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 🔧 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

This project is proprietary software for OzBridge CRM.

## 🤝 Support

For setup help or issues:
1. Check the documentation files
2. Review [AUTH_SETUP.md](./AUTH_SETUP.md) troubleshooting section
3. Contact the development team

---

Built with ❤️ for immigration and education professionals
