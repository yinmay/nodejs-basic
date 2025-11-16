import { streamDemo } from './stream-demo.js';
import { reasonDemo } from './reason-demo.js';

/**
 * Main entry file
 *
 * Demonstrates how to use OpenAI SDK to call DeepSeek API
 */
async function main() {
  const demoType = process.argv[2] || 'reason';

  try {
    if (demoType === 'stream') {
      console.log('Running Stream Demo...\n');
      await streamDemo();
    } else if (demoType === 'reason') {
      console.log('Running Reasoner Demo...\n');
      await reasonDemo();
    } else {
      console.log('Usage: node src/index.js [stream|reason]');
      console.log('Default: reason\n');
      await reasonDemo();
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run main function
main();
