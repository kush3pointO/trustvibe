import { supabase } from '@/lib/supabase';

// Tool interface
export interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

// Tool definitions for Claude
export const TOOLS: Tool[] = [
  {
    name: 'search_trustvibe_reviews',
    description: 'Search TrustVibe community reviews database for authentic experiences with professionals, services, and places. Use this to find real user experiences and recommendations.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "therapist Mumbai", "Dr. Priya Sharma", "landlord experiences")',
        },
        category: {
          type: 'string',
          description: 'Optional: Category filter (Doctor, Therapist, Lawyer, Landlord, Boss, Restaurant, Shop, Club)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_web',
    description: 'Search the web for general information, recent discussions, or broader context. Use this when TrustVibe reviews are limited or when user needs general information about a topic.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Web search query (e.g., "best therapists in Mumbai reviews", "how to choose a good doctor")',
        },
      },
      required: ['query'],
    },
  },
];

// Execute tools
export class ToolExecutor {
  /**
   * Search TrustVibe reviews database
   */
  static async searchTrustVibeReviews(query: string, category?: string): Promise<string> {
    try {
      const entities = this.extractEntities(query);
      
      let dbQuery = supabase
        .from('reviews')
        .select(`
          *,
          services (*)
        `)
        .order('created_at', { ascending: false });

      // Apply category filter
      const searchCategory = category || entities.category;
      if (searchCategory) {
        const { data: services } = await supabase
          .from('services')
          .select('id')
          .ilike('category', `%${searchCategory}%`);

        if (services && services.length > 0) {
          const serviceIds = services.map(s => s.id);
          dbQuery = dbQuery.in('service_id', serviceIds);
        }
      }

      // Search by name
      if (entities.name) {
        const { data: services } = await supabase
          .from('services')
          .select('id')
          .ilike('name', `%${entities.name}%`);

        if (services && services.length > 0) {
          const serviceIds = services.map(s => s.id);
          dbQuery = dbQuery.in('service_id', serviceIds);
        }
      }

      // Search by location
      if (entities.location) {
        const { data: services } = await supabase
          .from('services')
          .select('id')
          .ilike('location', `%${entities.location}%`);

        if (services && services.length > 0) {
          const serviceIds = services.map(s => s.id);
          dbQuery = dbQuery.in('service_id', serviceIds);
        }
      }

      dbQuery = dbQuery.limit(5);
      const { data, error } = await dbQuery;

      if (error) throw error;

      if (!data || data.length === 0) {
        return JSON.stringify({
          found: false,
          message: 'No reviews found in TrustVibe database for this query.',
        });
      }

      const reviews = data.map((review: any) => ({
        professional: review.services?.name || 'Unknown',
        category: review.services?.category || 'Unknown',
        location: review.services?.location || null,
        title: review.title,
        review: review.content,
        recommended: review.is_recommended,
      }));

      return JSON.stringify({
        found: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error('Error searching TrustVibe:', error);
      return JSON.stringify({
        found: false,
        error: 'Failed to search TrustVibe database',
      });
    }
  }

  /**
   * Search the web (placeholder for now, uses web_search tool)
   */
  static async searchWeb(query: string): Promise<string> {
    // This will be handled by Claude's web_search tool
    // For now, return a message indicating web search was triggered
    return JSON.stringify({
      message: 'Web search capability enabled. Claude will use its built-in web search.',
      query,
    });
  }

  /**
   * Extract entities from query
   */
  private static extractEntities(query: string): {
    category?: string;
    name?: string;
    location?: string;
  } {
    const lowerQuery = query.toLowerCase();
    const entities: any = {};

    // Extract category
    const categories = [
      'doctor', 'doctors', 'physician', 'physicians',
      'therapist', 'therapists', 'counselor', 'counselors',
      'lawyer', 'lawyers', 'attorney', 'attorneys',
      'landlord', 'landlords', 'flat owner',
      'boss', 'manager', 'supervisor',
      'restaurant', 'restaurants', 'cafe', 'cafes',
      'shop', 'shops', 'store', 'stores',
      'club', 'clubs', 'bar', 'bars'
    ];

    for (const category of categories) {
      if (lowerQuery.includes(category)) {
        entities.category = category.endsWith('s') ? category.slice(0, -1) : category;
        if (entities.category === 'physician') entities.category = 'doctor';
        if (entities.category === 'counselor') entities.category = 'therapist';
        if (entities.category === 'attorney') entities.category = 'lawyer';
        break;
      }
    }

    // Extract location
    const cities = [
      'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad',
      'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur',
    ];

    for (const city of cities) {
      if (lowerQuery.includes(city)) {
        entities.location = city.charAt(0).toUpperCase() + city.slice(1);
        if (entities.location === 'Bengaluru') entities.location = 'Bangalore';
        break;
      }
    }

    // Extract names
    const namePatterns = [
      /dr\.?\s+([a-z]+(?:\s+[a-z]+)?)/i,
      /adv\.?\s+([a-z]+(?:\s+[a-z]+)?)/i,
      /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/
    ];

    for (const pattern of namePatterns) {
      const match = query.match(pattern);
      if (match) {
        entities.name = match[1];
        break;
      }
    }

    return entities;
  }

  /**
   * Execute a tool by name
   */
  static async execute(toolName: string, input: any): Promise<string> {
    switch (toolName) {
      case 'search_trustvibe_reviews':
        return await this.searchTrustVibeReviews(input.query, input.category);
      
      case 'search_web':
        return await this.searchWeb(input.query);
      
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  }
}
