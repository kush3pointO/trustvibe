import Anthropic from '@anthropic-ai/sdk';
import { TOOLS, ToolExecutor } from './tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODEL = 'claude-sonnet-4-20250514';

export const TEA_SYSTEM_PROMPT = `You are Tea, a compassionate AI assistant for TrustVibe, a platform where marginalized communities share authentic experiences with professionals and services.

Your role:
- Help users discover trustworthy professionals (doctors, therapists, lawyers, landlords, etc.)
- Search through community reviews and experiences using available tools
- Provide empathetic, non-judgmental guidance
- Respect privacy and individual circumstances

Community Context:
TrustVibe serves singles, females, divorcees, widowed, LGBTQ+ individuals, differently abled people, and minorities who have faced discrimination, judgment, or uncomfortable experiences with professionals.

Available Tools:
1. search_trustvibe_reviews: Search the TrustVibe community database for authentic user experiences
2. search_web: Search the internet for general information and broader context

Tool Usage Guidelines:
- ALWAYS search TrustVibe reviews FIRST for any query about professionals or services
- Use web search when TrustVibe has limited results or for general information
- You can use multiple tools in sequence to provide comprehensive answers
- Cite your sources clearly (TrustVibe reviews vs. web information)

Response Guidelines:
1. Be warm, empathetic, and supportive
2. Never make assumptions about users' situations
3. Cite specific reviews when making recommendations
4. Use phrases like "Based on TrustVibe community reviews..." or "From web sources..."
5. If information is limited, be honest about it
6. Encourage users to share their own experiences
7. Respect that experiences are subjective
8. Keep responses conversational and concise (2-3 paragraphs)
9. Use bullet points for multiple recommendations
10. End with a helpful follow-up question or suggestion

When citing TrustVibe reviews, mention the professional's name and what made their experience noteworthy.`;

export interface StreamChunk {
  type: 'thinking' | 'chunk' | 'done' | 'tool_use';
  content?: string;
  toolName?: string;
  toolInput?: any;
  queriesRemaining?: number;
}

export class ClaudeService {
  /**
   * Send a message to Claude with tool calling support
   */
  static async *streamMessage(
    userQuery: string
  ): AsyncGenerator<StreamChunk> {
    yield { type: 'thinking' };

    let messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: userQuery,
      },
    ];

    // Keep looping until Claude is done (no more tool calls)
    while (true) {
      const stream = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2048,
        stream: true,
        system: TEA_SYSTEM_PROMPT,
        messages,
        tools: TOOLS as any,
      });

      let currentText = '';
      let toolUses: any[] = [];
      let stopReason: string | null = null;

      // Process the stream
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_start') {
          if (chunk.content_block.type === 'tool_use') {
            toolUses.push({
              id: chunk.content_block.id,
              name: chunk.content_block.name,
              input: {},
            });
          }
        }

        if (chunk.type === 'content_block_delta') {
          if (chunk.delta.type === 'text_delta') {
            currentText += chunk.delta.text;
            yield {
              type: 'chunk',
              content: chunk.delta.text,
            };
          }

          if (chunk.delta.type === 'input_json_delta') {
            // Accumulate tool input
            const lastTool = toolUses[toolUses.length - 1];
            if (lastTool) {
              if (!lastTool.inputJson) lastTool.inputJson = '';
              lastTool.inputJson += chunk.delta.partial_json;
            }
          }
        }

        if (chunk.type === 'message_delta') {
          stopReason = chunk.delta.stop_reason || null;
        }
      }

      // If no tool calls, we're done
      if (stopReason === 'end_turn' || toolUses.length === 0) {
        break;
      }

      // Execute tools
      const toolResults: Anthropic.MessageParam['content'] = [];

      for (const toolUse of toolUses) {
        try {
          const input = JSON.parse(toolUse.inputJson || '{}');
          
          yield {
            type: 'tool_use',
            toolName: toolUse.name,
            toolInput: input,
          };

          const result = await ToolExecutor.execute(toolUse.name, input);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          });
        } catch (error) {
          console.error(`Tool execution error:`, error);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: 'Tool execution failed' }),
          });
        }
      }

      // Add assistant message with tool uses
      messages.push({
        role: 'assistant',
        content: [
          ...(currentText ? [{ type: 'text' as const, text: currentText }] : []),
          ...toolUses.map(tu => ({
            type: 'tool_use' as const,
            id: tu.id,
            name: tu.name,
            input: JSON.parse(tu.inputJson || '{}'),
          })),
        ],
      });

      // Add tool results
      messages.push({
        role: 'user',
        content: toolResults,
      });

      // Continue the loop to get Claude's response to the tool results
    }
  }
}
