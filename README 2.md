# TrustVibe - End the interrogation. Start the conversation.

A platform for sharing authentic experiences with professionals and services.

## Setup Instructions

### Prerequisites
- Node.js v18+ (you have v24.3.0 ✅)
- GitHub account
- Supabase account
- Vercel account

### Installation

1. **Copy all files to your local trustvibe folder**

2. **Create environment file**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to: http://localhost:3000

### Project Structure
```
trustvibe/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── ui/                    # Subframe UI components
│   ├── components/        # Reusable components
│   └── layouts/           # Layout components
├── subframe/              # Subframe icons
├── lib/                   # Utilities
│   └── supabase.ts       # Supabase client
└── public/               # Static assets
```

### Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Features (Phase 1)

- ✅ Landing Page
- 🚧 Tea Chat (2 queries for anonymous users)
- 🚧 Read Reviews (signup after 5 reviews)
- 🚧 Signup/Login
- 🚧 Write Reviews

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **UI Components:** Subframe
- **Database:** Supabase
- **Hosting:** Vercel
