# PermutAKI - Facilitando a sua transferência por permuta

## Overview

PermutAKI is a free web platform designed for Mozambican public servants to find compatible partners for job location transfers through permutation (permuta). The application enables users to create profiles with their professional information and current/desired locations, search for matching partners, and communicate securely to arrange transfers.

The platform emphasizes accessibility for Mozambican users, fraud prevention through a reporting system, and user trust through a rating mechanism. It operates as an independent personal initiative (not a government platform) and requires community support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Type
Full-stack monorepo application with:
- **Frontend**: React + TypeScript with Vite build tool
- **Backend**: Express.js REST API
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **UI Framework**: Shadcn/ui components with Tailwind CSS
- **Routing**: Wouter for client-side routing

### Frontend Architecture

**Component Structure:**
- Page-level components: `LandingPage`, `UserDashboard`, `AdminDashboard`
- Feature components: Registration/login modals, user cards, search interfaces
- Shared UI components: Shadcn/ui component library in `/client/src/components/ui/`
- Design system follows LinkedIn/WhatsApp-inspired professional patterns with government portal accessibility

**State Management:**
- React hooks for local state
- TanStack Query (React Query) for server state management and caching
- JWT tokens stored in localStorage for authentication

**Styling Approach:**
- Tailwind CSS utility-first framework
- Custom design tokens defined in CSS variables (HSL color system)
- Dark/light mode support with theme toggle
- Responsive mobile-first design

### Backend Architecture

**API Structure:**
- RESTful endpoints under `/api/` prefix
- JWT-based authentication middleware
- Admin authorization middleware for protected routes
- Session management with token verification

**Key API Endpoints:**
- User registration and authentication
- Profile management (view, update, delete)
- User search with filtering (location, sector, salary level)
- Contact management (WhatsApp contact tracking with daily limits)
- Rating and reporting system
- Admin operations (user management, premium upgrades, banning)
- Password reset flow (request and reset with admin-generated tokens)

**Security Measures:**
- bcrypt for password hashing
- JWT tokens with secret key for authentication
- Rate limiting on WhatsApp contacts (5/day free, 20/day premium)
- Admin verification for password resets
- Input validation with Zod schemas

### Database Design

**Core Tables:**
- `users`: Public servant profiles with personal, professional, location, and authentication data
- `reports`: User-submitted fraud/abuse reports
- `ratings`: User rating system
- `locationHistory`: Track profile location changes

**Key User Fields:**
- Personal: firstName, lastName
- Professional: sector, salaryLevel (1-21), grade (A/B/C)
- Location: currentProvince/District, desiredProvince/District
- Account status: isActive, isPremium, isAdmin, isBanned, permutationCompleted
- Contact limits: whatsappContactsToday, lastContactReset

**Data Layer:**
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL for production
- Migration system via drizzle-kit

### Authentication Flow

1. User registers with phone number and password
2. Server hashes password with bcrypt, generates JWT token
3. Token stored in localStorage, included in Authorization header
4. Middleware verifies token on protected routes
5. Password reset requires admin-generated token sent via WhatsApp

### User Types & Permissions

**Free Users:**
- Create and edit profile
- Search for matches
- View other profiles
- 5 WhatsApp contacts per day
- Rate and report users

**Premium Users:**
- All free features
- 20 WhatsApp contacts per day
- Priority match visibility
- Promoted by admin with expiration tracking

**Administrators:**
- Full user management (activate, ban, delete, promote to premium)
- System monitoring (statistics, edit history)
- Password reset token generation
- Landing page and app settings configuration

### Feature-Specific Architecture

**Search & Matching:**
- Filter by province, district, sector, salary level, grade
- Priority matching algorithm highlights reciprocal matches
- Results paginated and cached

**Contact Management:**
- Daily contact limits reset at midnight
- Premium status checked before contact allowance
- Contact tracking prevents spam

**Rating & Reporting:**
- Users can rate partners after contact
- Fraud reporting system with admin review
- Bad actors can be banned by admins

**Profile Updates:**
- Location history tracking for audit trail
- Edit timestamp recording
- Premium expiration automated checks (hourly cron job)

## External Dependencies

**Database:**
- Neon PostgreSQL serverless database
- Environment variable: `DATABASE_URL`

**Authentication:**
- JWT for token-based auth
- Environment variable: `JWT_SECRET` (required for security)

**UI Component Libraries:**
- Shadcn/ui (Radix UI primitives)
- Tailwind CSS for styling
- Lucide React for icons

**Build & Development Tools:**
- Vite for frontend build and dev server
- esbuild for backend bundling
- TypeScript for type safety
- Drizzle Kit for database migrations

**Frontend Libraries:**
- React 18+
- TanStack Query for data fetching
- React Hook Form for form management
- Zod for validation
- Wouter for routing

**Backend Libraries:**
- Express.js web framework
- bcryptjs for password hashing
- jsonwebtoken for JWT handling
- ws (WebSocket) for Neon connection

**Design Assets:**
- Google Fonts (Inter typeface)
- Custom generated images in `/attached_assets/generated_images/`

**Mozambique-Specific Data:**
- Province and district data in `shared/mozambique-data.ts`
- Sector and grade classifications for public servants
- Portuguese language localization throughout