import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  title: string;
  content: string;
  is_recommended: boolean;
  created_at: string;
  service_id: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  location: string | null;
}

export interface ReviewWithService extends Review {
  services: Service;
}

export class ReviewService {
  /**
   * Search reviews based on query
   */
  static async searchReviews(query: string): Promise<ReviewWithService[]> {
    const entities = this.extractEntities(query);

    // Start building query
    let dbQuery = supabase
      .from('reviews')
      .select(`
        *,
        services (*)
      `)
      .order('created_at', { ascending: false });

    // Apply filters based on extracted entities
    if (entities.category) {
      // Search by category (case-insensitive partial match)
      const { data: services } = await supabase
        .from('services')
        .select('id')
        .ilike('category', `%${entities.category}%`);

      if (services && services.length > 0) {
        const serviceIds = services.map(s => s.id);
        dbQuery = dbQuery.in('service_id', serviceIds);
      }
    }

    if (entities.name) {
      // Search by professional name
      const { data: services } = await supabase
        .from('services')
        .select('id')
        .ilike('name', `%${entities.name}%`);

      if (services && services.length > 0) {
        const serviceIds = services.map(s => s.id);
        dbQuery = dbQuery.in('service_id', serviceIds);
      }
    }

    if (entities.location) {
      // Search by location
      const { data: services } = await supabase
        .from('services')
        .select('id')
        .ilike('location', `%${entities.location}%`);

      if (services && services.length > 0) {
        const serviceIds = services.map(s => s.id);
        dbQuery = dbQuery.in('service_id', serviceIds);
      }
    }

    // Limit results
    dbQuery = dbQuery.limit(5);

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Error searching reviews:', error);
      return [];
    }

    return (data as any[]) || [];
  }

  /**
   * Extract entities from user query
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
        // Normalize to singular form
        entities.category = category.endsWith('s') ? category.slice(0, -1) : category;
        if (entities.category === 'physician') entities.category = 'doctor';
        if (entities.category === 'counselor') entities.category = 'therapist';
        if (entities.category === 'attorney') entities.category = 'lawyer';
        break;
      }
    }

    // Extract location (Indian cities)
    const cities = [
      'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad',
      'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur',
      'surat', 'lucknow', 'kanpur', 'nagpur', 'indore'
    ];

    for (const city of cities) {
      if (lowerQuery.includes(city)) {
        entities.location = city.charAt(0).toUpperCase() + city.slice(1);
        if (entities.location === 'Bengaluru') entities.location = 'Bangalore';
        break;
      }
    }

    // Extract names (look for "Dr.", "Adv.", or capitalized words)
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
}
