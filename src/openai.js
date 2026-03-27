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
