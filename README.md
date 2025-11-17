# Node.js DeepSeek API Demo

A Node.js demo project using OpenAI SDK to call DeepSeek API with streaming support.

## Tech Stack

- **Node.js**: v22+
- **Module System**: ES Module
- **Dependencies**: openai (^4.71.0)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Copy `.env.example` to `.env` and fill in your DeepSeek API Key:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
DEEPSEEK_API_KEY=your_actual_api_key_here
```

> Get your API Key from [DeepSeek Platform](https://platform.deepseek.com/)

### 3. Run Examples

```bash
# Run streaming demo
npm run stream

# Run reasoning demo
npm run reason

# Run HTTP server with chat UI
npm run server
# Then visit http://localhost:3000/chat
```

## Project Structure

```
.
├── src/
│   ├── index.js          # Main entry file
│   ├── stream-demo.js    # Streaming output demo
│   ├── reason-demo.js    # Reasoning model demo
│   ├── server.js         # HTTP server with SSE
│   ├── chat.html         # Chat UI (Material Design)
│   └── test-client.js    # Test client
├── .env.example          # Environment variables example
├── .gitignore
├── package.json
├── CLAUDE.md             # Claude Code project instructions
└── README.md
```

## Features

- ✅ Call DeepSeek API using OpenAI SDK
- ✅ Streaming output (SSE protocol)
- ✅ DeepSeek Reasoner model support
- ✅ HTTP server with native Node.js
- ✅ Material Design chat UI
- ✅ ES Module syntax
- ✅ Environment variable management
- ✅ Error handling

## API Endpoints

- **GET /** - Service information
- **GET /chat** - Chat UI page
- **GET /health** - Health check
- **POST /api/chat** - Chat endpoint (SSE streaming)

## Code Example

### Basic Streaming

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### SSE Server

```javascript
// Request DeepSeek API
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: message }],
  stream: true
});

// Return streaming data using SSE protocol
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  if (content) {
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }
}

res.write('data: [DONE]\n\n');
res.end();
```

## Notes

- This project uses ES Modules, requires Node.js v22+
- No web frameworks (Express, Koa, etc.), only native Node.js APIs and OpenAI SDK
- DeepSeek API is fully compatible with OpenAI API

## License

MIT