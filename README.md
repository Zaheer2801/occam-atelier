# OCAS Software

A modern career platform that pairs intelligent automation with a dedicated team of marketing specialists, recruiters, and coaches.

## Overview

OCAS Software helps job seekers land their next role faster by combining AI-powered tools with human expertise. The platform includes:

- **Atelier**: A personal career department with a pod of marketers, recruiters, and coaches
- **Right Job**: Curated opportunities with tailored applications and real-time visibility

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS
- **Backend**: Supabase (authentication, database, storage)
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion, GSAP

## Project Structure

```
src/
├── components/
│   ├── apple/          # OCAS Software LLC (homepage) components
│   ├── atelier/        # Atelier portal components
│   ├── auth/           # Authentication components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── pages/
│   ├── Index.tsx       # Homepage (OCAS Software LLC)
│   ├── Atelier.tsx     # Atelier landing page
│   ├── auth/           # Sign in, sign up, password reset
│   └── app/            # Dashboard pages (client, employee, manager)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
└── integrations/       # Supabase client
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Features

### Public Pages
- **Homepage**: Apple-inspired design showcasing the platform
- **Atelier**: Dark-themed career workspace landing page
- **Features**: Detailed capability overview
- **Pricing**: Subscription plans and comparison
- **About**: Company information
- **Contact**: Contact form and details

### Authentication
- Email/password authentication
- Google OAuth
- Password reset flow
- Role-based access (manager, employee, client)

### App Dashboards

#### Client Dashboard
- Application tracking
- Analytics and progress
- Profile management
- Resume upload and review

#### Employee Dashboard
- Client assignments
- Application management
- Client communication
- Performance analytics

#### Manager Dashboard
- Team overview
- Client assignments
- Pending approvals
- System settings

## User Roles

- **Manager**: Full system access, team management, client assignments
- **Employee**: Assigned client management, application tracking
- **Client**: Personal job search dashboard, application visibility

## Database Schema

Key tables:
- `profiles`: User profiles with resume and status
- `user_roles`: Role assignments
- `job_applications`: Application tracking
- `employee_client_assignments`: Employee-client relationships
- `activity_logs`: Audit trail

## Development

### Adding Components

Use shadcn/ui CLI:

```bash
bunx shadcn add <component-name>
```

### Database Migrations

Run migrations via Supabase CLI or Lovable Cloud interface.

### Testing

```bash
bun run test
```

## Deployment

The app is automatically deployed via Lovable Cloud. For self-hosting:

1. Connect to GitHub
2. Clone the repository
3. Deploy to your preferred platform (Vercel, Netlify, etc.)
4. Configure environment variables

## License

© 2025 OCAS Software LLC. All rights reserved.

---

Built with [Lovable](https://lovable.dev)
