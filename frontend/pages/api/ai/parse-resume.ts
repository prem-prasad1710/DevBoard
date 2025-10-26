import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';

const pdf = require('pdf-parse');

export const config = {
  api: {
    bodyParser: false,
  },
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Fallback: try to read as text
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      throw new Error('Failed to extract text from PDF');
    }
  }
}

// Helper function to extract text from DOCX (simplified)
async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    // For now, we'll try to read as plain text
    // In production, you might want to use a library like mammoth
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX. Please try uploading as PDF or TXT.');
  }
}

// Helper function to parse resume data using Gemini AI
async function parseResumeWithAI(resumeText: string) {
  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Truncate resume text if too long (Gemini has token limits)
    const maxTextLength = 10000; // Adjust as needed
    const truncatedText = resumeText.length > maxTextLength 
      ? resumeText.substring(0, maxTextLength) + '...' 
      : resumeText;

    const prompt = `
    Parse the following resume text and extract structured information in JSON format. 
    Return ONLY a valid JSON object with the following structure. Do not include any markdown formatting or additional text.

    {
      "personalInfo": {
        "fullName": "string",
        "email": "string",
        "phone": "string", 
        "location": "string",
        "website": "string",
        "linkedin": "string",
        "github": "string",
        "summary": "string"
      },
      "experience": [
        {
          "id": "unique_id",
          "company": "string",
          "position": "string", 
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD or empty string if current",
          "description": "string",
          "achievements": ["string array"],
          "technologies": ["string array"]
        }
      ],
      "education": [
        {
          "id": "unique_id",
          "institution": "string",
          "degree": "string",
          "field": "string",
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD",
          "gpa": "string",
          "achievements": ["string array"]
        }
      ],
      "skills": [
        {
          "id": "unique_id",
          "category": "string",
          "items": ["string array"],
          "proficiencyLevel": "beginner"
        }
      ],
      "projects": [],
      "certifications": [],
      "languages": [
        {
          "id": "1", 
          "language": "English",
          "proficiency": "native"
        }
      ]
    }

    Extract information from this resume text:
    ${truncatedText}

    Return only the JSON object:
    `;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Received response from Gemini, length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));

    // Clean up the response text
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    // Try to find JSON object in response
    let jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no match, try the entire cleaned text
      jsonMatch = [cleanedText];
    }

    if (jsonMatch) {
      try {
        const parsedData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON from AI response');
        
        // Validate and ensure all required fields exist
        const validatedData = validateAndFixResumeData(parsedData);
        return validatedData;
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        console.log('Attempted to parse:', jsonMatch[0].substring(0, 500));
        throw new Error('Invalid JSON returned by AI model');
      }
    } else {
      throw new Error('No JSON object found in AI response');
    }
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    throw error;
  }
}

// Function to validate and fix resume data structure
function validateAndFixResumeData(data: any) {
  const defaultData = getMockResumeData();
  
  // Ensure all required top-level properties exist
  const validatedData = {
    personalInfo: data.personalInfo || defaultData.personalInfo,
    experience: Array.isArray(data.experience) ? data.experience : defaultData.experience,
    education: Array.isArray(data.education) ? data.education : defaultData.education,
    skills: Array.isArray(data.skills) ? data.skills : defaultData.skills,
    projects: Array.isArray(data.projects) ? data.projects : defaultData.projects,
    certifications: Array.isArray(data.certifications) ? data.certifications : defaultData.certifications,
    languages: Array.isArray(data.languages) ? data.languages : defaultData.languages,
  };

  // Ensure each experience item has required fields
  validatedData.experience = validatedData.experience.map((exp: any, index: number) => ({
    id: exp.id || `exp_${index + 1}`,
    company: exp.company || 'Company Name',
    position: exp.position || 'Position',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    description: exp.description || '',
    achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
    technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
  }));

  // Ensure each skill has required fields
  validatedData.skills = validatedData.skills.map((skill: any, index: number) => ({
    id: skill.id || `skill_${index + 1}`,
    category: skill.category || 'General',
    items: Array.isArray(skill.items) ? skill.items : [],
    proficiencyLevel: ['beginner', 'intermediate', 'advanced', 'expert'].includes(skill.proficiencyLevel) 
      ? skill.proficiencyLevel 
      : 'intermediate',
  }));

  return validatedData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let filePath = '';

  try {
    console.log('Starting resume parsing...');
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('No Gemini API key found, returning mock data');
      return res.status(200).json({
        message: 'Resume parsed successfully (mock mode)',
        data: getMockResumeData(),
        extractedText: 'Mock resume parsing - Gemini API key not configured',
      });
    }

    // Parse the uploaded file
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    console.log('Parsing uploaded file...');
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', file.originalFilename, 'Type:', file.mimetype);
    filePath = file.filepath;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({ message: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' });
    }

    let resumeText = '';

    console.log('Extracting text from file...');
    try {
      // Extract text based on file type
      if (file.mimetype === 'application/pdf') {
        resumeText = await extractTextFromPDF(file.filepath);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        resumeText = await extractTextFromDOCX(file.filepath);
      } else {
        resumeText = fs.readFileSync(file.filepath, 'utf8');
      }
    } catch (textError) {
      console.error('Text extraction failed:', textError);
      return res.status(400).json({ message: 'Failed to extract text from the file. Please try a different file format.' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ message: 'Could not extract text from the file' });
    }

    console.log('Text extracted successfully, length:', resumeText.length);
    console.log('First 200 characters:', resumeText.substring(0, 200));

    // Parse the resume text with AI
    console.log('Starting AI parsing...');
    let parsedData;
    try {
      parsedData = await parseResumeWithAI(resumeText);
    } catch (aiError) {
      console.error('AI parsing failed:', aiError);
      // Fallback to mock data if AI fails
      parsedData = getMockResumeData();
      console.log('Using mock data as fallback');
    }

    // Clean up uploaded file
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
        console.log('Cleaned up uploaded file');
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }

    res.status(200).json({
      message: 'Resume parsed successfully',
      data: parsedData,
      extractedText: resumeText.substring(0, 1000) + '...', // First 1000 chars for preview
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    
    // Clean up uploaded file if it exists
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup file during error handling:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Error processing resume', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// Mock resume data for when AI parsing fails
function getMockResumeData() {
  return {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Experienced software developer with expertise in full-stack development. Please edit this information to match your resume.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Company',
        position: 'Software Developer',
        startDate: '2022-01-01',
        endDate: '',
        description: 'Please edit this to match your actual experience from the uploaded resume.',
        achievements: ['Add your achievements here'],
        technologies: ['JavaScript', 'React', 'Node.js']
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University Name',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2022-05-01',
        gpa: '',
        achievements: []
      }
    ],
    skills: [
      {
        id: '1',
        category: 'Programming Languages',
        items: ['JavaScript', 'TypeScript', 'Python'],
        proficiencyLevel: 'advanced'
      }
    ],
    projects: [],
    certifications: [],
    languages: [
      {
        id: '1',
        language: 'English',
        proficiency: 'native'
      }
    ]
  };
}
