// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional
});

export async function generateAIResponse(
  message: string,
  context: string = 'developer-mentor',
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
): Promise<string> {
  try {
    // Debug log to check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Using AI model:', process.env.AI_MODEL || 'gpt-3.5-turbo');

    const systemPrompt = `You are an expert AI mentor for software developers. You provide helpful, accurate, and practical advice on:
    - Code reviews and best practices
    - Algorithm optimization and problem solving
    - Software architecture and design patterns
    - Debugging techniques and troubleshooting
    - Career guidance and learning paths
    - Technology recommendations
    - Performance optimization
    
    Be concise but comprehensive. Provide code examples when relevant. Always be encouraging and constructive.
    Format your responses with proper markdown including code blocks with language specification.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.';
  } catch (error) {
    console.error('AI Response Error:', error);
    throw new Error('Failed to generate AI response');
  }
}
