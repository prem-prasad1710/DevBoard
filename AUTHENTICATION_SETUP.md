# DevBoard Authentication Setup Guide

## 🚀 Making Authentication Work with Real APIs

### 1. Environment Variables Setup

Update your `.env.local` file with real values:

```bash
# GitHub OAuth App Setup
GITHUB_CLIENT_ID=your-actual-github-client-id
GITHUB_CLIENT_SECRET=your-actual-github-client-secret

# Google OAuth App Setup  
GOOGLE_CLIENT_ID=your-actual-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-random-secret-key

# Backend API (if you have one)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
API_BASE_URL=http://localhost:4000
JWT_SECRET=your-jwt-secret

# Database Connection
DATABASE_URL=mongodb://localhost:27017/devboard
```

### 2. GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: DevBoard
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

### 3. Google OAuth App Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local`

### 4. Backend API Setup Options

#### Option A: Use Existing Backend (DevBoard/Backend)

Update your existing backend to handle authentication:

```typescript
// Backend/src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'email'
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// OAuth endpoint
router.post('/oauth', async (req, res) => {
  try {
    const { provider, providerAccountId, user: userData } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: userData.email },
        { providerAccountId: providerAccountId }
      ]
    });
    
    if (!user) {
      // Create new user
      user = new User({
        name: userData.name,
        email: userData.email,
        avatar: userData.image,
        provider,
        providerAccountId,
        githubUsername: userData.username,
        bio: userData.bio,
        location: userData.location,
        website: userData.website
      });
      await user.save();
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
        githubUsername: user.githubUsername,
        bio: user.bio,
        location: user.location,
        website: user.website
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'OAuth authentication failed' });
  }
});

export default router;
```

#### Option B: Use NextAuth Only (Simpler)

If you want to use only NextAuth without a separate backend:

1. Install a database adapter:
```bash
npm install @next-auth/mongodb-adapter mongodb
# or
npm install @next-auth/prisma-adapter prisma @prisma/client
```

2. Update your NextAuth configuration to include database adapter.

### 5. Database Setup

#### MongoDB Setup:
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update DATABASE_URL in .env.local
DATABASE_URL=mongodb://localhost:27017/devboard
```

#### PostgreSQL Setup:
```bash
# Install PostgreSQL locally or use cloud service
# Update DATABASE_URL in .env.local
DATABASE_URL=postgresql://username:password@localhost:5432/devboard
```

### 6. Testing the Authentication

1. **Start your backend** (if using separate backend):
```bash
cd Backend
npm run dev
```

2. **Start your frontend**:
```bash
cd frontend
npm run dev
```

3. **Test the flows**:
   - Visit `http://localhost:3000`
   - Try GitHub OAuth login
   - Try Google OAuth login
   - Try email registration/login

### 7. Production Deployment

When deploying to production:

1. **Update environment variables** for production URLs
2. **Update OAuth app settings** with production URLs
3. **Use secure secrets** (generate with `openssl rand -base64 32`)
4. **Configure your production database**

### 8. Additional Features to Implement

- **Email verification** for new registrations
- **Password reset** functionality
- **Two-factor authentication**
- **Session management** and refresh tokens
- **Rate limiting** for auth endpoints
- **Audit logging** for security events

### 9. Testing Commands

```bash
# Test API endpoints
curl -X POST http://localhost:4000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:4000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'
```

This setup provides a complete, production-ready authentication system with OAuth providers and traditional email/password authentication!
