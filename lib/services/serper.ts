interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
}

interface SerperResponse {
  organic?: SerperResult[];
  answerBox?: {
    answer?: string;
    snippet?: string;
  };
  knowledgeGraph?: {
    title?: string;
    description?: string;
  };
}

export class SerperService {
  private static apiKey = '18525fe03dc27c8a837ff114ffb0a7ed884e2b07';
  
  /**
   * Search the web using Serper API
   */
  static async search(query: string, numResults: number = 5): Promise<string> {
    console.log('🔍 Serper API - Starting search...');
    console.log('Query:', query);
    console.log('API Key present:', !!this.apiKey);
    console.log('API Key (first 10 chars):', this.apiKey?.substring(0, 10));

    if (!this.apiKey) {
      console.error('❌ Serper API key not configured!');
      return JSON.stringify({
        error: 'Serper API key not configured',
        message: 'Web search is not available',
      });
    }

    try {
      console.log('📡 Calling Serper API...');
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: numResults,
        }),
      });

      console.log('📥 Serper response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Serper API error:', response.status, errorText);
        throw new Error(`Serper API error: ${response.status} - ${errorText}`);
      }

      const data: SerperResponse = await response.json();
      console.log('✅ Serper returned data:', {
        hasOrganic: !!data.organic,
        organicCount: data.organic?.length || 0,
        hasAnswerBox: !!data.answerBox,
        hasKnowledgeGraph: !!data.knowledgeGraph,
      });

      // Format results for Claude
      const results = [];

      // Add answer box if present
      if (data.answerBox?.answer) {
        results.push({
          type: 'answer',
          content: data.answerBox.answer,
          snippet: data.answerBox.snippet,
        });
      }

      // Add knowledge graph if present
      if (data.knowledgeGraph?.description) {
        results.push({
          type: 'knowledge',
          title: data.knowledgeGraph.title,
          description: data.knowledgeGraph.description,
        });
      }

      // Add organic results
      if (data.organic && data.organic.length > 0) {
        data.organic.forEach((result) => {
          results.push({
            type: 'web_result',
            title: result.title,
            url: result.link,
            snippet: result.snippet,
          });
        });
      }

      if (results.length === 0) {
        return JSON.stringify({
          found: false,
          message: 'No web results found for this query',
        });
      }

      return JSON.stringify({
        found: true,
        query,
        results,
      });
    } catch (error) {
      console.error('❌ Serper search error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      return JSON.stringify({
        error: 'Web search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
