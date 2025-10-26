import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, resumeContext } = req.body;

    // Check if API key is available
    if (!apiKey) {
      console.error('Gemini API key not found');
      return res.status(200).json({ 
        response: "I'm sorry, but I need an API key to provide AI-powered suggestions. Please check your configuration and try again. In the meantime, I can suggest focusing on quantifiable achievements, using strong action verbs, and highlighting your technical impact.",
        isAI: false
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    const systemPrompt = `
You are an expert resume and career coach AI assistant. You help users improve their resumes by providing:

1. Specific, actionable feedback on resume content
2. Suggestions for better phrasing and formatting
3. Industry-specific recommendations
4. ATS optimization tips
5. Interview preparation advice
6. Career guidance based on their experience

Current Resume Context:
${JSON.stringify(resumeContext, null, 2)}

Chat History:
${messages.slice(-5).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Guidelines for responses:
- Be encouraging and supportive
- Provide specific, actionable advice
- Use professional tone
- Include examples when relevant
- Keep responses concise but helpful
- Focus on measurable improvements

User's current question/request: ${lastUserMessage}

Provide a helpful, specific response to improve their resume or answer their career question.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text, isAI: true });
  } catch (error) {
    console.error('Gemini chat error:', error);
    
    // Fallback response
    const fallbackResponse = `I'm here to help you improve your resume! I can assist with:
    
• Writing compelling bullet points with metrics
• Optimizing your professional summary
• Suggesting relevant skills and technologies
• Improving project descriptions
• ATS optimization tips
• Interview preparation

Please let me know what specific area you'd like help with, and I'll provide detailed guidance.`;

    res.status(200).json({ response: fallbackResponse, isAI: false });
  }
}
