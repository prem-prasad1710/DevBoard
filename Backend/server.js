const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'DevBoard Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Resume routes (simple mock for now)
app.get('/api/resume/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({
    id: userId,
    personalInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA'
    },
    summary: 'Experienced developer with expertise in full-stack development',
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Lead development of web applications'
      }
    ],
    education: [
      {
        degree: 'Computer Science',
        institution: 'University of Technology',
        year: '2018'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    projects: []
  });
});

app.post('/api/resume', (req, res) => {
  console.log('Resume data received:', req.body);
  res.json({ 
    success: true, 
    message: 'Resume saved successfully',
    data: req.body 
  });
});

app.put('/api/resume/:id', (req, res) => {
  console.log('Resume update received:', req.body);
  res.json({ 
    success: true, 
    message: 'Resume updated successfully',
    data: req.body 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
