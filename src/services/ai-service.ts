import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini Pro
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface AIResponse {
  output: string;
  computeProof: string;
}

export class AIService {
  private static async generateComputeProof(input: string, output: string): Promise<string> {
    // In a real implementation, this would generate a ZK proof of computation
    // For now, we'll create a simple hash of input + output
    const data = input + output;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async processTask(agentType: number, input: string): Promise<AIResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Customize prompt based on agent type
      let systemPrompt = "";
      switch (agentType) {
        case 0: // Research
          systemPrompt = "You are a research AI agent specialized in scientific analysis. ";
          break;
        case 1: // Validation
          systemPrompt = "You are a validation AI agent specialized in methodology verification. ";
          break;
        case 2: // Coordination
          systemPrompt = "You are a coordination AI agent specialized in resource management. ";
          break;
      }

      const prompt = systemPrompt + input;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const output = response.text();
      
      // Generate compute proof
      const computeProof = await this.generateComputeProof(input, output);

      return {
        output,
        computeProof
      };
    } catch (error) {
      console.error("AI processing error:", error);
      throw error;
    }
  }
}
