## 使用 node.js 集成 Grok AI：从零实现流式对话接口

> author: satoru_filkli
>
> 项目地址: https://github.com/satorufilkli/Grok-chat

就在前几天，由马斯克xAI推出的大模型Grok，正式开启API的免费公测！人人均可参与，为每个账号每个月提供了25美金的免费使用额度。xAI公开了这个全新的Grok模型，代号「grok-beta」

你去申请它的API key了吗？

---

### 突发奇想

这个是创建一个key后x.ai给出的第一个测试 API 请求。

```shell	
curl https://api.x.ai/v1/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer ……" -d '{
  "messages": [
    {
      "role": "system",
      "content": "You are a test assistant."
    },
    {
      "role": "user",
      "content": "Testing. Just say hi and hello world and nothing else."
    }
  ],
  "model": "grok-beta",
  "stream": false,
  "temperature": 0
}'
```

> `curl` 是一个强大的命令行工具，用于通过网络协议（如 HTTP、HTTPS、FTP 等）传输数据。它广泛用于测试和调试网络应用程序或与 API 交互。`

作为一个linux用户对curl命令当然是不陌生的,既然可以通过curl来向https://api.x.ai/v1/chat/completions发送json请求来获取相应回答，那么简单的，我们可以写一个shell脚本实现终端的交互：

```shell
#!/bin/bash
# 主循环
echo "Grok AI Interactive Shell"
echo "Type 'exit' to quit."
while true; do
    # 提示用户输入
    read -p "You: " USER_INPUT

    # 检测退出命令
    if [[ "$USER_INPUT" == "exit" ]]; then
        echo "Exiting... Goodbye!"
        break
    fi
    # 调用 API 并获取响应
    RESPONSE=$(curl -s https://api.x.ai/v1/chat/completions \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ……（替换成你的key）" \
        -d "{
            \"messages\": [
                {\"role\": \"system\", \"content\": \"You are a test assistant.\"},
                {\"role\": \"user\", \"content\": \"$USER_INPUT\"}
            ],
            \"model\": \"grok-beta\",
            \"stream\": false,
            \"temperature\": 0
        }")

    # 直接显示 AI 的响应
    echo "Grok AI: $RESPONSE"
done

```

当然返回的内容是json格式的，content后是回答，然后其他的都是 一些参数，如果需要的话我们可以使用管道用`jq`命令解析一下 把 `RESPONSE |jq -r .choices[0].message.content`传过去就行，当然这不是本次的重点。

---

### 构思

最近在学习javascript全栈开发，或许可用express.js框架将以上对话功能集合成一个web应用。

node.js里与 `crul`相似的工具是`fetch`,此工具已集成在新版本的node上，然后我们还可以用流式响应实现发送实时数据流获取实时ai回答。

既然理论可行，好，那么实操开始！

---

### 实操

#### 1. **初始化和配置**
   ```javascript
   const express = require("express");
   const app = express();
   const PORT = 3000;
   
   const API_URL = "https://api.x.ai/v1/chat/completions";
   ```
   - 这里导入了Express框架并创建了一个Express应用实例。
   - `PORT`定义了服务器监听的端口。
   - `API_URL`定义了外部API的URL，用于与xAI的聊天服务进行交互。

#### 2. **静态文件服务**
   ```javascript
   app.use(express.static("public"));
   ```
   - 这个中间件允许服务器提供`public`目录下的静态文件（如HTML、CSS、JavaScript等）。

#### 3. **POST请求处理**

   ```javascript
   app.post("/chat", express.json(), async (req, res) => {
     // 请求处理逻辑
   });
   ```
   - 设置了一个POST路由处理器，路径为`/chat`，它接受JSON格式的数据。`express.json()`用于解析JSON请求体。

#### 4. **请求处理逻辑**
   - 从请求体中提取`message`和`apiKey`。
   - 检查是否提供了API Key，如果没有则返回错误。

#### 5. **向外部API发送请求**
   - 使用`fetch`向`API_URL`发送POST请求，携带用户的消息和API Key。
   - 设置请求头和请求体，其中包括了消息、模型选择（`grok-beta`）、流式响应选项等。

#### 6. **流式响应处理**
   - 设置响应头以支持流式传输（Server-Sent Events）。
   - 使用`getReader()`和`TextDecoder`来读取和解码从API返回的流式数据。
   - 处理数据流，每当收到数据时，将其解析并通过`res.write`发送回客户端。

#### 7. **结束流式传输**
   - 当数据流结束或收到`[DONE]`信号时，结束流式传输。

#### 8. **启动服务器**
   ```javascript
   app.listen(PORT, () => {
     console.log(`Server running at http://localhost:${PORT}`);
   });
   ```
   - 启动服务器并监听指定端口，启动后会在控制台输出一个消息。

#### 重要概念

- **流式响应（SSE - Server-Sent Events）**：这种技术允许服务器向客户端发送实时数据流，适用于聊天、实时更新等场景。
- **API Key**：用于身份验证，确保只有授权用户可以访问API。
- **外部API调用**：通过`fetch`来与外部服务进行交互，实现了与xAI的聊天功能的集成。
- **异步编程**：使用`async/await`来处理异步操作，如网络请求。

这个服务器可以作为一个前端应用的后端服务，提供聊天功能的接口，允许用户输入消息并接收实时响应。

---

然后就是前端功能的对接，一些html，css就直接用ai生成了，本次技术分享主要侧重后端逻辑的实现，其他的就不过多赘述了。

源码放在github上了：https://github.com/satorufilkli/Grok-chat，感兴趣的可以clone下来玩玩。