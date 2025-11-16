import OpenAI from 'openai';

/**
 * DeepSeek Reasoner Demo with Streaming
 *
 * Using OpenAI SDK to call DeepSeek API with deepseek-reasoner model
 * This demo shows reasoning process first, then final content
 */
export async function reasonDemo() {
  // Get API Key from environment variable
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  // Create OpenAI client with DeepSeek API endpoint
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com/v1'
  });

  try {
    console.log('Starting DeepSeek Reasoner API call (streaming mode)...\n');

    // Create streaming chat completion request with deepseek-reasoner model
    const stream = await client.chat.completions.create({
      model: 'deepseek-reasoner',  // DeepSeek Reasoner model
      messages: [
        {
          role: 'user',
          content: 'sky is blue why?'
        }
      ],
      stream: true
    });

    let isReasoningPhase = true;

    // Process streaming response
    console.log('=== Reasoning Process ===\n');

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      // Check if we have reasoning content
      if (delta?.reasoning_content) {
        process.stdout.write(delta.reasoning_content);
      }

      // Check if we have final content (means reasoning is done)
      if (delta?.content) {
        // If this is the first content chunk, print separator
        if (isReasoningPhase) {
          console.log('\n\n=== Final Answer ===\n');
          isReasoningPhase = false;
        }
        process.stdout.write(delta.content);
      }
    }

    console.log('\n\nStreaming completed!');
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run demo if this file is executed directly
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const currentFile = fileURLToPath(import.meta.url);
const runningFile = resolve(process.argv[1]);

if (currentFile === runningFile) {
  reasonDemo().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
