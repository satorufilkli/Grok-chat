const express = require("express");
const app = express();
const PORT = 3000;

const API_URL = "https://api.x.ai/v1/chat/completions";

app.use(express.static("public"));

app.post("/chat", express.json(), async (req, res) => {
  const { message, apiKey } = req.body; // 从请求中获取 API KEY

  if (!apiKey) {
    return res.status(400).json({ error: "API Key is required" });
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`, // 使用用户提供的 API KEY
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: message }],
      model: "grok-beta",
      stream: true,
      temperature: 0,
    }),
  });
  // 设置流式响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 处理流式数据
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data === "[DONE]") break;

        const json = JSON.parse(data);
        const content = json.choices[0].delta.content || "";
        res.write(`data: ${content}\n\n`);
      }
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
