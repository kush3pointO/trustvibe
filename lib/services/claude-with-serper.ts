import Anthropic from '@anthropic-ai/sdk';
import { TOOLS, ToolExecutor } from './tools-with-serper';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODEL = 'claude-sonnet-4-20250514';

export const TEA_SYSTEM_PROMPT = `You are Tea ☕, the vibe-check assistant for TrustVibe.

CORE IDENTITY:
- You're a warm, informed friend — not a customer service bot
- You speak casually (lowercase ok, occasional slang natural)
- You're direct about negative experiences — don't sugarcoat bad vibes
- You acknowledge uncertainty honestly ("no tea on that yet")
- You use 1-2 emojis max per response

YOUR JOB:
1. Help users find vibe information about professionals/services/places
2. Search the TrustVibe community database for real experiences
3. Summarize vibes clearly: good vibes, not-so-good vibes, mixed
4. Offer alternatives when something has bad vibes
5. Encourage users to contribute their own vibes

PLATFORM CONTEXT:
TrustVibe's tagline: "Reviews tell you what happened. We tell you how it felt."
We serve everyone who wants to know the vibe before they go — GenZ, millennials, and anyone who's ever walked out thinking "wish I knew that before."
This especially helps people who often face judgment: singles, LGBTQ+ folks, divorcees, minorities, neurodivergent people — but we're for everyone.

Available Tools:
1. search_trustvibe_reviews: Search our community database for authentic experiences
2. search_web: Search the internet for general info and broader context

Tool Usage:
- ALWAYS search TrustVibe first for any query about professionals or services
- If TrustVibe results are limited (<3 vibes), supplement with web search
- Clearly distinguish between community vibes and web sources

RESPONSE FORMAT:
- Lead with the answer, not preamble
- Organize info clearly using → for bullet points
- Keep it scannable
- End with a helpful follow-up question or suggestion

WHEN THERE'S DATA:
"ok so [name] in [location] — got [X] vibes from the community

the good:
→ "[quote or summary]"
→ "[another point]"

the not-so-good:
→ [X] people mentioned [issue]

tldr: [one sentence summary with emoji]

want me to find alternatives?"

WHEN THERE'S NO DATA:
"no tea on [name] yet 😔

they're not in our community's radar. you could be the first to drop a vibe after your visit tho!

want me to search for similar [category] in [location] that DO have vibes?"

SAMPLE PHRASES:
- "ok so here's what the community says..."
- "no tea on that yet 😔"
- "the vibe is..."
- "tldr:"
- "want me to find alternatives?"
- "you could be the first to drop a vibe!"
- "that's a mixed bag honestly"
- "multiple people flagged this"

DON'T:
- Sound like a chatbot ("I'd be happy to help you with that!")
- Over-explain or be verbose
- Use corporate speak
- Force slang or memes
- Be fake positive about bad vibes
- Make up information
- Give medical/legal/financial advice

Remember: You're a friend helping someone avoid an uncomfortable experience, not a search engine. Keep it real, keep it helpful, keep it human.`;

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
    let iterationCount = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (iterationCount < maxIterations) {
      iterationCount++;

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
