import { NextRequest } from 'next/server';
import { SessionService } from '@/lib/services/session';
import { ClaudeService } from '@/lib/services/claude-with-serper';

export async function POST(req: NextRequest) {
  try {
    const { query, sessionId } = await req.json();

    console.log('=== TEA CHAT REQUEST ===');
    console.log('Query:', query);
    console.log('Session ID:', sessionId);

    if (!query || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing query or sessionId' }),
        { status: 400 }
      );
    }

    // Check if user can make more queries
    const canQuery = await SessionService.canQuery(sessionId);
    if (!canQuery) {
      console.log('Query limit reached for session:', sessionId);
      return new Response(
        JSON.stringify({
          error: 'QUERY_LIMIT_REACHED',
          message: "You've used your 2 free queries. Sign up for unlimited access!",
          queriesUsed: 2,
          maxQueries: 2,
        }),
        { status: 403 }
      );
    }

    console.log('Query limit OK, proceeding with Claude...');

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let hasStartedResponse = false;
          let toolsUsed: string[] = [];

          // Stream Claude's response with tool execution
          for await (const chunk of ClaudeService.streamMessage(query)) {
            // Only send thinking state at the very beginning
            if (!hasStartedResponse && chunk.type === 'thinking') {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
              hasStartedResponse = true;
              continue;
            }

            // Log and send tool use notifications
            if (chunk.type === 'tool_use') {
              console.log('🔧 TOOL USED:', chunk.toolName, 'with input:', chunk.toolInput);
              toolsUsed.push(chunk.toolName || 'unknown');
              
              const data = `data: ${JSON.stringify({
                type: 'tool_use',
                tool: chunk.toolName,
              })}\n\n`;
              controller.enqueue(encoder.encode(data));
              continue;
            }

            // Send text chunks
            if (chunk.type === 'chunk') {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          console.log('=== TOOLS SUMMARY ===');
          console.log('Tools used in this request:', toolsUsed.length > 0 ? toolsUsed : 'NONE');
          console.log('TrustVibe search used:', toolsUsed.includes('search_trustvibe_reviews') ? 'YES' : 'NO');
          console.log('Web search used:', toolsUsed.includes('search_web') ? 'YES ✅' : 'NO ❌');

          // Increment query count
          await SessionService.incrementQueryCount(sessionId);
          const remaining = await SessionService.getRemainingQueries(sessionId);

          console.log('Queries remaining:', remaining);

          // Send done message
          const doneData = `data: ${JSON.stringify({
            type: 'done',
            queriesRemaining: remaining,
            toolsUsed: toolsUsed, // Include tools used in response
          })}\n\n`;
          controller.enqueue(encoder.encode(doneData));

          console.log('=== REQUEST COMPLETE ===\n');
          controller.close();
        } catch (error) {
          console.error('❌ STREAMING ERROR:', error);
          
          // Send error message
          const errorData = `data: ${JSON.stringify({
            type: 'error',
            content: 'Sorry, I encountered an error. Please try again.',
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('❌ API ERROR:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
