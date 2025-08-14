import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 4000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow only PDF and DOC/DOCX files
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/msword' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Mock user data
let mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  bio: 'Full-stack developer passionate about building amazing applications.',
  githubUsername: 'johndoe',
  stackOverflowUsername: 'johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  twitterUrl: 'https://twitter.com/johndoe',
  personalWebsite: 'https://johndoe.dev',
  profileImage: null // Add profile image field
};

// Mock resume data
let mockResume = {
  id: '1',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    summary: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, TypeScript, and cloud platforms. Strong advocate for clean code, test-driven development, and agile methodologies.'
  },
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      startDate: '2022-01-01',
      endDate: null,
      current: true,
      description: 'Lead development of customer-facing web applications serving 100K+ users. Architected microservices infrastructure and implemented CI/CD pipelines.',
      achievements: [
        'Improved application performance by 40% through code optimization',
        'Led a team of 4 developers in agile environment',
        'Implemented automated testing reducing bugs by 60%'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL']
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: '2020-03-01',
      endDate: '2021-12-31',
      current: false,
      description: 'Developed and maintained e-commerce platform from concept to production. Collaborated with design and product teams to deliver user-centric solutions.',
      achievements: [
        'Built responsive e-commerce platform handling 10K+ transactions',
        'Integrated payment systems and third-party APIs',
        'Mentored junior developers and conducted code reviews'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API', 'Jest']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09-01',
      endDate: '2019-05-15',
      gpa: 3.8,
      achievements: [
        'Magna Cum Laude',
        'Dean\'s List (6 semesters)',
        'Computer Science Student of the Year 2019'
      ]
    }
  ],
  skills: [
    {
      category: 'Frontend Development',
      items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
      proficiencyLevel: 'expert'
    },
    {
      category: 'Backend Development', 
      items: ['Node.js', 'Express', 'Python', 'Django', 'PostgreSQL', 'MongoDB'],
      proficiencyLevel: 'advanced'
    },
    {
      category: 'DevOps & Cloud',
      items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions'],
      proficiencyLevel: 'intermediate'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      url: 'https://demo-ecommerce.com',
      githubUrl: 'https://github.com/johndoe/ecommerce-platform',
      highlights: [
        'Built from scratch with modern tech stack',
        'Handles 10K+ products and user accounts',
        'Integrated payment gateway and shipping APIs'
      ]
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-03-15',
      expiryDate: '2026-03-15',
      url: 'https://aws.amazon.com/certification/'
    }
  ],
  languages: [
    {
      language: 'English',
      proficiency: 'native'
    },
    {
      language: 'Spanish',
      proficiency: 'conversational'
    }
  ],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-12-01T00:00:00Z',
  uploadedResume: null as any // For PDF uploads
};

// REST endpoints for now (easier to debug)
app.get('/api/user', (req, res) => {
  res.json(mockUser);
});

app.post('/api/user', (req, res) => {
  console.log('Updating user profile with:', req.body);
  mockUser = { ...mockUser, ...req.body };
  res.json(mockUser);
});

// Resume endpoints
app.get('/api/resume', (req, res) => {
  res.json(mockResume);
});

app.post('/api/resume', (req, res) => {
  console.log('Updating resume with:', req.body);
  mockResume = { ...mockResume, ...req.body, updatedAt: new Date().toISOString() };
  res.json(mockResume);
});

// Resume file upload endpoint
app.post('/api/resume/upload', upload.single('resumeFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    };

    // Update mock resume with uploaded file info
    mockResume.uploadedResume = fileInfo;
    mockResume.updatedAt = new Date().toISOString();

    console.log('Resume file uploaded:', fileInfo);
    res.json({ 
      message: 'Resume uploaded successfully', 
      file: fileInfo,
      resume: mockResume 
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔍 Health check at http://localhost:${PORT}/health`);
  console.log(`👤 User API at http://localhost:${PORT}/api/user`);
  console.log(`📄 Resume API at http://localhost:${PORT}/api/resume`);
  console.log(`📁 File uploads at http://localhost:${PORT}/api/resume/upload`);
  
  // Create uploads directory if it doesn't exist
  const fs = require('fs');
  const uploadsDir = './uploads/resumes';
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 Created uploads directory: ${uploadsDir}`);
  }
});
