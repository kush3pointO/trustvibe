# Tea Chat Architecture Document

**Version:** 1.0  
**Date:** January 9, 2026  
**Status:** Phase 1 Implementation Ready

---

## Overview

Tea is TrustVibe's AI assistant that helps users find trustworthy professionals and services based on authentic community experiences.

---

## Architecture Principles

1. **Future-Proof:** Built to support caching, tools, and advanced features from day 1
2. **Simple Start:** Phase 1 has minimal features, complex features are architected but not implemented
3. **Cost-Efficient:** Architecture supports 90% cost reduction via caching (not enabled in Phase 1)
4. **Scalable:** Can handle tool calling, multi-turn conversations, external APIs

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  Landing Page → Tea Input → Modal Opens → Chat Interface    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Route Layer                          │
│              /api/tea/chat (Next.js API Route)              │
│                                                              │
│  1. Validate session                                        │
│  2. Check query limit (2 for anonymous)                     │
│  3. [FUTURE: Check cache]                                   │
│  4. Build context with reviews                              │
│  5. Call Claude API                                         │
│  6. [FUTURE: Save to cache]                                 │
│  7. Return response                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Session Service │  │  Claude Service  │               │
│  │  - Track queries │  │  - API calls     │               │
│  │  - Limit check   │  │  - Streaming     │               │
│  └──────────────────┘  │  - [Tool calls]  │               │
│                        └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Review Service  │  │  [Cache Service] │               │
│  │  - Search DB     │  │  - Not enabled   │               │
│  │  - Format data   │  │  - Ready to use  │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │    Supabase DB   │  │   Claude API     │               │
│  │  - reviews       │  │  - Sonnet 4      │               │
│  │  - services      │  │  - Streaming     │               │
│  │  - tea_convos    │  │  - [Caching]     │               │
│  │  - [tea_cache]   │  │  - [Tools]       │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1 Implementation (Minimal)

### Components to Build

#### 1. Modal Component (`/components/TeaModal.tsx`)
```typescript
interface TeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

// Features:
// - Full-screen modal
// - Chat interface
// - Loading states
// - Query counter (X of 2)
// - Signup banner after 2 queries
```

#### 2. API Route (`/api/tea/chat/route.ts`)
```typescript
export async function POST(req: Request) {
  // 1. Get session ID from cookies
  // 2. Check query count
  // 3. Search reviews
  // 4. Call Claude API
  // 5. Stream response
  // 6. Update query count
}
```

#### 3. Session Service (`/lib/services/session.ts`)
```typescript
// Track anonymous users
// Limit to 2 queries per session
// Store in Supabase tea_conversations table
```

#### 4. Claude Service (`/lib/services/claude.ts`)
```typescript
// Simple Claude API wrapper
// System prompt
// Basic message handling
// [Caching hooks ready, not used]
```

---

## Future-Proof Hooks (Not Implemented in Phase 1)

### 1. Caching Layer

```typescript
// lib/services/cache.ts (Create in Phase 2)

interface CacheService {
  // Check if response exists
  get(queryHash: string): Promise<string | null>;
  
  // Save response
  set(queryHash: string, query: string, response: string): Promise<void>;
  
  // Invalidate cache
  invalidate(pattern: string): Promise<void>;
}

// Usage in API route:
// const cached = await cacheService.get(hash(query));
// if (cached) return cached;
```

**Implementation Effort:** 2-3 hours  
**Cost Savings:** 30% reduction (assuming 30% cache hit rate)

---

### 2. Tool Calling Architecture

```typescript
// lib/services/tools.ts (Create in Phase 2)

interface Tool {
  name: string;
  description: string;
  input_schema: object;
  execute: (input: any) => Promise<any>;
}

class ToolExecutor {
  private tools: Map<string, Tool>;
  
  register(tool: Tool): void { ... }
  
  async execute(toolName: string, input: any): Promise<any> { ... }
}

// Example tools:
const searchReviewsTool: Tool = {
  name: "search_reviews",
  description: "Search TrustVibe reviews",
  input_schema: { ... },
  execute: async (input) => {
    return await supabase.from('reviews')...
  }
};

const searchRedditTool: Tool = {
  name: "search_reddit",
  description: "Search Reddit discussions",
  input_schema: { ... },
  execute: async (input) => {
    return await reddit.search(...)
  }
};
```

**Implementation Effort:** 4-6 hours  
**Features Unlocked:**
- Reddit integration
- Multi-step reasoning
- Clarifying questions
- External data sources

---

### 3. Prompt Caching

```typescript
// lib/services/claude.ts

// Phase 1 (current):
const response = await anthropic.messages.create({
  model: MODEL,
  system: TEA_SYSTEM_PROMPT,
  messages: [...]
});

// Phase 2 (add cache_control):
const response = await anthropic.messages.create({
  model: MODEL,
  system: [{
    type: "text",
    text: TEA_SYSTEM_PROMPT,
    cache_control: { type: "ephemeral" } // ← Just add this!
  }],
  messages: [...]
});
```

**Implementation Effort:** 15 minutes  
**Cost Savings:** 20% reduction (90% discount on cached tokens)

---

### 4. Conversation History

```typescript
// lib/services/conversation.ts (Phase 2)

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class ConversationManager {
  async getHistory(sessionId: string): Promise<Message[]> { ... }
  
  async addMessage(sessionId: string, message: Message): Promise<void> { ... }
  
  async clearHistory(sessionId: string): Promise<void> { ... }
}
```

**Implementation Effort:** 3-4 hours  
**Features:**
- Multi-turn conversations
- Context retention
- Follow-up questions

---

## File Structure (Phase 1)

```
trustvibe/
├── app/
│   ├── api/
│   │   └── tea/
│   │       └── chat/
│   │           └── route.ts          [NEW] API endpoint
│   ├── page.tsx                      [UPDATE] Add Tea modal trigger
│   └── ...
├── components/
│   ├── TeaModal.tsx                  [NEW] Chat modal
│   └── TeaChatInterface.tsx          [NEW] Chat UI
├── lib/
│   ├── services/
│   │   ├── session.ts                [NEW] Session tracking
│   │   ├── claude.ts                 [NEW] Claude API wrapper
│   │   ├── reviews.ts                [NEW] Review search
│   │   └── [cache.ts]                [PHASE 2] Caching
│   │   └── [tools.ts]                [PHASE 2] Tool executor
│   ├── supabase.ts                   [EXISTS]
│   └── utils.ts                      [NEW] Helpers
└── ...
```

---

## API Specification

### POST /api/tea/chat

**Request:**
```json
{
  "query": "Tell me about Dr. Priya Sharma",
  "sessionId": "uuid-v4",
  "conversationHistory": []  // Optional, for follow-ups
}
```

**Response (Streaming):**
```typescript
// Server-Sent Events (SSE)
data: {"type": "thinking"}
data: {"type": "chunk", "content": "Based on reviews, "}
data: {"type": "chunk", "content": "Dr. Priya Sharma..."}
data: {"type": "done", "queriesRemaining": 1}
```

**Error Response:**
```json
{
  "error": "QUERY_LIMIT_REACHED",
  "message": "You've used your 2 free queries. Sign up for unlimited access!",
  "queriesUsed": 2,
  "maxQueries": 2
}
```

---

## Session Management

### Anonymous User Flow

```typescript
// 1. User lands on site
// → Create session ID (UUID)
// → Store in cookie (7 days expiry)
// → Create record in tea_conversations table

// 2. User asks query
// → Check query_count in database
// → If < 2: Process query, increment count
// → If >= 2: Return limit error, show signup

// 3. User signs up
// → Migrate session to user account
// → Reset query limit (unlimited for registered users)
```

### Cookie Structure
```typescript
{
  name: "tea_session",
  value: "uuid-v4",
  maxAge: 7 * 24 * 60 * 60, // 7 days
  httpOnly: true,
  secure: true,
  sameSite: "strict"
}
```

---

## Claude Configuration

### System Prompt (Phase 1)

```typescript
export const TEA_SYSTEM_PROMPT = `You are Tea, a compassionate AI assistant for TrustVibe, a platform where marginalized communities share authentic experiences with professionals and services.

Your role:
- Help users discover trustworthy professionals (doctors, therapists, lawyers, landlords, etc.)
- Search through community reviews and experiences
- Provide empathetic, non-judgmental guidance
- Respect privacy and individual circumstances

Community Context:
TrustVibe serves singles, females, divorcees, widowed, LGBTQ+ individuals, differently abled people, and minorities who have faced discrimination, judgment, or uncomfortable experiences with professionals.

Guidelines:
1. Be warm, empathetic, and supportive
2. Never make assumptions about users' situations
3. Cite specific reviews when making recommendations
4. Use phrases like "Based on community reviews..." or "According to experiences shared..."
5. If information is limited, be honest about it
6. Encourage users to share their own experiences
7. Respect that experiences are subjective

Format:
- Keep responses conversational and concise (2-3 paragraphs max)
- Use bullet points for multiple recommendations
- Always cite review sources
- End with a helpful follow-up question or suggestion

Available Context:
You have access to reviews from the TrustVibe community. When relevant reviews are provided in the context, reference them specifically.`;
```

---

## Review Search Logic

```typescript
// lib/services/reviews.ts

async function searchReviews(query: string): Promise<Review[]> {
  // 1. Extract entities (names, categories, locations)
  const entities = extractEntities(query);
  
  // 2. Build Supabase query
  let query = supabase
    .from('reviews')
    .select(`
      *,
      services (*)
    `);
  
  // 3. Apply filters
  if (entities.category) {
    query = query.eq('services.category', entities.category);
  }
  
  if (entities.location) {
    query = query.ilike('services.location', `%${entities.location}%`);
  }
  
  if (entities.name) {
    query = query.ilike('services.name', `%${entities.name}%`);
  }
  
  // 4. Text search on content
  if (query.text) {
    query = query.textSearch('content', query.text);
  }
  
  // 5. Limit and order
  const { data } = await query
    .order('created_at', { ascending: false })
    .limit(5);
  
  return data || [];
}

// Phase 2: Use embeddings for semantic search
// async function semanticSearch(query: string): Promise<Review[]> { ... }
```

---

## Streaming Implementation

```typescript
// app/api/tea/chat/route.ts

export async function POST(req: Request) {
  const { query, sessionId } = await req.json();
  
  // Validate session...
  // Check query limit...
  // Search reviews...
  
  // Stream response
  const stream = new ReadableStream({
    async start(controller) {
      // Send thinking state
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify({type: 'thinking'})}\n\n`)
      );
      
      // Call Claude API with streaming
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        system: TEA_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: buildContextWithReviews(query, reviews)
        }]
      });
      
      // Stream chunks
      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta') {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: 'chunk',
                content: chunk.delta.text
              })}\n\n`
            )
          );
        }
      }
      
      // Send done
      controller.enqueue(
        new TextEncoder().encode(
          `data: ${JSON.stringify({
            type: 'done',
            queriesRemaining: 2 - queryCount
          })}\n\n`
        )
      );
      
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

---

## Testing Strategy (Phase 2)

### Unit Tests
```typescript
// __tests__/services/session.test.ts
describe('SessionService', () => {
  it('should track query count correctly', () => { ... });
  it('should enforce 2-query limit', () => { ... });
});

// __tests__/services/reviews.test.ts
describe('ReviewService', () => {
  it('should extract entities from query', () => { ... });
  it('should search reviews by category', () => { ... });
});
```

### Integration Tests
```typescript
// __tests__/api/tea.test.ts
describe('Tea API', () => {
  it('should respond to valid query', () => { ... });
  it('should enforce query limits', () => { ... });
  it('should stream response correctly', () => { ... });
});
```

---

## Monitoring & Analytics (Phase 2)

### Metrics to Track
```typescript
interface TeaMetrics {
  totalQueries: number;
  averageResponseTime: number;
  cacheHitRate: number;
  queryLimitReached: number;
  topCategories: string[];
  conversionRate: number; // anonymous → signup after limit
}
```

### Cost Tracking
```typescript
interface CostMetrics {
  totalTokensUsed: number;
  totalCost: number;
  averageCostPerQuery: number;
  cachedTokens: number;
  cachedSavings: number;
}
```

---

## Rollout Plan

### Phase 1: MVP (Current)
**Timeline:** 1-2 days  
**Features:**
- ✅ Modal UI
- ✅ Basic Claude integration
- ✅ Review search
- ✅ 2-query limit
- ✅ Session tracking

**Success Metrics:**
- 50+ Tea queries
- < 5s response time
- 0 API errors
- Query limit working correctly

---

### Phase 2: Enhanced (After MVP validation)
**Timeline:** 1 week  
**Features:**
- ✅ Prompt caching (90% savings)
- ✅ Response caching (30% savings)
- ✅ Tool calling framework
- ✅ Conversation history
- ✅ Better entity extraction

**Success Metrics:**
- 70% cost reduction
- 30% cache hit rate
- Multi-turn conversations working
- < 3s average response time

---

### Phase 3: Advanced (Future)
**Timeline:** 2-3 weeks  
**Features:**
- ✅ Reddit integration
- ✅ Marketplace scrapers
- ✅ Semantic search with embeddings
- ✅ Personalized recommendations
- ✅ A/B testing framework

**Success Metrics:**
- External data in 50% of responses
- 90% user satisfaction
- 80% cost reduction vs Phase 1
- 10% conversion rate (anonymous → signup)

---

## Dependencies

### NPM Packages (Phase 1)
```json
{
  "@anthropic-ai/sdk": "^0.27.0",
  "uuid": "^9.0.0",
  "cookie": "^0.6.0"
}
```

### Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Known Limitations & Trade-offs

### Phase 1 Limitations
1. **No caching:** Higher costs, but simpler implementation
2. **Basic search:** Keyword-based, not semantic
3. **No conversation history:** Each query is independent
4. **No external data:** Only TrustVibe reviews

### Design Trade-offs
1. **Modal vs Page:** Modal chosen for better conversion, but limited screen space
2. **Streaming vs Blocking:** Streaming chosen for better UX, but more complex code
3. **Client-side session vs Server-side:** Cookie-based chosen for simplicity, but less secure

---

## Security Considerations

### Current (Phase 1)
- ✅ API rate limiting (2 queries per session)
- ✅ Input sanitization
- ✅ CORS configuration
- ⚠️ Session stored in cookie (httpOnly, secure)

### Future (Phase 2)
- ✅ Row-level security (RLS) in Supabase
- ✅ JWT-based authentication
- ✅ Request signing
- ✅ Anomaly detection

---

**End of Tea Chat Architecture v1.0**

*This architecture document serves as the blueprint for Tea implementation. All future enhancements should reference this document and update it accordingly.*
