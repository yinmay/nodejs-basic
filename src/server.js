import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

/**
 * HTTP Server Example
 *
 * Create server using Node.js native http module
 * Provides /api/chat endpoint with SSE protocol for DeepSeek API streaming responses
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Simple routing
  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: '欢迎访问 DeepSeek API 服务',
      endpoints: {
        '/': 'GET - 服务信息',
        '/chat': 'GET - 聊天页面',
        '/health': 'GET - 健康检查',
        '/api/chat': 'POST - 聊天接口（SSE 流式返回）'
      }
    }));
  } else if (req.url === '/chat' && req.method === 'GET') {
    // Serve chat.html
    const htmlPath = path.join(__dirname, 'chat.html');
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading page');
        return;
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;
      res.end(data);
    });
  } else if (req.url === '/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/api/chat' && req.method === 'POST') {
    // Receive request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);

        // Set SSE response headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.statusCode = 200;

        // Request DeepSeek API
        const stream = await client.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            { role: 'user', content: message }
          ],
          stream: true
        });

        // Return streaming data using SSE protocol
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }

        // Send completion signal
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        console.error('Error:', error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      }
    });
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 404;
    res.end(JSON.stringify({
      error: '未找到请求的资源'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
