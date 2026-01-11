import { supabase } from '@/lib/supabase';

export interface Session {
  id: string;
  session_id: string;
  query_count: number;
  last_query_at: string;
  created_at: string;
}

export class SessionService {
  /**
   * Get or create a session
   */
  static async getOrCreateSession(sessionId: string): Promise<Session> {
    // Try to get existing session
    const { data: existing } = await supabase
      .from('tea_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existing) {
      return existing as Session;
    }

    // Create new session
    const { data: newSession, error } = await supabase
      .from('tea_conversations')
      .insert({
        session_id: sessionId,
        query_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return newSession as Session;
  }

  /**
   * Check if session has queries remaining
   */
  static async canQuery(sessionId: string, maxQueries: number = 20): Promise<boolean> {
    const session = await this.getOrCreateSession(sessionId);
    return session.query_count < maxQueries;
  }

  /**
   * Increment query count
   */
  static async incrementQueryCount(sessionId: string): Promise<number> {
    const session = await this.getOrCreateSession(sessionId);
    
    const { data, error } = await supabase
      .from('tea_conversations')
      .update({
        query_count: session.query_count + 1,
        last_query_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return (data as Session).query_count;
  }

  /**
   * Get remaining queries for a session
   */
  static async getRemainingQueries(sessionId: string, maxQueries: number = 20): Promise<number> {
    const session = await this.getOrCreateSession(sessionId);
    return Math.max(0, maxQueries - session.query_count);
  }

  /**
   * Reset query count (for testing or daily reset)
   */
  static async resetQueryCount(sessionId: string): Promise<void> {
    await supabase
      .from('tea_conversations')
      .update({
        query_count: 0,
        last_query_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);
  }
}
