const apiKeyInput = document.getElementById("api-key-input");
const saveKeyButton = document.getElementById("save-key-button");
const chatContainer = document.getElementById("chat-container");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// 从本地存储加载 API Key
const savedApiKey = localStorage.getItem("apiKey");
if (savedApiKey) {
  apiKeyInput.value = savedApiKey;
}

// 保存 API Key
saveKeyButton.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    localStorage.setItem("apiKey", apiKey);
    alert("API Key 已保存");
  }
});

// 添加消息到聊天界面
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;
  messageDiv.textContent = content;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 发送消息
async function sendMessage() {
  const message = messageInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!message) return;
  if (!apiKey) {
    alert("请先输入 API Key");
    return;
  }

  addMessage(message, true);
  messageInput.value = "";

  const aiMessageDiv = document.createElement("div");
  aiMessageDiv.className = "message ai-message";
  chatContainer.appendChild(aiMessageDiv);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, apiKey }), // 发送 API Key
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          aiResponse += data;
          aiMessageDiv.textContent = aiResponse;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    aiMessageDiv.textContent = "发生错误，请重试";
  }
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
