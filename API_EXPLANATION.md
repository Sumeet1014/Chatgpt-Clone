# API Connection Explanation - ChatGPT Clone

## Overview

This project uses **Groq API** with **Llama 3.1** model for AI-powered chat functionality. The connection is handled in `src/openai.js`.

---

## File: `src/openai.js`

```javascript
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function sendMsgToOpenAI(messages) {
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
    });

    return completion.choices[0].message.content;
}
```

---

## Detailed Explanation

### 1. Importing the SDK

```javascript
import Groq from "groq-sdk";
```

- Imports the official Groq JavaScript SDK
- Provides easy access to Groq's API endpoints

---

### 2. Initializing Groq Client

```javascript
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});
```

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `apiKey` | Secret key from Groq Console for authentication |
| `dangerouslyAllowBrowser` | `true` allows API calls from frontend (browser). **Warning:** Exposes API key if someone inspects your code. Use a backend proxy in production. |

**Environment Variable:**
```
VITE_GROQ_API_KEY=your_api_key_here
```

**To get API Key:**
1. Go to [console.groq.com](https://console.groq.com/keys)
2. Sign up / Log in
3. Create a new API key
4. Add it to your `.env` file

---

### 3. The Main Function

```javascript
export async function sendMsgToOpenAI(messages) { ... }
```

This is an **async function** that:
- Accepts an array of message objects
- Sends them to the AI model
- Returns the AI's response

---

### 4. Creating Chat Completion

```javascript
const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: messages,
    temperature: 0.7,
    max_tokens: 1024,
});
```

**Parameters Explained:**

| Parameter | Value | Description |
|-----------|-------|-------------|
| `model` | `llama-3.1-8b-instant` | The AI model to use. Free tier model. |
| `messages` | `messages` | Array of conversation history |
| `temperature` | `0.7` | Creativity level (0 = precise, 1 = creative) |
| `max_tokens` | `1024` | Maximum response length |

**Message Format:**

```javascript
messages = [
    { role: "user", content: "Hello!" },
    { role: "assistant", content: "Hi there!" },
    { role: "user", content: "How are you?" }
]
```

| Role | Description |
|------|-------------|
| `user` | User's message |
| `assistant` | AI's previous response |
| `system` | Instructions for AI (optional) |

---

### 5. Extracting Response

```javascript
return completion.choices[0].message.content;
```

**Response Structure:**

```javascript
{
    id: "chatcmpl-xxx",
    choices: [
        {
            message: {
                role: "assistant",
                content: "AI's response text here"
            },
            finish_reason: "stop"
        }
    ]
}
```

---

## Complete Flow Diagram

```
User Input
    ↓
App.jsx (handleSend)
    ↓
sendMsgToOpenAI(messages)
    ↓
Groq API Request
    ↓
Groq Server (processes with Llama 3.1)
    ↓
AI Response
    ↓
Display in UI
```

---

## App.jsx Integration

```javascript
const handleSend = async () => {
    // 1. Create user message
    const userMessage = { role: "user", content: input };
    
    // 2. Add to existing messages
    const newMessages = [...messages, userMessage];
    
    // 3. Show user message immediately
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        // 4. Call API with full conversation
        const response = await sendMsgToOpenAI(newMessages);
        
        // 5. Add AI response to messages
        setMessages([...newMessages, { role: "assistant", content: response }]);
    } catch (error) {
        // 6. Handle errors
        setMessages([...newMessages, { role: "assistant", content: "Error occurred" }]);
    } finally {
        setIsLoading(false);
    }
}
```

---

## Available Groq Models

| Model | Description | Free Tier |
|-------|-------------|-----------|
| `llama-3.1-8b-instant` | Fast, efficient | ✅ Yes |
| `llama-3.2-1b-preview` | Very fast, lightweight | ✅ Yes |
| `mixtral-8x7b-32768` | Good balance | ✅ Yes |
| `llama3-70b-8192` | High quality, slower | ❌ No |

---

## Security Notes

### ⚠️ Warning: API Key in Browser

Current implementation uses `dangerouslyAllowBrowser: true` which means:

**Risks:**
- API key visible in browser DevTools
- Anyone can inspect and steal your key
- Quota/credits can be abused

**Production Recommendation:**

Create a backend server (Node.js/Express) that:
1. Receives user messages
2. Makes API call with secret key
3. Returns response to frontend

```
Browser → Backend Server → Groq API
```

---

## Error Handling

```javascript
try {
    const response = await sendMsgToOpenAI(newMessages);
    setMessages([...newMessages, { role: "assistant", content: response }]);
} catch (error) {
    console.error("Error:", error);
    setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong." }]);
} finally {
    setIsLoading(false);
}
```

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Check your API key |
| 429 Rate Limited | Too many requests | Wait and retry |
| 500 Server Error | Groq server issue | Try again later |
| Network Error | No internet | Check connection |

---

## Alternative APIs

If Groq limits are reached, alternatives include:

| Service | Model | Free Tier |
|---------|-------|-----------|
| **Google Gemini** | gemini-2.0-flash | ✅ Limited |
| **OpenAI** | gpt-3.5-turbo | ✅ Limited |
| **Anthropic** | claude-3-haiku | ✅ Limited |
| **Ollama** | llama3 | ✅ Unlimited (local) |

---

## Summary

| Aspect | Details |
|--------|---------|
| **API Provider** | Groq |
| **Model** | Llama 3.1 8B Instant |
| **Max Tokens** | 1024 |
| **Temperature** | 0.7 (balanced) |
| **Authentication** | API Key in environment variable |
| **Request Type** | REST API via SDK |
