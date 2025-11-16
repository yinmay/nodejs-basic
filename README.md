# Node.js 调用 DeepSeek API 示例

这是一个使用 Node.js 和 OpenAI SDK 调用 DeepSeek API 的示例项目，演示了如何实现流式输出。

## 技术栈

- **Node.js**: v22+
- **模块系统**: ES Module
- **依赖**: openai (^4.71.0)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

复制 `.env.example` 文件为 `.env`，并填入你的 DeepSeek API Key:

```bash
cp .env.example .env
```

编辑 `.env` 文件:

```env
DEEPSEEK_API_KEY=your_actual_api_key_here
```

> 你可以从 [DeepSeek Platform](https://platform.deepseek.com/) 获取 API Key

### 3. 运行示例

```bash
# 运行主程序
npm start

# 或直接运行 stream-demo
npm run demo

# 或使用环境变量直接运行
DEEPSEEK_API_KEY=your_key node src/stream-demo.js
```

## 项目结构

```
.
├── src/
│   ├── index.js          # 主入口文件
│   └── stream-demo.js    # 流式输出示例
├── .env.example          # 环境变量示例文件
├── .gitignore
├── package.json
├── CLAUDE.md             # Claude Code 项目说明
└── README.md
```

## 功能特性

- ✅ 使用 OpenAI SDK 调用 DeepSeek API
- ✅ 实现流式输出（stream）
- ✅ ES Module 语法
- ✅ 环境变量管理
- ✅ 错误处理

## 代码示例

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '你好' }],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

## 注意事项

- 项目使用 ES Module，需要 Node.js v22+
- 不使用任何 Web 框架（如 Express、Koa 等），仅使用 Node.js 原生 API 和 OpenAI SDK
- DeepSeek API 与 OpenAI API 完全兼容，因此可以使用 OpenAI SDK

## License

MIT