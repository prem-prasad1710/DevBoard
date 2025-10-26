import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { resumeData, userId } = req.body;
      
      // Here you would typically save to a database
      // For now, we'll simulate saving to a mock database
      console.log('Saving resume for user:', userId);
      console.log('Resume data:', JSON.stringify(resumeData, null, 2));
      
      // Simulate database save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.status(200).json({
        success: true,
        message: 'Resume saved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save resume',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      // Here you would typically load from a database
      // For now, we'll return a mock response
      console.log('Loading resume for user:', userId);
      
      // Simulate database load
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return empty data if no resume exists
      res.status(200).json({
        success: true,
        data: null,
        message: 'No resume found for this user'
      });
    } catch (error) {
      console.error('Error loading resume:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load resume',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
