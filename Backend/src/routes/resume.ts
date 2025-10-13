import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Resume, IResume } from '../models/Resume';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Get user's resume
router.get('/', async (req, res) => {
  try {
    // For now, we'll use a default user ID. In production, this should come from authentication
    const userId = req.query.userId || 'default-user';
    
    let resume = await Resume.findOne({ userId, isDefault: true });
    
    // If no resume exists, create a default one
    if (!resume) {
      resume = new Resume({
        userId,
        name: 'My Resume',
        isDefault: true,
        template: 'modern',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        achievements: [],
        customSections: [],
        aiGenerated: false,
        exportCount: 0
      });
      
      await resume.save();
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Update resume
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId || 'default-user';
    const updateData = req.body;
    
    let resume = await Resume.findOne({ userId, isDefault: true });
    
    if (!resume) {
      // Create new resume if it doesn't exist
      resume = new Resume({
        userId,
        name: 'My Resume',
        isDefault: true,
        template: 'modern',
        ...updateData,
        aiGenerated: false,
        exportCount: 0
      });
    } else {
      // Update existing resume
      Object.keys(updateData).forEach(key => {
        if (key !== 'userId') {
          (resume as any)[key] = updateData[key];
        }
      });
    }
    
    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Upload resume file
router.post('/upload', upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.body.userId || 'default-user';
    
    let resume = await Resume.findOne({ userId, isDefault: true });
    
    if (!resume) {
      resume = new Resume({
        userId,
        name: 'My Resume',
        isDefault: true,
        template: 'modern',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        achievements: [],
        customSections: [],
        aiGenerated: false,
        exportCount: 0
      });
    }
    
    // Store file information
    resume.uploadedResume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date()
    };
    
    await resume.save();
    
    res.json({
      message: 'Resume uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      },
      resume
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// Download resume file
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/resumes', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

// Delete resume
router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    
    const resume = await Resume.findOne({ userId, isDefault: true });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Delete uploaded file if exists
    if (resume.uploadedResume?.path && fs.existsSync(resume.uploadedResume.path)) {
      fs.unlinkSync(resume.uploadedResume.path);
    }
    
    await Resume.deleteOne({ _id: resume._id });
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Export resume as PDF (placeholder for future implementation)
router.post('/export/pdf', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    
    const resume = await Resume.findOne({ userId, isDefault: true });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Update export count
    resume.exportCount += 1;
    resume.lastExported = new Date();
    await resume.save();
    
    // TODO: Implement PDF generation
    res.json({ 
      message: 'PDF export feature coming soon',
      exportCount: resume.exportCount 
    });
  } catch (error) {
    console.error('Error exporting resume:', error);
    res.status(500).json({ error: 'Failed to export resume' });
  }
});

export default router;
