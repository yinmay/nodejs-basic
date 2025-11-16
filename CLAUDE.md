# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Node.js 调用 DeepSeek API 的示例项目。

## 技术要求

- **Node.js 版本**: v22+
- **模块系统**: ES Module 语法（使用 `import/export`，而非 `require`）
- **框架限制**: 只使用 Node.js 原生代码，不使用 koa、express、nestjs 等框架
- **API 密钥**: DeepSeek API key 通过 `process.env.DEEPSEEK_API_KEY` 获取

## 开发规范

### 语言和注释
- 所有代码注释必须使用中文
- 所有问题回答使用中文

### 开发流程
- 遇到不确定的问题时，必须先询问用户，而不是直接编写代码
- 确认需求后再进行实现

## 项目架构

项目使用纯 Node.js 原生 API 实现，主要涉及：
- HTTP/HTTPS 请求处理（使用原生 `http`/`https` 模块或 `fetch` API）
- 环境变量管理（使用 `process.env`）
- ES Module 导入导出
