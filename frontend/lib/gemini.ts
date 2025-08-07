// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini AI
function initializeGemini() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

export async function generateAIResponse(
  message: string,
  context: string = 'developer-mentor',
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
): Promise<string> {
  try {
    // Debug log to check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    console.log('Using AI model:', process.env.AI_MODEL || 'gemini-1.5-flash');

    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Failed to initialize Gemini AI');
    }

    const systemPrompt = `You are an expert AI mentor for software developers. You provide helpful, accurate, and practical advice on:
    - Code reviews and best practices
    - Algorithm optimization and problem solving
    - Software architecture and design patterns
    - Debugging techniques and troubleshooting
    - Career guidance and learning paths
    - Technology recommendations
    - Performance optimization
    
    Be concise but comprehensive. Provide code examples when relevant. Always be encouraging and constructive.
    Format your responses with proper markdown including code blocks with language specification.
    
    Context: ${context}`;

    // Get the model
    const model = ai.getGenerativeModel({ 
      model: process.env.AI_MODEL || 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      },
    });

    // Build conversation history
    let conversationText = systemPrompt + '\n\n';
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      conversationText += 'Previous conversation:\n';
      conversationHistory.forEach(msg => {
        conversationText += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
      });
      conversationText += '\n';
    }
    
    // Add current message
    conversationText += `Human: ${message}\nAssistant:`;

    const result = await model.generateContent(conversationText);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated from Gemini');
    }

    return text;
  } catch (error) {
    console.error('Gemini AI Response Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// New streaming function for real-time responses
export async function* generateStreamingAIResponse(
  message: string,
  context: string = 'developer-mentor',
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
): AsyncGenerator<string, void, unknown> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Failed to initialize Gemini AI');
    }

    const systemPrompt = `You are an expert AI mentor for software developers. You provide helpful, accurate, and practical advice on:
    - Code reviews and best practices
    - Algorithm optimization and problem solving
    - Software architecture and design patterns
    - Debugging techniques and troubleshooting
    - Career guidance and learning paths
    - Technology recommendations
    - Performance optimization
    
    Be concise but comprehensive. Provide code examples when relevant. Always be encouraging and constructive.
    Format your responses with proper markdown including code blocks with language specification.
    
    Context: ${context}`;

    const model = ai.getGenerativeModel({ 
      model: process.env.AI_MODEL || 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      },
    });

    // Build conversation history
    let conversationText = systemPrompt + '\n\n';
    
    if (conversationHistory.length > 0) {
      conversationText += 'Previous conversation:\n';
      conversationHistory.forEach(msg => {
        conversationText += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
      });
      conversationText += '\n';
    }
    
    conversationText += `Human: ${message}\nAssistant:`;

    // Generate streaming content
    const result = await model.generateContentStream(conversationText);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    throw new Error('Failed to generate streaming AI response');
  }
}
