import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test if formidable is working
    const formidableVersion = require('formidable/package.json').version;
    
    // Test if Google AI is working
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    let aiTest = 'Not available';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Say hello in JSON format: {"message": "hello"}');
      const response = await result.response;
      aiTest = response.text();
    } catch (aiError) {
      aiTest = `AI Error: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`;
    }

    res.status(200).json({
      message: 'Resume API diagnostics',
      status: 'OK',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0
      },
      dependencies: {
        formidableVersion,
        hasPdfParse: !!require.resolve('pdf-parse'),
      },
      aiTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Diagnostic failed', 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
    });
  }
}
