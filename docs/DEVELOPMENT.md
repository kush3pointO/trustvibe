# TrustVibe Development Documentation

**Last Updated:** January 9, 2026  
**Version:** 1.0  
**Project Lead:** Kushendra (Product)  
**CTO:** Claude (Technical Architecture)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Version History](#version-history)
3. [Tech Stack](#tech-stack)
4. [Architecture Decisions](#architecture-decisions)
5. [Phase Tracking](#phase-tracking)
6. [Database Schema](#database-schema)
7. [API Integration](#api-integration)
8. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Mission:** End the interrogation. Start the conversation.

**Product:** TrustVibe - A platform for sharing authentic experiences with professionals and services, focused on marginalized communities (singles, females, divorcees, LGBTQ+, differently abled, minorities).

**Target Users:**
- Anonymous users (2 free Tea queries)
- Registered users (unlimited access)

**Core Features:**
- Landing page with value proposition
- Tea Chat (AI assistant)
- Read reviews (community experiences)
- Write reviews (share experiences)
- User authentication

---

## Version History

### Version 1.0 - January 9, 2026
**Status:** Phase 1 In Progress

**Completed:**
- ✅ Landing page deployed (https://trustvibe-xi.vercel.app/)
- ✅ Navigation system
- ✅ Read Reviews page with Supabase integration
- ✅ Database schema with sample data
- ✅ Vercel deployment pipeline
- ✅ GitHub repository setup

**In Progress:**
- 🚧 Tea Chat implementation (Phase 1.3)

**Decisions Made:**
- Tech stack: Next.js 14, Supabase, Vercel
- AI: Claude Sonnet 4 API
- Caching: Deferred to Phase 2 (architecture supports it)
- Tea UX: Modal overlay (Option A)

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom Subframe components
- **Deployment:** Vercel

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Phase 2)
- **API:** Next.js API Routes

### AI Integration
- **Model:** Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Provider:** Anthropic API
- **Budget:** $10 initial credits
- **Features:** 
  - Conversational AI
  - Tool calling capability (ready, not implemented yet)
  - Prompt caching support (architecture ready, not implemented)

### DevOps
- **Version Control:** GitHub (https://github.com/kush3pointO/trustvibe)
- **CI/CD:** Vercel auto-deployment
- **Monitoring:** TBD

---

## Architecture Decisions

### AD-001: Tea Chat UX Design
**Date:** January 9, 2026  
**Decision:** Modal overlay approach (Option A)  
**Rationale:**
- Better conversion (keeps user on landing page)
- Simpler Phase 1 implementation
- Mobile-friendly
- Less intimidating than dedicated page

**Design Specs:**
```
User Flow:
1. User types in Tea search bar on landing page
2. Clicks Send button
3. Full-screen modal opens
4. Shows "Tea is brewing..." loading state
5. Response streams in
6. User can ask follow-up questions
7. After 2 queries → "Sign up for unlimited" banner appears
```

### AD-002: Caching Strategy
**Date:** January 9, 2026  
**Decision:** No caching in Phase 1, architecture supports future implementation  
**Rationale:**
- Ship fast, validate product-market fit first
- Architecture designed to add caching later
- Claude prompt caching: 90% savings on system prompts (ready to enable)
- Response caching in Supabase (table structure ready)

**Future Implementation Points:**
```typescript
// Prompt caching (add cache_control when ready)
system: [{
  type: "text",
  text: systemPrompt,
  cache_control: { type: "ephemeral" } // ← Uncomment to enable
}]

// Response caching (table ready in schema)
await supabase.from('tea_cache').insert({...})
```

### AD-003: Anonymous User Tracking
**Date:** January 9, 2026  
**Decision:** Use session-based tracking with cookies  
**Implementation:**
- Store session ID in cookie
- Track queries in `tea_conversations` table
- Limit: 2 queries per session per day
- Reset: Daily at midnight UTC

### AD-004: AI Tool Architecture
**Date:** January 9, 2026  
**Decision:** Build agent executor framework from day 1, start with basic tools  
**Phase 1 Tools:**
- search_reviews (Supabase query)

**Phase 2 Tools (架構ready):**
- search_reddit (Reddit API)
- search_marketplace (web scrapers)
- ask_clarifying_question (multi-turn dialogue)

**Rationale:**
- Future-proof architecture
- Easy to add tools without refactoring
- Claude API supports tool calling natively

---

## Phase Tracking

### Phase 1: MVP Launch (In Progress)
**Goal:** Anonymous users can try Tea, read reviews, basic functionality

**Phase 1.1:** ✅ Backend Setup (Completed)
- Supabase database
- Sample data
- Authentication schema

**Phase 1.2:** ✅ Landing + Reviews (Completed)
- Landing page
- Navigation
- Read Reviews page
- Vercel deployment

**Phase 1.3:** 🚧 Tea Chat (Current)
- Modal UI for chat
- Claude API integration
- 2-query limit for anonymous users
- Basic review search
- Session tracking

**Phase 1.4:** Write Reviews (Next)
- Review submission form
- Category selection
- Service creation
- User attribution

**Phase 1.5:** Authentication (Final Phase 1 milestone)
- Signup/login modals
- Email + password
- Cohort selection
- Session management

---

### Phase 2: Enhanced Features (Planned)
**Goal:** Full AI capabilities, social features, monetization

**Features:**
- Advanced Tea with Reddit integration
- Tool calling / agent executor
- Prompt caching (90% cost reduction)
- Response caching
- User profiles
- Saved services
- Review reactions
- Email notifications

---

### Phase 3: Scale & Growth (Future)
**Goal:** Marketplace integration, mobile app, B2B

**Features:**
- Mobile app (React Native)
- Marketplace scrapers
- Premium tier
- Professional verification
- API for partners
- Analytics dashboard

---

## Database Schema

### Current Tables (Version 1.0)

#### `services`
```sql
id                UUID PRIMARY KEY
name              TEXT NOT NULL
category          TEXT NOT NULL
location          TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

**Sample Categories:** 'Doctor', 'Therapist', 'Lawyer', 'Landlord', 'Boss', 'Restaurant', 'Shop', 'Club'

#### `reviews`
```sql
id                UUID PRIMARY KEY
service_id        UUID REFERENCES services(id)
user_id           UUID REFERENCES auth.users(id)
title             TEXT NOT NULL
content           TEXT NOT NULL
is_recommended    BOOLEAN NOT NULL
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

#### `tea_conversations`
```sql
id                UUID PRIMARY KEY
session_id        TEXT NOT NULL
query_count       INTEGER DEFAULT 0
last_query_at     TIMESTAMP DEFAULT NOW()
created_at        TIMESTAMP DEFAULT NOW()
```

#### Future Tables (Schema Ready, Not Created Yet)

#### `tea_cache` (For Phase 2 caching)
```sql
id                UUID PRIMARY KEY
query_hash        TEXT UNIQUE NOT NULL
query             TEXT NOT NULL
response          TEXT NOT NULL
created_at        TIMESTAMP DEFAULT NOW()
hits              INTEGER DEFAULT 0
last_accessed     TIMESTAMP DEFAULT NOW()
```

#### `user_preferences` (For Phase 2)
```sql
id                UUID PRIMARY KEY
user_id           UUID REFERENCES auth.users(id)
cohort            TEXT[]  -- ['single', 'female', 'lgbtq+', etc.]
location          TEXT
notification_prefs JSONB
created_at        TIMESTAMP DEFAULT NOW()
```

---

## API Integration

### Anthropic Claude API

**Configuration:**
```typescript
// lib/anthropic.ts (to be created)
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-20250514";
```

**Environment Variables:**
```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Tea System Prompt (Draft):**
```typescript
const TEA_SYSTEM_PROMPT = `You are Tea, a compassionate AI assistant for TrustVibe.

Your purpose:
- Help users find trustworthy professionals and services
- Search through authentic community experiences
- Provide empathetic, non-judgmental guidance
- Respect privacy and anonymity

Community context:
TrustVibe serves singles, females, divorcees, LGBTQ+, differently abled people, 
and minorities who have faced discrimination or uncomfortable experiences.

Guidelines:
1. Always be empathetic and supportive
2. Never make assumptions about users' situations
3. Cite specific reviews when relevant
4. If unsure, ask clarifying questions
5. Respect that experiences are subjective
6. Encourage users to share their own stories

Available tools:
- search_reviews(query, category, location): Search TrustVibe review database

Tone: Warm, professional, supportive, like a trusted friend`;
```

**Cost Tracking:**
- Budget: $10 (initial)
- Estimated queries: ~444 without caching, ~700+ with optimizations
- Average cost per query: ~$0.0225 (2.25 cents)

---

## Future Enhancements

### Caching Implementation (Phase 2)

**Step 1: Enable Claude Prompt Caching**
```typescript
// In API route
system: [{
  type: "text",
  text: TEA_SYSTEM_PROMPT,
  cache_control: { type: "ephemeral" } // ← Just add this line!
}]
```
**Savings:** 90% on system prompt tokens

**Step 2: Add Response Cache**
```typescript
// Check cache before calling Claude
const cached = await supabase
  .from('tea_cache')
  .select('response')
  .eq('query_hash', hash(query))
  .single();

if (cached) return cached.response;

// Call Claude...
// Save response to cache
```
**Savings:** 100% on duplicate queries (~30% hit rate expected)

**Step 3: Smart Context Management**
- Only include relevant reviews (not all)
- Use embeddings for semantic search
- Reduce token count by 50%+

---

### Tool Calling / Agent Executor (Phase 2)

**Architecture:**
```typescript
interface Tool {
  name: string;
  description: string;
  input_schema: object;
  execute: (input: any) => Promise<any>;
}

const tools: Tool[] = [
  {
    name: "search_reviews",
    description: "Search TrustVibe reviews by category, location, or keywords",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string" },
        location: { type: "string" }
      }
    },
    execute: async (input) => {
      return await supabase
        .from('reviews')
        .select('*')
        .textSearch('content', input.query)
        .limit(5);
    }
  },
  // Add more tools here...
];
```

**Benefits:**
- Claude can decide which tools to use
- Multi-step reasoning
- External data integration (Reddit, marketplaces)
- Clarifying questions

---

### Reddit Integration (Phase 2)

**Use Cases:**
- "What do people on Reddit say about therapy in Mumbai?"
- Cross-reference TrustVibe reviews with Reddit discussions
- Find trending topics in mental health, housing, etc.

**API:**
```typescript
// lib/reddit.ts
async function searchReddit(query: string, subreddit?: string) {
  const url = `https://www.reddit.com/search.json?q=${query}`;
  // Implementation...
}
```

**Subreddits to Monitor:**
- r/india
- r/mumbai, r/bangalore, r/delhi
- r/TwoXIndia
- r/LGBTIndia
- r/disability

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Functional components (React)
- Server components where possible

### Git Workflow
```bash
# Feature branch
git checkout -b feature/tea-chat

# Commit messages
git commit -m "feat: Add Tea chat modal component"
git commit -m "fix: Handle empty review results"
git commit -m "docs: Update API documentation"

# Push and deploy
git push origin main  # Auto-deploys to Vercel
```

### Testing Strategy (Phase 2)
- Unit tests: Jest
- E2E tests: Playwright
- API tests: Supertest
- Load testing: k6

---

## Project URLs

**Production:** https://trustvibe-xi.vercel.app/  
**Repository:** https://github.com/kush3pointO/trustvibe  
**Supabase:** https://supabase.com/dashboard/project/kmnkexhuejgxkeqfqic  
**Vercel:** https://vercel.com/kushs-projects-7a1e3374/trustvibe  

---

## Team & Contacts

**Product Lead:** Kushendra Suryavanshi  
**Technical Architect:** Claude AI  
**Design:** Subframe + Custom  

---

## Notes & Decisions Log

### January 9, 2026
- ✅ Decided on modal UI for Tea Chat (not dedicated page)
- ✅ No caching in Phase 1, architecture supports future implementation
- ✅ Agent executor framework from day 1
- ✅ Anonymous tracking via cookies + session table
- ✅ Claude Sonnet 4 chosen over GPT-4 for better instruction following
- ✅ Starting with 2 free queries, may adjust based on usage data

---

**End of Documentation v1.0**

*This document will be updated as development progresses. All major decisions and architecture changes should be documented here.*
