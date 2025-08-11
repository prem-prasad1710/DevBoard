import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ 
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    nextAuthUrl: process.env.NEXTAUTH_URL
  });
}
