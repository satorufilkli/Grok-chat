### 项目概述
这是一个简单的 Web 应用，允许用户通过浏览器与 Grok AI 进行实时对话。用户需要提供自己的 API Key 来使用服务。

### 技术架构
```mermaid
graph LR
    A[前端界面] --> B[Express 服务器]
    B --> C[X.AI Grok API]
    C --> B --> A
```

### 核心技术栈
- **前端**：HTML + CSS + JavaScript（原生）
- **后端**：Node.js + Express
- **通信**：Server-Sent Events (SSE)
- **API**：X.AI Grok API

### 主要功能
1. **API Key 管理**
   - 用户输入自己的 API Key
   - 本地存储 Key 信息
   - 密文显示保护隐私

2. **实时对话**
   - 发送消息给 AI
   - 流式接收 AI 响应
   - 实时显示对话内容

### 项目结构
```
project/
├── server.js           # 后端服务器
├── public/            # 静态资源目录
│   ├── index.html    # 主页面
│   ├── css/          # 样式文件
│   │   └── styles.css
│   └── js/           # 脚本文件
│       └── script.js
```

### 技术特点
1. **流式响应**
   - 使用 SSE 技术
   - 实时显示 AI 回复
   - 提升用户体验

2. **简洁架构**
   - 前后端分离
   - 代码结构清晰
   - 易于维护和扩展

3. **安全考虑**
   - API Key 由用户提供
   - 本地存储保护
   - 密文显示敏感信息

### 使用方法
1. 获取 X.AI 的 API Key
2. 安装依赖：`npm install`
2. 启动应用：`node server.js`
3. 访问：`http://localhost:3000`
4. 输入 API Key 并保存
5. 开始与 AI 对话

### 优势特点
1. 部署简单
2. 使用方便
3. 代码清晰
4. 实时响应
5. 可扩展性好

### 潜在改进空间
1. 添加用户认证
2. 增加对话历史存储
3. 优化界面设计
4. 添加更多 AI 模型支持
5. 强化错误处理

这是一个轻量级但功能完整的 AI 聊天应用，适合学习和进一步开发。
