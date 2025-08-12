import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const STACK_EXCHANGE_BASE_URL = 'https://api.stackexchange.com/2.3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify user is authenticated (optional for Stack Exchange public API)
    const session = await getServerSession(req, res, authOptions);
    
    // Log session status for debugging
    console.log('Session status:', !!session?.user, session?.user?.email);
    
    // For now, we'll allow unauthenticated requests to Stack Exchange API
    // since it's a public API and doesn't require user authentication
    // if (!session?.user) {
    //   return res.status(401).json({ error: 'User not authenticated' });
    // }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { endpoint, ...params } = req.query;

    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ error: 'Endpoint is required' });
    }

    // Build the Stack Exchange API URL
    const searchParams = new URLSearchParams();
    
    // Add default parameters
    searchParams.append('site', 'stackoverflow');
    
    // Add API key if available
    if (process.env.STACKOVERFLOW_API_KEY) {
      searchParams.append('key', process.env.STACKOVERFLOW_API_KEY);
    }

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    // Make the request to Stack Exchange API
    const stackExchangeUrl = `${STACK_EXCHANGE_BASE_URL}${endpoint}?${searchParams.toString()}`;
    
    const response = await fetch(stackExchangeUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DevBoard/1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`Stack Exchange API error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle specific Stack Exchange API errors
      if (response.status === 400) {
        return res.status(400).json({ 
          error: 'Bad request to Stack Exchange API',
          details: 'Please check your search parameters'
        });
      } else if (response.status === 403) {
        return res.status(403).json({ 
          error: 'Stack Exchange API quota exceeded or forbidden',
          details: 'API quota limit reached. Please try again later.'
        });
      } else if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Stack Exchange API rate limit exceeded',
          details: 'Too many requests. Please wait before trying again.'
        });
      }
      
      return res.status(response.status).json({ 
        error: `Stack Exchange API error: ${response.status} ${response.statusText}`,
        details: errorText || 'Unknown error from Stack Exchange API'
      });
    }

    const data = await response.json();
    
    // Set appropriate cache headers for Stack Exchange data
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('Stack Overflow proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
