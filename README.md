# Task Pilot

Task Pilot is a full-stack project management application for organizing work with boards, Kanban columns, tasks, filters, priorities, due dates, and drag-and-drop workflows.

**Live application:** https://task-pilot-cyan.vercel.app  
**Repository:** https://github.com/Sahilpatil009/Task-Pilot

## Features

- Secure sign-up, sign-in, and protected routes with Clerk
- User-owned project boards
- Default Kanban workflow with To Do, In Progress, Review, and Done columns
- Task creation, assignment, priority, description, and due dates
- Drag-and-drop task movement with `dnd-kit`
- Board and task filtering
- Dashboard statistics and recent activity
- PostgreSQL persistence through Supabase
- Row Level Security policies scoped to the signed-in Clerk user
- Responsive interface built with Tailwind CSS and reusable UI components

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS, Base UI, Radix UI |
| Authentication | Clerk |
| Database | Supabase PostgreSQL |
| Drag and drop | dnd-kit |
| Deployment | Vercel |

## Application flow

```text
Clerk authentication
        ↓
Protected dashboard
        ↓
Create or open a board
        ↓
Create columns and tasks
        ↓
Filter, prioritize, and drag tasks
        ↓
Supabase persistence protected by RLS
```

## Local development

### Requirements

- Node.js 20.9 or newer
- npm
- A Clerk application
- A Supabase project

### 1. Clone and install

```bash
git clone https://github.com/Sahilpatil009/Task-Pilot.git
cd Task-Pilot
npm install
```

### 2. Configure environment variables

Create `.env` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Use the Clerk publishable and secret keys from the same Clerk instance. Never commit `.env` files or secret keys.

### 3. Connect Clerk to Supabase

Task Pilot uses Clerk as a Supabase third-party authentication provider.

1. Activate the Supabase integration for your Clerk application.
2. Copy the Clerk domain shown by Clerk.
3. In Supabase, open **Authentication → Sign In / Providers**.
4. Add Clerk as a third-party provider and enter the Clerk domain.

Clerk session tokens must include `role: authenticated`. Supabase RLS policies use the token's `sub` claim as the application user ID.

### 4. Create and secure the database

Open the Supabase SQL Editor and run the complete [`supabase-schema.sql`](./supabase-schema.sql) file.

The schema:

- Creates `boards`, `columns`, and `tasks`
- Grants Data API access only to the `authenticated` role
- Revokes direct table access from `anon`
- Enables Row Level Security
- Restricts every operation to data owned by the current Clerk user
- Adds indexes for ownership and relationship queries

Do not grant unrestricted board access to the anonymous role in production.

### 5. Start the application

```bash
npm run dev
```

Open http://localhost:3000.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
├── app/                 Next.js routes and layouts
├── components/          Shared layout and UI components
├── features/
│   ├── auth/            Clerk authentication screens
│   ├── boards/          Kanban board, tasks, filters, and drag-and-drop
│   ├── dashboard/       Board list, statistics, plans, and filters
│   └── pricing/         Pricing page
├── lib/
│   ├── services.ts      Supabase data operations
│   └── supabase/        Supabase client models and helpers
└── providers/           Clerk-aware Supabase provider
```

## Deployment

The repository is configured for deployment on Vercel.

1. Import the GitHub repository into Vercel.
2. Add every variable listed in the environment section to Production and Preview.
3. Keep `CLERK_SECRET_KEY` marked as sensitive.
4. Deploy and verify sign-in, board creation, task creation, filtering, persistence, and drag-and-drop.

The current production alias is https://task-pilot-cyan.vercel.app.

## Troubleshooting

### Error loading boards

Confirm all of the following:

- The complete SQL schema was run in the correct Supabase project.
- Clerk is activated as a Supabase third-party authentication provider.
- The Clerk publishable and secret keys belong to the same Clerk instance.
- The Supabase URL and publishable key belong to the same Supabase project.
- The signed-in Clerk session token contains `role: authenticated`.

### Authentication redirect loop

Confirm the Clerk key pair comes from one instance, restart the development server after changing `.env`, and sign in again.

## Security

- Secrets are excluded through `.gitignore`.
- Public browser configuration uses the `NEXT_PUBLIC_` prefix.
- Database access is enforced with PostgreSQL grants and RLS, not only UI checks.
- Task movement policies verify that the destination column belongs to the signed-in user.

## License

No license has been specified yet. Add a license before accepting external contributions or reuse.
