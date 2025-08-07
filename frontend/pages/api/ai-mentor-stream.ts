// pages/api/ai-mentor-stream.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateStreamingAIResponse, generateAIResponse } from '../../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory?: Message[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received streaming message:', message.substring(0, 100) + '...');
    console.log('Environment check:', {
      hasApiKey: !!process.env.GEMINI_API_KEY,
      model: process.env.AI_MODEL,
      provider: process.env.AI_PROVIDER
    });

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    try {
      // Try streaming with Gemini first
      console.log('Attempting Gemini streaming...');
      
      try {
        const streamGenerator = generateStreamingAIResponse(message, 'developer-mentor', conversationHistory);
        
        let buffer = '';
        for await (const chunk of streamGenerator) {
          if (chunk) {
            buffer += chunk;
            // Send words in groups of 2-3 for better typing effect
            const words = buffer.split(' ');
            if (words.length >= 3) {
              const wordsToSend = words.slice(0, 3).join(' ') + ' ';
              res.write(wordsToSend);
              buffer = words.slice(3).join(' ');
              // Small delay to make streaming visible
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        }
        
        // Send remaining buffer
        if (buffer.trim()) {
          res.write(buffer);
        }
        
        res.end();
        return; // Success - exit early
        
      } catch (geminiError: any) {
        console.log('Gemini streaming failed, trying regular Gemini API');
        console.error('Gemini Streaming Error:', geminiError);
        
        // Try regular Gemini API call
        try {
          const aiResponse = await generateAIResponse(message, 'developer-mentor', conversationHistory);
          
          // Stream the response word by word with typing effect
          const words = aiResponse.split(' ');
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');
            res.write(word);
            
            // More realistic typing delays
            const wordLength = words[i].length;
            let delay = 50; // base delay
            
            if (wordLength > 8) {
              delay = 150; // longer pause for long words
            } else if (wordLength > 4) {
              delay = 100; // medium pause for medium words
            }
            
            // Add extra pause after punctuation
            if (words[i].includes('.') || words[i].includes('!') || words[i].includes('?')) {
              delay += 200;
            } else if (words[i].includes(',') || words[i].includes(':')) {
              delay += 100;
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          res.end();
          return; // Success - exit early
          
        } catch (regularGeminiError: any) {
          console.log('Regular Gemini API also failed, using intelligent fallback');
          console.error('Regular Gemini Error:', regularGeminiError);
        }
      }
      
      // Fallback to mock response only if both Gemini attempts fail
      console.log('Using fallback mock response');
      const fallbackResponse = await generateIntelligentMockResponse(message, conversationHistory);
      
      // Stream word by word with typing effect
      const words = fallbackResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? ' ' : '');
        res.write(word);
        
        // More realistic typing delays - faster for short words, slower for long words
        const wordLength = words[i].length;
        let delay = 50; // base delay
        
        if (wordLength > 8) {
          delay = 150; // longer pause for long words
        } else if (wordLength > 4) {
          delay = 100; // medium pause for medium words
        }
        
        // Add extra pause after punctuation
        if (words[i].includes('.') || words[i].includes('!') || words[i].includes('?')) {
          delay += 200;
        } else if (words[i].includes(',') || words[i].includes(':')) {
          delay += 100;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      res.end();
    } catch (error: any) {
      console.log('Fallback streaming failed');
      console.error('Streaming Error:', error);
      
      // Emergency fallback
      res.write('Sorry, I encountered an error. Please try again.');
      res.end();
    }
  } catch (error) {
    console.error('AI Mentor Streaming API Error:', error);
    res.writeHead(500);
    res.end('Error: Failed to generate response');
  }
}

// Intelligent mock response function (same as before but shorter for streaming)
async function generateIntelligentMockResponse(message: string, history: Message[]): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Shorter responses for better streaming experience
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('prem')) {
    return `Hi Prem! 👋 Great to meet you! I'm your AI coding mentor.

**I can help you with:**
• Code reviews and optimization
• Algorithm problem solving  
• Architecture design
• Debugging strategies
• Career guidance

What coding challenge would you like to tackle today?`;
  }
  
  if (lowerMessage.includes('code review')) {
    return `I'd love to help with your code review! 

**My review process:**
• **Structure**: Clean, readable code organization
• **Performance**: Efficiency and optimization opportunities  
• **Security**: Vulnerability checks and best practices
• **Testing**: Testability and edge case handling

Share your code and I'll provide specific feedback! 🚀`;
  }
  
  if (lowerMessage.includes('algorithm') || lowerMessage.includes('optimize')) {
    return `Great algorithm question! Let's optimize your solution:

**Optimization strategy:**
1. **Analyze complexity** - Current time/space usage
2. **Identify bottlenecks** - Where can we improve?
3. **Apply patterns** - Hash maps, two pointers, memoization

**Example - Two Sum optimization:**
\`\`\`javascript
// O(n²) → O(n) with hash map
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
}
\`\`\`

What algorithm are you working on?`;
  }
  
  return `Thanks for your question! I'm here to help with your development journey.

**I specialize in:**
• **Code reviews** - Detailed feedback and improvements
• **Algorithm optimization** - Making solutions faster
• **Architecture design** - Scalable system structure
• **Debugging help** - Systematic problem solving
• **Career guidance** - Next steps and learning paths

Share your specific challenge and I'll provide targeted assistance! 💻✨`;
}
