import OpenAI from 'openai';

/**
 * DeepSeek API Streaming Demo
 *
 * Using OpenAI SDK to call DeepSeek API
 * DeepSeek API is compatible with OpenAI API
 */
export async function streamDemo() {
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
    console.log('Starting DeepSeek API call (streaming mode)...\n');

    // Create streaming chat completion request
    const stream = await client.chat.completions.create({
      model: 'deepseek-chat',  // DeepSeek model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant.'
        },
        {
          role: 'user',
          content: 'Please introduce the features of Node.js in one paragraph.'
        }
      ],
      stream: true,  // Enable streaming
      temperature: 0.7,
      max_tokens: 500
    });

    // Process streaming response
    console.log('AI Response:\n');
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Output each token in real-time
        process.stdout.write(content);
      }
    }

    console.log('\n\nStreaming completed!');
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    throw error;
  }
}

// Run demo if this file is executed directly
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const currentFile = fileURLToPath(import.meta.url);
const runningFile = resolve(process.argv[1]);

if (currentFile === runningFile) {
  streamDemo().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
