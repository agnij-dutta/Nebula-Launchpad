import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateResponse(messages: ChatMessage[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Convert chat history to Gemini format
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: msg.content,
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    const text = response.text();

    return {
      role: 'assistant' as const,
      content: text,
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function analyzePaper(paperText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze this research paper and provide:
    1. Key findings and contributions
    2. Potential impact on the field
    3. Technical feasibility assessment
    4. Required resources and funding needs
    
    Paper:
    ${paperText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing paper:', error);
    throw error;
  }
}
