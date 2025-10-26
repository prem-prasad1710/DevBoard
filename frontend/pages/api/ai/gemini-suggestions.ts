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
    const { section, context, prompt, userInput } = req.body;

    // Check if API key is available
    if (!apiKey) {
      console.error('Gemini API key not found');
      return res.status(200).json({ 
        suggestions: getFallbackSuggestions(section),
        isAI: false,
        message: 'Using fallback suggestions (API key not configured)'
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const enhancedPrompt = `
You are an expert resume writer and career coach. ${prompt}

Resume Context:
${JSON.stringify(context, null, 2)}

Additional Context: ${userInput || 'None'}

IMPORTANT: Respond with ONLY a clean JSON object. No code blocks, no additional text.

Guidelines:
- Provide 4-5 specific, actionable suggestions
- Use strong action verbs (Led, Implemented, Architected, Optimized, etc.)
- Include quantifiable metrics where possible
- Make suggestions industry-standard and ATS-friendly
- Focus on achievements rather than responsibilities

Example response format:
{
  "suggestions": [
    "Led cross-functional team of 8 developers to deliver microservices platform handling 1M+ daily requests",
    "Implemented automated CI/CD pipeline reducing deployment time by 60% and eliminating manual errors",
    "Optimized database queries and caching strategies, improving API response time by 45%",
    "Architected scalable React.js frontend serving 100K+ monthly active users"
  ]
}
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let suggestions;
    try {
      // Clean up the response text to remove code blocks and extra formatting
      let cleanText = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      // If it starts with json block syntax, clean it up
      if (cleanText.includes('```') || cleanText.includes('json')) {
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      
      const parsed = JSON.parse(cleanText);
      suggestions = parsed.suggestions || [];
      
      // Clean up individual suggestions to remove quotes and formatting
      suggestions = suggestions.map((suggestion: string) => {
        return suggestion
          .replace(/^["'`]/, '') // Remove starting quotes
          .replace(/["'`],$/, '') // Remove ending quotes with comma
          .replace(/["'`]$/, '') // Remove ending quotes
          .replace(/\\"/g, '"') // Fix escaped quotes
          .trim();
      });
      
    } catch (parseError) {
      console.log('JSON parsing failed, trying alternative extraction:', parseError);
      
      // If parsing fails, extract suggestions from text using different patterns
      let cleanText = text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/{\s*"suggestions":\s*\[/g, '')
        .replace(/\]\s*}/g, '');
      
      // Extract items that look like suggestions (quoted strings)
      const suggestionRegex = /"([^"]+)"/g;
      const matches = [];
      let match;
      
      while ((match = suggestionRegex.exec(cleanText)) !== null) {
        const suggestion = match[1].trim();
        if (suggestion.length > 20) { // Only include substantial suggestions
          matches.push(suggestion);
        }
      }
      
      suggestions = matches.slice(0, 5);
      
      // Fallback to line-by-line if regex fails
      if (suggestions.length === 0) {
        const lines = text.split('\n').filter(line => {
          const trimmed = line.trim();
          return trimmed && 
                 trimmed.length > 20 && 
                 !trimmed.includes('{') && 
                 !trimmed.includes('}') &&
                 !trimmed.includes('suggestions') &&
                 !trimmed.includes('```');
        });
        suggestions = lines.slice(0, 5).map(line => line.trim().replace(/^["'-]/, '').replace(/["',]$/, ''));
      }
    }

    // Fallback suggestions if AI fails
    if (!suggestions || suggestions.length === 0) {
      suggestions = getFallbackSuggestions(section);
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Return fallback suggestions
    const fallbackSuggestions = getFallbackSuggestions(req.body.section);
    res.status(200).json({ suggestions: fallbackSuggestions });
  }
}

function getFallbackSuggestions(section: string): string[] {
  const fallbacks: { [key: string]: string[] } = {
    experience: [
      "Led cross-functional team of X developers to deliver critical features on time",
      "Implemented automated testing suite, reducing bug reports by 60%+",
      "Optimized application performance, improving load times by 40%",
      "Mentored junior developers and established code review best practices",
      "Architected scalable solutions handling 100K+ concurrent users"
    ],
    skills: [
      "Add emerging technologies relevant to your field",
      "Include cloud platforms (AWS, Azure, GCP)",
      "Highlight automation and DevOps tools",
      "Showcase database technologies",
      "Include relevant frameworks and libraries"
    ],
    summary: [
      "Start with years of experience and key expertise areas",
      "Highlight your biggest professional achievement",
      "Mention specific technologies or domains you excel in",
      "Include leadership or collaboration experience",
      "End with your career goals or value proposition"
    ],
    projects: [
      "Built full-stack application serving 10K+ users with 99.9% uptime",
      "Developed real-time features using WebSocket technology",
      "Implemented CI/CD pipeline reducing deployment time by 80%",
      "Created responsive web application with mobile-first design",
      "Integrated third-party APIs and payment processing systems"
    ]
  };

  return fallbacks[section] || [
    "Focus on quantifiable achievements",
    "Use strong action verbs",
    "Highlight technical impact",
    "Include relevant metrics",
    "Demonstrate problem-solving skills"
  ];
}
