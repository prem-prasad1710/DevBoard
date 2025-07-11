import OpenAI from 'openai';
import { AIChat, IAIChat } from '../models/AIChat';
import { logger } from '../utils/logger';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateJournalEntry(
    userId: string,
    activities: any[],
    previousEntries: any[] = []
  ): Promise<string> {
    try {
      const activitySummary = activities.map(activity => 
        `${activity.type}: ${activity.title} (${activity.repository || activity.category})`
      ).join('\n');

      const previousContext = previousEntries.length > 0 
        ? `Previous entries context:\n${previousEntries.map(entry => 
            `${entry.date}: ${entry.title} - ${entry.mood}`
          ).join('\n')}`
        : '';

      const prompt = `
        You are a helpful AI assistant that helps developers reflect on their coding journey.
        
        Based on the following activities from today, generate a thoughtful journal entry:
        
        Activities:
        ${activitySummary}
        
        ${previousContext}
        
        Generate a journal entry that includes:
        1. A reflection on the day's activities
        2. Key learnings or insights
        3. Challenges faced
        4. Achievements or progress made
        5. Goals for tomorrow
        
        Keep it personal, encouraging, and focused on growth. The tone should be reflective and motivational.
        Maximum 500 words.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful coding mentor and journal assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating journal entry:', error);
      throw error;
    }
  }

  async generateResumeSection(
    sectionType: 'summary' | 'experience' | 'skills' | 'projects',
    userData: any,
    context: any = {}
  ): Promise<string> {
    try {
      let prompt = '';
      
      switch (sectionType) {
        case 'summary':
          prompt = `
            Generate a professional summary for a developer with the following profile:
            
            Experience Level: ${userData.profile?.experience || 'Not specified'}
            Skills: ${userData.profile?.skills?.join(', ') || 'Not specified'}
            Focus Areas: ${userData.profile?.focusAreas?.join(', ') || 'Not specified'}
            Career Goals: ${userData.profile?.careerGoals?.join(', ') || 'Not specified'}
            
            Generate a 2-3 sentence professional summary that highlights their strengths and career objectives.
          `;
          break;
          
        case 'experience':
          prompt = `
            Based on the following GitHub activity and project data, generate professional experience descriptions:
            
            GitHub Activity: ${JSON.stringify(context.githubActivity || [])}
            Projects: ${JSON.stringify(context.projects || [])}
            
            Generate bullet points for experience entries that showcase technical achievements and impact.
          `;
          break;
          
        case 'skills':
          prompt = `
            Based on the following data, categorize and organize skills:
            
            Technologies used: ${context.technologies?.join(', ') || ''}
            GitHub languages: ${context.githubLanguages?.join(', ') || ''}
            User skills: ${userData.profile?.skills?.join(', ') || ''}
            
            Organize into categories like: Programming Languages, Frameworks, Tools, etc.
          `;
          break;
          
        case 'projects':
          prompt = `
            Generate professional project descriptions from the following data:
            
            Projects: ${JSON.stringify(context.projects || [])}
            GitHub Repositories: ${JSON.stringify(context.repositories || [])}
            
            For each project, include: description, technologies used, key features, and impact.
          `;
          break;
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional resume writer and career coach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating resume section:', error);
      throw error;
    }
  }

  async generateCodeReview(code: string, language: string, context: string = ''): Promise<string> {
    try {
      const prompt = `
        Please review the following ${language} code and provide constructive feedback:
        
        Context: ${context}
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Please provide feedback on:
        1. Code quality and best practices
        2. Potential bugs or issues
        3. Performance improvements
        4. Security considerations
        5. Readability and maintainability
        
        Be constructive and educational in your feedback.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an experienced software engineer and code reviewer.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating code review:', error);
      throw error;
    }
  }

  async generateDebugSuggestion(
    errorMessage: string,
    code: string,
    language: string,
    context: string = ''
  ): Promise<string> {
    try {
      const prompt = `
        Help debug this ${language} error:
        
        Error: ${errorMessage}
        
        Context: ${context}
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Please provide:
        1. Explanation of what's causing the error
        2. Step-by-step solution
        3. Best practices to avoid similar issues
        4. Alternative approaches if applicable
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful debugging assistant and programming mentor.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating debug suggestion:', error);
      throw error;
    }
  }

  async generateBlogPost(
    topic: string,
    userExperience: string,
    tone: 'technical' | 'casual' | 'professional' = 'professional',
    length: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<{ title: string; content: string; tags: string[] }> {
    try {
      const lengthGuide = {
        short: '300-500 words',
        medium: '800-1200 words',
        long: '1500-2000 words'
      };

      const prompt = `
        Write a ${tone} blog post about: ${topic}
        
        Author's experience/perspective: ${userExperience}
        
        Length: ${lengthGuide[length]}
        Tone: ${tone}
        
        The blog post should:
        1. Have an engaging title
        2. Include a compelling introduction
        3. Have clear sections with headers
        4. Include practical examples or insights
        5. End with a conclusion and call-to-action
        6. Be valuable to other developers
        
        Also suggest 5-8 relevant tags for the post.
        
        Format the response as JSON with keys: title, content, tags
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a skilled technical writer and developer advocate.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        title: result.title || 'Generated Blog Post',
        content: result.content || '',
        tags: result.tags || []
      };
    } catch (error) {
      logger.error('Error generating blog post:', error);
      throw error;
    }
  }

  async generateTweet(
    topic: string,
    context: string = '',
    style: 'informative' | 'humorous' | 'inspirational' = 'informative'
  ): Promise<string[]> {
    try {
      const prompt = `
        Generate 3 different tweets about: ${topic}
        
        Context: ${context}
        Style: ${style}
        
        Requirements:
        - Each tweet must be under 280 characters
        - Include relevant hashtags
        - Make them engaging and shareable
        - Tailor to developer audience
        
        Return as a JSON array of strings.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media expert focused on developer content.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      return JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch (error) {
      logger.error('Error generating tweets:', error);
      throw error;
    }
  }

  async startChatSession(
    userId: string,
    type: 'mentor' | 'debug' | 'code-review' | 'general',
    initialMessage: string,
    context: any = {}
  ): Promise<IAIChat> {
    try {
      const sessionId = `${userId}-${Date.now()}`;
      const systemMessage = this.getSystemMessage(type);
      
      const messages: {
        id: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
        timestamp: Date;
      }[] = [
        {
          id: `msg-${Date.now()}`,
          role: 'user' as const,
          content: initialMessage,
          timestamp: new Date(),
        }
      ];

      // Get AI response
      const aiResponse = await this.getChatResponse(systemMessage, messages, context);
      
      messages.push({
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date(),
      });

      const chatSession = await AIChat.create({
        userId,
        sessionId,
        type,
        title: this.generateChatTitle(initialMessage),
        messages,
        context,
        tags: this.extractTags(initialMessage, context),
      });

      return chatSession;
    } catch (error) {
      logger.error('Error starting chat session:', error);
      throw error;
    }
  }

  private getSystemMessage(type: string): string {
    switch (type) {
      case 'mentor':
        return 'You are an experienced software engineering mentor. Provide guidance, share best practices, and help with career development. Be encouraging and educational.';
      case 'debug':
        return 'You are a debugging expert. Help identify issues, provide solutions, and explain the root causes. Be systematic and thorough.';
      case 'code-review':
        return 'You are a senior code reviewer. Provide constructive feedback on code quality, best practices, and improvements. Be detailed and educational.';
      default:
        return 'You are a helpful AI assistant specializing in software development. Provide accurate, helpful responses to programming questions.';
    }
  }

  private async getChatResponse(systemMessage: string, messages: any[], context: any): Promise<string> {
    const openaiMessages = [
      { role: 'system', content: systemMessage },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  private generateChatTitle(message: string): string {
    const words = message.split(' ').slice(0, 5);
    return words.join(' ') + (message.split(' ').length > 5 ? '...' : '');
  }

  private extractTags(message: string, context: any): string[] {
    const tags = [];
    
    // Extract language tags
    const languages = ['javascript', 'python', 'java', 'typescript', 'react', 'node'];
    for (const lang of languages) {
      if (message.toLowerCase().includes(lang)) {
        tags.push(lang);
      }
    }
    
    // Add context tags
    if (context.language) tags.push(context.language);
    if (context.framework) tags.push(context.framework);
    
    return tags;
  }
}

export const openAIService = new OpenAIService();
