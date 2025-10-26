import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Dynamically import only the icons we use
const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), { ssr: false });
const Download = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Download })), { ssr: false });
const Edit3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Edit3 })), { ssr: false });
const Save = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Save })), { ssr: false });
const Plus = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Plus })), { ssr: false });
const Trash2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trash2 })), { ssr: false });
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });
const Briefcase = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Briefcase })), { ssr: false });
const GraduationCap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GraduationCap })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Award })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });
const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Phone })), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MapPin })), { ssr: false });
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Linkedin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Linkedin })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false });
const Languages = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Languages })), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const ChevronDown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })), { ssr: false });
const ChevronUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronUp })), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })), { ssr: false });
const Palette = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Palette })), { ssr: false });
const Share2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Share2 })), { ssr: false });
const Copy = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Copy })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });

// Import MarkdownRenderer for chat message formatting
import MarkdownRenderer from '../utils/markdownRenderer';
const Send = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Send })), { ssr: false });
const Lightbulb = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lightbulb })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false });
const Settings = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Settings })), { ssr: false });
const Upload = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Upload })), { ssr: false });
const FileUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileUp })), { ssr: false });
const CheckCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false });
const AlertCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), { ssr: false });
const Loader2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Loader2 })), { ssr: false });

function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// Types for all sections
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}
interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
}
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}
interface Skill {
  id: string;
  category: string;
  items: string[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  githubUrl: string;
  highlights: string[];
}
interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  url: string;
  credentialId: string;
}
interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

interface Resume {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

// Main component
export default function ResumePage() {
  // State
  const [resume, setResume] = useState<Resume>({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong problem-solving skills and commitment to writing clean, efficient code.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Solutions Inc.',
        position: 'Senior Full Stack Developer',
        startDate: '2022-01-01',
        endDate: '',
        description: 'Led development of a microservices-based e-commerce platform serving 100K+ users.',
        achievements: [
          'Improved application performance by 40% through code optimization',
          'Mentored 3 junior developers and established code review processes',
          'Implemented CI/CD pipeline reducing deployment time by 60%'
        ],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        description: 'Built responsive web applications and improved user experience.',
        achievements: [
          'Increased user engagement by 25% through UI/UX improvements',
          'Reduced bundle size by 30% through code splitting and optimization'
        ],
        technologies: ['React', 'TypeScript', 'Redux', 'Sass']
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-01',
        gpa: '3.8',
        achievements: [
          'Graduated Magna Cum Laude',
          'President of Computer Science Club',
          'Dean\'s List for 6 semesters'
        ]
      }
    ],
    skills: [
      {
        id: '1',
        category: 'Frontend',
        items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'HTML/CSS'],
        proficiencyLevel: 'expert'
      },
      {
        id: '2',
        category: 'Backend',
        items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'],
        proficiencyLevel: 'advanced'
      },
      {
        id: '3',
        category: 'DevOps',
        items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        proficiencyLevel: 'intermediate'
      }
    ],
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution with real-time inventory management.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        url: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        highlights: [
          'Handles 10K+ concurrent users',
          'Real-time inventory tracking',
          'Payment integration with Stripe'
        ]
      },
      {
        id: '2',
        name: 'Task Management App',
        description: 'A collaborative task management application with real-time updates.',
        technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
        url: 'https://taskapp-demo.com',
        githubUrl: 'https://github.com/johndoe/taskapp',
        highlights: [
          'Real-time collaboration features',
          'Drag-and-drop interface',
          'Mobile-responsive design'
        ]
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-03-15',
        expiryDate: '2026-03-15',
        url: 'https://aws.amazon.com/certification/',
        credentialId: 'AWS-SAA-123456'
      },
      {
        id: '2',
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2022-08-10',
        expiryDate: '',
        url: 'https://developers.facebook.com/docs/development/certification/',
        credentialId: 'META-REACT-789'
      }
    ],
    languages: [
      {
        id: '1',
        language: 'English',
        proficiency: 'native'
      },
      {
        id: '2',
        language: 'Spanish',
        proficiency: 'conversational'
      },
      {
        id: '3',
        language: 'French',
        proficiency: 'basic'
      }
    ]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal' | 'creative' | 'executive'>('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['overview', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages']));
  const [loading, setLoading] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b'
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempEditValue, setTempEditValue] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoSave, setAutoSave] = useState(true);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Upload-related state
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadScreen, setShowUploadScreen] = useState(true);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Check for user authentication on component mount
  useEffect(() => {
    // Simple mock authentication check
    const userId = localStorage.getItem('userId') || 'user_' + Date.now();
    localStorage.setItem('userId', userId);
    setCurrentUser(userId);
    
    // Try to load existing resume for this user
    loadUserResume(userId);
  }, []);

  // Function to load user's existing resume
  const loadUserResume = async (userId: string) => {
    try {
      const response = await fetch(`/api/resume/save?userId=${userId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setResume(result.data);
        setHasUploadedResume(true);
        setShowUploadScreen(false);
        toast.success('Welcome back! Your resume has been loaded.');
      }
    } catch (error) {
      console.error('Error loading user resume:', error);
      // Don't show error toast for this as it's expected for new users
    }
  };

  // Effect to initialize personal info
  useEffect(() => {
    // Initialize personal info when resume loads
    if (resume?.personalInfo) {
      setResume(prev => ({
        ...prev,
        personalInfo: {
          fullName: resume.personalInfo.fullName || '',
          email: resume.personalInfo.email || '',
          phone: resume.personalInfo.phone || '',
          location: resume.personalInfo.location || '',
          website: resume.personalInfo.website || '',
          linkedin: resume.personalInfo.linkedin || '',
          github: resume.personalInfo.github || '',
          summary: resume.personalInfo.summary || ''
        }
      }));
    }
  }, [resume]);

  // Add intersection observer to update active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '');
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['overview', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'];
    sections.forEach((sectionId) => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Saving resume...');
      
      // Save to API
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resume,
          userId: currentUser,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsEditing(false);
        toast.success('Resume saved successfully! 🎉');
      } else {
        throw new Error(result.message || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      // Mock update resume
      setIsEditing(false);
      console.log('Personal info saved successfully');
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Failed to save personal information. Please try again.');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      // Create form data
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload and parse the resume
      const response = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload resume');
      }

      const result = await response.json();
      
      // Update resume state with parsed data
      if (result.data) {
        setResume(result.data);
        setExtractedData(result.data);
        setHasUploadedResume(true);
        setShowUploadScreen(false);
        toast.success('Resume uploaded and parsed successfully! 🎉');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload resume');
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Function to handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        handleFileUpload(file);
      } else {
        setUploadError('Please upload a PDF, DOCX, or TXT file');
        toast.error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      }
    }
  };

  // Function to skip upload and start fresh
  const handleSkipUpload = () => {
    setShowUploadScreen(false);
    setHasUploadedResume(false);
    // Reset to default empty resume
    setResume({
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    });
  };

  const handleExport = async (format: 'pdf' | 'json') => {
    if (format === 'pdf') {
      try {
        // Dynamically import the libraries
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;

        if (!resumeRef.current) {
          throw new Error('Resume content not found');
        }

        // Create a clone of the resume content for PDF generation
        const resumeElement = resumeRef.current;
        const originalOverflow = resumeElement.style.overflow;
        
        // Temporarily modify styles for better PDF capture
        resumeElement.style.overflow = 'visible';

        // Generate canvas from the resume content
        const canvas = await html2canvas(resumeElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          width: resumeElement.scrollWidth,
          height: resumeElement.scrollHeight,
          onclone: (clonedDoc) => {
            // Ensure all sections are visible in the clone
            const clonedElement = clonedDoc.querySelector('[data-resume-content]') as HTMLElement;
            if (clonedElement) {
              clonedElement.style.overflow = 'visible';
              clonedElement.style.height = 'auto';
            }
          }
        });

        // Restore original overflow
        resumeElement.style.overflow = originalOverflow;

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.height / canvas.width;
        const pdfAspectRatio = pdfHeight / pdfWidth;

        let imgWidth, imgHeight;
        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is taller relative to its width than PDF
          imgHeight = pdfHeight;
          imgWidth = imgHeight / canvasAspectRatio;
        } else {
          // Canvas is wider relative to its height than PDF
          imgWidth = pdfWidth;
          imgHeight = imgWidth * canvasAspectRatio;
        }

        // Center the image on the page
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `${resume?.personalInfo?.fullName || 'Resume'}_${timestamp}.pdf`;

        // Download the PDF
        pdf.save(fileName);

        console.log('PDF exported successfully');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF. Please try again.');
      }
    } else if (format === 'json') {
      try {
        const dataStr = JSON.stringify(resume, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume?.personalInfo?.fullName || 'Resume'}_data.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting JSON:', error);
        alert('Failed to export JSON. Please try again.');
      }
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getSkillPercentage = (level: string) => {
    switch (level) {
      case 'expert': return 95;
      case 'advanced': return 80;
      case 'intermediate': return 65;
      case 'beginner': return 40;
      default: return 50;
    }
  };

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'classic':
        return 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-gray-100 border-gray-100 dark:border-gray-800';
      case 'creative':
        return 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950 text-gray-900 dark:text-gray-100 border-indigo-200 dark:border-indigo-800';
      case 'executive':
        return 'bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100 border-slate-200 dark:border-slate-800';
      default: // modern
        return 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 text-gray-900 dark:text-gray-100 border-blue-200 dark:border-blue-800';
    }
  };

  const getAccentColor = () => {
    switch (selectedTemplate) {
      case 'classic':
        return 'border-blue-500 dark:border-blue-400';
      case 'minimal':
        return 'border-gray-600 dark:border-gray-400';
      case 'creative':
        return 'border-purple-500 dark:border-purple-400';
      case 'executive':
        return 'border-slate-600 dark:border-slate-400';
      default: // modern
        return 'border-indigo-500 dark:border-indigo-400';
    }
  };

  // AI-powered suggestions with Gemini integration
  const [aiSuggestions, setAiSuggestions] = useState<{[key: string]: string[]}>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiChat, setAiChat] = useState<{role: string, content: string}[]>([]);
  const [expandedChat, setExpandedChat] = useState(false);

  // Toast notification utility
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-0`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = 'translateX(calc(100% + 1rem))';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const getAISuggestions = async (section: string, context?: string) => {
    try {
      setIsGeneratingAI(true);
      
      // Show immediate feedback
      setAiSuggestions(prev => ({
        ...prev,
        [section]: ['🤖 Generating AI suggestions...']
      }));
      
      const prompt = generatePromptForSection(section, context);
      
      const response = await fetch('/api/ai/gemini-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          context: resume,
          prompt,
          userInput: context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      
      // Clear loading state and show actual suggestions
      setAiSuggestions(prev => ({
        ...prev,
        [section]: data.suggestions
      }));

      // Show success notification
      if (data.suggestions && data.suggestions.length > 0) {
        showToast(`✨ Generated ${data.suggestions.length} AI suggestions for ${section}!`, 'success');
      }

      return data.suggestions;
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      
      // Show error notification
      showToast('⚠️ API unavailable, using high-quality fallback suggestions', 'info');
      
      // Fallback to static suggestions
      const fallbackSuggestions = getStaticSuggestions(section);
      setAiSuggestions(prev => ({
        ...prev,
        [section]: fallbackSuggestions
      }));
      return fallbackSuggestions;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generatePromptForSection = (section: string, context?: string) => {
    const prompts = {
      experience: `Analyze this work experience and suggest 3-5 impactful bullet points that highlight achievements with metrics. Current context: ${context}. Focus on quantifiable results, leadership, and technical impact.`,
      skills: `Based on the current resume, suggest relevant skills and technologies that would strengthen this profile. Consider current experience: ${JSON.stringify(resume.experience)}`,
      summary: `Create a compelling professional summary (2-3 sentences) that highlights key strengths, experience level, and value proposition. Current info: ${JSON.stringify(resume.personalInfo)}`,
      projects: `Suggest project descriptions that would impress recruiters. Include technical challenges, solutions, and measurable impact.`,
      education: `Suggest relevant coursework, achievements, or academic projects that would strengthen this education section.`,
      certifications: `Recommend industry-relevant certifications based on the current skill set and experience level.`
    };
    return prompts[section as keyof typeof prompts] || `Provide helpful suggestions for improving the ${section} section of this resume.`;
  };

  const getStaticSuggestions = (section: string): string[] => {
    const suggestions = {
      experience: [
        "Led cross-functional team of 8 developers to deliver major product features",
        "Implemented automated testing reducing bug reports by 65%",
        "Optimized database queries improving application performance by 40%",
        "Architected microservices infrastructure handling 1M+ daily requests",
        "Mentored junior developers and established code review processes"
      ],
      skills: [
        "Add emerging technologies like TypeScript, GraphQL, and microservices",
        "Include cloud platforms: AWS, Azure, or Google Cloud certifications",
        "Highlight automation and DevOps tools: Docker, Kubernetes, CI/CD",
        "Showcase database expertise: PostgreSQL, MongoDB, Redis",
        "Include relevant frameworks and libraries for your stack"
      ],
      projects: [
        "Real-time chat application with 10K+ concurrent users",
        "E-commerce platform with microservices architecture",
        "AI-powered recommendation system increasing user engagement by 30%",
        "Mobile-first Progressive Web App with offline capabilities"
      ],
      summary: [
        "Results-driven software engineer with expertise in modern web technologies",
        "Full-stack developer passionate about creating scalable, user-centric solutions",
        "Technical leader with proven track record of delivering high-impact projects"
      ]
    };
    return suggestions[section as keyof typeof suggestions] || [];
  };

  // AI Chat Assistant with better UX
  const handleAIChat = async (message: string) => {
    try {
      setIsGeneratingAI(true);
      const newChat = [...aiChat, { role: 'user', content: message }];
      setAiChat(newChat);

      // Add a typing indicator immediately
      setAiChat(prev => [...prev, { role: 'assistant', content: '...' }]);

      const response = await fetch('/api/ai/resume-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newChat,
          resumeContext: resume
        }),
      });

      const data = await response.json();
      
      // Replace the typing indicator with the actual response
      setAiChat(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'assistant', content: data.response };
        return newMessages;
      });
    } catch (error) {
      console.error('Error in AI chat:', error);
      setAiChat(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again or check your network connection.' 
        };
        return newMessages;
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Share resume functionality
  const handleShare = async () => {
    try {
      const resumeData = {
        url: window.location.href,
        title: `${resume.personalInfo.fullName}'s Resume`,
        text: `Check out ${resume.personalInfo.fullName}'s professional resume`
      };
      
      if (navigator.share) {
        await navigator.share(resumeData);
      } else {
        await navigator.clipboard.writeText(resumeData.url);
        toast.success('Resume link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share resume');
    }
  };

  // Calculate resume completeness score
  const getCompletenessScore = () => {
    let score = 0;
    if (resume.personalInfo.fullName) score += 10;
    if (resume.personalInfo.email) score += 10;
    if (resume.personalInfo.summary) score += 15;
    if (resume.experience.length > 0) score += 25;
    if (resume.skills.length > 0) score += 15;
    if (resume.education.length > 0) score += 15;
    if (resume.projects.length > 0) score += 10;
    return Math.min(score, 100);
  };

  // Enhanced editing functions
  const startEditing = (section: string, field?: string, index?: number) => {
    setEditingSection(section);
    setEditingField(field || null);
    setEditingIndex(index !== undefined ? index : null);
    
    // Store current value for editing
    if (section === 'personalInfo' && field) {
      setTempEditValue(resume.personalInfo[field as keyof typeof resume.personalInfo]);
    } else if (section === 'experience' && index !== undefined) {
      setTempEditValue(resume.experience[index]);
    } else if (section === 'skills' && index !== undefined) {
      setTempEditValue(resume.skills[index]);
    }
  };

  const saveEdit = () => {
    if (!editingSection) return;

    if (editingSection === 'personalInfo' && editingField) {
      setResume(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [editingField]: tempEditValue
        }
      }));
    } else if (editingSection === 'experience' && editingIndex !== null && tempEditValue) {
      setResume(prev => ({
        ...prev,
        experience: prev.experience.map((exp, idx) => 
          idx === editingIndex ? tempEditValue : exp
        )
      }));
    } else if (editingSection === 'skills' && editingIndex !== null && tempEditValue) {
      setResume(prev => ({
        ...prev,
        skills: prev.skills.map((skill, idx) => 
          idx === editingIndex ? tempEditValue : skill
        )
      }));
    }

    cancelEdit();
    
    if (autoSave) {
      handleSave();
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingField(null);
    setEditingIndex(null);
    setTempEditValue(null);
  };

  // Add new items functions
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
      technologies: []
    };
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
    startEditing('experience', undefined, resume.experience.length);
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      category: '',
      items: [],
      proficiencyLevel: 'intermediate' as const
    };
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    startEditing('skills', undefined, resume.skills.length);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
      highlights: []
    };
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  // Delete functions
  const deleteItem = (section: string, index: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (section === 'experience') {
        setResume(prev => ({
          ...prev,
          experience: prev.experience.filter((_, idx) => idx !== index)
        }));
      } else if (section === 'skills') {
        setResume(prev => ({
          ...prev,
          skills: prev.skills.filter((_, idx) => idx !== index)
        }));
      } else if (section === 'projects') {
        setResume(prev => ({
          ...prev,
          projects: prev.projects.filter((_, idx) => idx !== index)
        }));
      } else if (section === 'education') {
        setResume(prev => ({
          ...prev,
          education: prev.education.filter((_, idx) => idx !== index)
        }));
      } else if (section === 'certifications') {
        setResume(prev => ({
          ...prev,
          certifications: prev.certifications.filter((_, idx) => idx !== index)
        }));
      } else if (section === 'languages') {
        setResume(prev => ({
          ...prev,
          languages: prev.languages.filter((_, idx) => idx !== index)
        }));
      }
    }
  };

  // Theme management
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    } p-4`}>
      <div className="max-w-7xl mx-auto">

      {/* Upload Screen - Show before everything else if user hasn't uploaded */}
      {showUploadScreen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[80vh] flex items-center justify-center"
        >
          <div className="max-w-2xl w-full">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <FileUp className="h-10 w-10" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">Welcome to Resume Builder</h1>
                <p className="text-blue-100 text-lg">Upload your existing resume or start fresh with AI assistance</p>
              </div>

              {/* Upload Area */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Upload Option */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-blue-600" />
                      Upload Your Resume
                    </h3>
                    
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => e.preventDefault()}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                        ${isUploading 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                    >
                      {isUploading ? (
                        <motion.div 
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
                          <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-400">Processing your resume...</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <motion.div 
                                className="bg-blue-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="space-y-4"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              Drop your resume here or click to browse
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Supports PDF, DOCX, and TXT files (max 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploading}
                          />
                        </motion.div>
                      )}
                    </div>

                    {uploadError && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-400">{uploadError}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Start Fresh Option */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                      Start Fresh with AI
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Create a new resume from scratch with our AI-powered assistant to guide you
                    </p>
                    <motion.button
                      onClick={handleSkipUpload}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Start Building
                    </motion.button>
                  </div>

                  {/* Features Preview */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">
                      What you'll get:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">AI-Powered</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get intelligent suggestions and improvements</p>
                      </div>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Professional</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Multiple templates and formats</p>
                      </div>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                          <Edit3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Fully Editable</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Complete control over every detail</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main Resume Builder - Show only after upload/skip */}
      {!showUploadScreen && (
        <>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            {hasUploadedResume ? 'AI Resume' : 'Resume Builder'}
            <Sparkles className="h-6 w-6 ml-2 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground mt-1">
            {hasUploadedResume 
              ? 'Your resume has been parsed and is ready for editing with AI assistance' 
              : 'Create and manage your professional resume with AI assistance'
            }
          </p>
          
          {/* Completeness Score */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                Completeness: {getCompletenessScore()}%
              </span>
              <div className="w-24 bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletenessScore()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* User Info */}
          {currentUser && (
            <div className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
              <User className="h-4 w-4 mr-2" />
              {currentUser.substring(0, 12)}...
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </>
            )}
          </button>

          {/* Auto Save Toggle */}
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              autoSave 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto Save
          </button>

          {/* AI Assistant Toggle */}
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showAIAssistant 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30'
            }`}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
            {isGeneratingAI && (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-2"></div>
            )}
          </button>

          {/* New Resume Button */}
          <button
            onClick={() => {
              setShowUploadScreen(true);
              setHasUploadedResume(false);
              setUploadError(null);
              setExtractedData(null);
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 text-sm font-medium transition-all"
            title="Upload a new resume or start fresh"
          >
            <FileUp className="h-4 w-4 mr-2" />
            New Resume
          </button>

          {/* Clear Data Button (for testing) */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                localStorage.removeItem('userId');
                setCurrentUser(null);
                setShowUploadScreen(true);
                setHasUploadedResume(false);
                setResume({
                  personalInfo: {
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                    website: '',
                    linkedin: '',
                    github: '',
                    summary: ''
                  },
                  experience: [],
                  education: [],
                  skills: [],
                  projects: [],
                  certifications: [],
                  languages: []
                });
                toast.success('All data cleared!');
                window.location.reload();
              }
            }}
            className="inline-flex items-center px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 text-sm font-medium transition-all"
            title="Clear all data (for testing)"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </button>

          {/* Template Selector */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as any)}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground text-sm"
          >
            <option value="modern">🎨 Modern</option>
            <option value="classic">📋 Classic</option>
            <option value="minimal">⚡ Minimal</option>
            <option value="creative">🎭 Creative</option>
            <option value="executive">💼 Executive</option>
          </select>

          {/* Preview Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>

          {/* Export Options */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => handleExport('json')}
              className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </button>
          </div>

          {/* Save/Edit Toggle */}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Resume
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className={`grid gap-6 ${showAIAssistant ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Enhanced AI Assistant Panel */}
        <AnimatePresence>
          {showAIAssistant && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="lg:col-span-1 order-first"
            >
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-lg border border-purple-200 dark:border-purple-800 sticky top-6 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700 bg-white/90 dark:bg-gray-800/90">
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 flex items-center">
                    <Sparkles className="h-6 w-6 mr-3 text-purple-500" />
                    AI Resume Coach
                  </h3>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Quick Actions - Compact */}
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Improvements
                    </h4>
                    <div className="grid grid-cols-3 gap-1">
                      <button 
                        onClick={() => getAISuggestions('experience')}
                        disabled={isGeneratingAI}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border border-purple-100 dark:border-purple-800 disabled:opacity-50"
                      >
                        Experience
                      </button>
                      <button 
                        onClick={() => getAISuggestions('skills')}
                        disabled={isGeneratingAI}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border border-purple-100 dark:border-purple-800 disabled:opacity-50"
                      >
                        Skills
                      </button>
                      <button 
                        onClick={() => getAISuggestions('summary')}
                        disabled={isGeneratingAI}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border border-purple-100 dark:border-purple-800 disabled:opacity-50"
                      >
                        Summary
                      </button>
                    </div>
                  </div>

                  {/* Current Suggestions - Compact */}
                  {Object.keys(aiSuggestions).length > 0 && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 text-sm flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Latest Suggestions
                      </h4>
                      {Object.entries(aiSuggestions).slice(0, 1).map(([section, suggestions]) => (
                        <div key={section} className="space-y-1">
                          {suggestions.slice(0, 2).map((suggestion, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-xs text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-2 border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(suggestion);
                                toast.success('Copied to clipboard!');
                              }}
                            >
                              <span className="mr-1">💡</span>
                              <span className="leading-relaxed">{suggestion.slice(0, 60)}...</span>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Chat Interface - Enhanced Large Version */}
                <div className="border-t border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 flex flex-col flex-1">
                  <div className="p-4 border-b border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Resume Coach Chat
                      </h4>
                      <button
                        onClick={() => setExpandedChat(!expandedChat)}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 rounded transition-colors"
                        title={expandedChat ? "Minimize Chat" : "Expand Chat"}
                      >
                        {expandedChat ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat Messages - Much Larger */}
                  <div className={`overflow-y-auto space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 flex-1 ${
                    expandedChat ? 'min-h-[60vh] max-h-[60vh]' : 'min-h-[40vh] max-h-[40vh]'
                  }`}>
                    {aiChat.length === 0 && (
                      <div className="text-center py-8">
                        <div className="relative mb-6">
                          {/* Animated AI Robot */}
                          <motion.div
                            className="w-20 h-20 mx-auto relative"
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ duration: 1, type: "spring", stiffness: 200 }}
                          >
                            {/* Outer Ring */}
                            <motion.div
                              className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-700"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Inner Ring */}
                            <motion.div
                              className="absolute inset-2 rounded-full border-2 border-purple-400 dark:border-purple-500"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* AI Core */}
                            <motion.div
                              className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 4px 20px rgba(147, 51, 234, 0.3)",
                                  "0 8px 40px rgba(147, 51, 234, 0.6)",
                                  "0 4px 20px rgba(147, 51, 234, 0.3)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Sparkles className="h-6 w-6 text-white animate-pulse" />
                            </motion.div>
                            
                            {/* Floating Particles */}
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                                style={{
                                  top: '50%',
                                  left: '50%',
                                  transformOrigin: '0 0',
                                }}
                                animate={{
                                  rotate: [0, 360],
                                  x: [0, 30 * Math.cos((i * 60) * Math.PI / 180)],
                                  y: [0, 30 * Math.sin((i * 60) * Math.PI / 180)],
                                  opacity: [0.3, 1, 0.3],
                                  scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  delay: i * 0.5,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                        <motion.div 
                          className="text-sm text-purple-600 dark:text-purple-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.8 }}
                        >
                          Hi! I'm here to help you improve your resume. Ask me anything!
                        </motion.div>
                        <motion.div 
                          className="mt-4 text-xs text-gray-500 dark:text-gray-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3, duration: 0.8 }}
                        >
                          Try asking: "How can I improve my experience section?" or "What skills should I add?"
                        </motion.div>
                      </div>
                    )}
                    {aiChat.map((message, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl shadow-sm ${
                          message.role === 'user' 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 ml-8' 
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-8 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="font-medium text-sm mb-2 flex items-center">
                          {message.role === 'user' ? (
                            <>
                              <User className="h-4 w-4 mr-2" />
                              You
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                              AI Resume Coach
                            </>
                          )}
                        </div>
                        <div className="leading-relaxed">
                          {message.role === 'assistant' ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isGeneratingAI && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-8 border border-gray-200 dark:border-gray-600 shadow-sm"
                      >
                        <div className="font-medium text-sm mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-500 animate-pulse" />
                          AI Resume Coach
                        </div>
                        <div className="flex items-center">
                          <div className="animate-pulse text-purple-600 dark:text-purple-400">Analyzing your resume and preparing suggestions...</div>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 ml-3"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Chat Input - Enhanced */}
                  <div className="p-4 border-t border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Ask about improving your resume, suggest better phrasing, or get career advice..."
                        className="flex-1 px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim() && !isGeneratingAI) {
                            handleAIChat(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        disabled={isGeneratingAI}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim() && !isGeneratingAI) {
                            handleAIChat(input.value);
                            input.value = '';
                          }
                        }}
                        disabled={isGeneratingAI}
                        className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      💡 Tip: Be specific about what you want to improve for better suggestions
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Navigation - Hidden when AI Assistant is shown */}
        {!showAIAssistant && (
          <div className="lg:col-span-1">
            <motion.div 
              layout
              className="bg-card rounded-lg shadow-sm border p-6 sticky top-6"
            >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Sections</h3>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: User, color: 'blue', count: resume.personalInfo.fullName ? 1 : 0 },
                { id: 'experience', label: 'Experience', icon: Briefcase, color: 'green', count: resume.experience.length },
                { id: 'education', label: 'Education', icon: GraduationCap, color: 'purple', count: resume.education.length },
                { id: 'skills', label: 'Skills', icon: Code, color: 'orange', count: resume.skills.length },
                { id: 'projects', label: 'Projects', icon: Briefcase, color: 'red', count: resume.projects.length },
                { id: 'certifications', label: 'Certifications', icon: Award, color: 'yellow', count: resume.certifications.length },
                { id: 'languages', label: 'Languages', icon: Languages, color: 'indigo', count: resume.languages.length }
              ].map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeSection === section.id 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    section.count > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {section.count}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Enhanced Quick Stats */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Resume Analytics
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Sections</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-600">
                    {[resume.experience.length, resume.skills.length, resume.projects.length, resume.education.length].filter(n => n > 0).length}/4
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Word Count</span>
                  <span className="font-medium">
                    {(resume.personalInfo.summary?.split(' ').length || 0) + 
                     (resume.experience.reduce((acc, exp) => acc + (exp.description?.split(' ').length || 0), 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-xs">Just now</span>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className={showAIAssistant ? "lg:col-span-1" : "lg:col-span-3"}>
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            ref={resumeRef}
            data-resume-content
            className={`rounded-lg shadow-lg border ${getTemplateStyles()} transition-all duration-300 overflow-hidden`}
            style={{
              boxShadow: selectedTemplate === 'modern' ? '0 20px 40px -12px rgba(0,0,0,0.1)' : undefined
            }}
          >
            
            {/* Personal Information Header */}
            <div id="section-overview" className="p-8 border-b border-border scroll-mt-6">
              <div className="text-center mb-8">
                <div className="mb-6">
                  {/*
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                        className="text-4xl font-bold text-foreground text-center w-full bg-transparent border-b border-border focus:border-primary outline-none"
                        placeholder="Your Full Name"
                      />
                      <input
                        type="text"
                        value="Full Stack Developer"
                        className="text-xl text-muted-foreground text-center w-full bg-transparent border-b border-border focus:border-primary outline-none"
                        placeholder="Your Job Title"
                      />
                    </div>
                  */}
                  <motion.h1 
                    className="text-4xl font-bold text-foreground mb-2 cursor-pointer hover:bg-accent/20 rounded px-2 py-1 transition-all"
                    onClick={() => isEditing && setEditingField('fullName')}
                    whileHover={isEditing ? { scale: 1.02 } : {}}
                  >
                    {editingField === 'fullName' ? (
                      <input
                        type="text"
                        value={resume.personalInfo.fullName}
                        onChange={(e) => setResume(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        className="bg-transparent border-b-2 border-primary outline-none text-center w-full"
                        autoFocus
                      />
                    ) : (
                      resume?.personalInfo?.fullName || 'Your Name'
                    )}
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-muted-foreground mb-4 cursor-pointer hover:bg-accent/20 rounded px-2 py-1 transition-all"
                    onClick={() => isEditing && setEditingField('jobTitle')}
                    whileHover={isEditing ? { scale: 1.02 } : {}}
                  >
                    {editingField === 'jobTitle' ? (
                      <input
                        type="text"
                        value="Full Stack Developer" // You can add this to state if needed
                        className="bg-transparent border-b-2 border-primary outline-none text-center w-full"
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      'Full Stack Developer'
                    )}
                  </motion.p>
                </div>

                {/* Contact Information */}
                {/*
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <input
                        type="text"
                        value={personalInfo.location}
                        onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{resume?.personalInfo?.email || 'email@example.com'}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{resume?.personalInfo?.phone || '+1 (555) 123-4567'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{resume?.personalInfo?.location || 'City, State'}</span>
                  </div>
                </div>

                {/* Social Links */}
                {/*
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <input
                        type="url"
                        value={personalInfo.website}
                        onChange={(e) => setPersonalInfo({...personalInfo, website: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      <input
                        type="url"
                        value={personalInfo.github}
                        onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-2" />
                      <input
                        type="url"
                        value={personalInfo.linkedin}
                        onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                        className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none text-sm"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                */}
                <div className="flex justify-center gap-4">
                  {resume?.personalInfo?.website && (
                    <a
                      href={resume.personalInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  )}
                  {resume?.personalInfo?.github && (
                    <a
                      href={resume.personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  )}
                  {resume?.personalInfo?.linkedin && (
                    <a
                      href={resume.personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  )}
                </div>

                {/*
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={handleSavePersonalInfo}
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingPersonalInfo(false);
                        // Reset to original values
                        if (resume?.personalInfo) {
                          setPersonalInfo({
                            fullName: resume.personalInfo.fullName || '',
                            email: resume.personalInfo.email || '',
                            phone: resume.personalInfo.phone || '',
                            location: resume.personalInfo.location || '',
                            website: resume.personalInfo.website || '',
                            linkedin: resume.personalInfo.linkedin || '',
                            github: resume.personalInfo.github || '',
                            summary: resume.personalInfo.summary || ''
                          });
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                */}
              </div>

              {/* Professional Summary */}
              {/*
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Professional Summary</h2>
                    {isEditing && (
                      <button 
                        onClick={() => setEditingPersonalInfo(!editingPersonalInfo)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                    className="w-full h-32 p-3 bg-transparent border border-border rounded-lg focus:border-primary outline-none text-muted-foreground leading-relaxed resize-none"
                    placeholder="Write a compelling professional summary that highlights your experience, skills, and career goals..."
                  />
                </div>
              */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Professional Summary</h2>
                  {isEditing && (
                    <motion.button 
                      onClick={() => setEditingField(editingField === 'summary' ? null : 'summary')}
                      className="text-muted-foreground hover:text-foreground"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
                {editingField === 'summary' ? (
                  <motion.textarea
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    value={resume.personalInfo.summary}
                    onChange={(e) => setResume(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, summary: e.target.value }
                    }))}
                    onBlur={() => setEditingField(null)}
                    className="w-full h-32 p-3 bg-accent/20 border border-border rounded-lg focus:border-primary outline-none text-muted-foreground leading-relaxed resize-none"
                    placeholder="Write a compelling professional summary..."
                    autoFocus
                  />
                ) : (
                  <motion.p 
                    className="text-muted-foreground leading-relaxed cursor-pointer hover:bg-accent/20 rounded p-3 transition-all"
                    onClick={() => isEditing && setEditingField('summary')}
                    whileHover={isEditing ? { scale: 1.01 } : {}}
                  >
                    {resume?.personalInfo?.summary || 'Passionate software developer with experience in modern web technologies and a strong commitment to writing clean, efficient code. Skilled in full-stack development with expertise in React, Node.js, and cloud technologies.'}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Experience Section */}
            <motion.div 
              id="section-experience" 
              className="p-8 border-b border-border scroll-mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {resume.experience.length} roles
                  </span>
                </h2>
                {isEditing && (
                  <motion.button 
                    onClick={addExperience}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </motion.button>
                )}
              </div>

              {resume?.experience && resume.experience.length > 0 ? (
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <motion.div 
                      key={index} 
                      className={`relative border-l-4 ${getAccentColor()} pl-6 pb-6 group hover:bg-accent/20 rounded-r-lg transition-all duration-300`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className={`absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-background group-hover:scale-125 transition-transform`}></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          {editingSection === 'experience' && editingIndex === index ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={tempEditValue?.position || ''}
                                onChange={(e) => setTempEditValue({...tempEditValue, position: e.target.value})}
                                placeholder="Job Title"
                                className="text-lg font-semibold w-full bg-accent/20 border border-border rounded px-2 py-1 focus:border-primary outline-none"
                              />
                              <input
                                type="text"
                                value={tempEditValue?.company || ''}
                                onChange={(e) => setTempEditValue({...tempEditValue, company: e.target.value})}
                                placeholder="Company Name"
                                className="w-full bg-accent/20 border border-border rounded px-2 py-1 focus:border-primary outline-none"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="date"
                                  value={tempEditValue?.startDate || ''}
                                  onChange={(e) => setTempEditValue({...tempEditValue, startDate: e.target.value})}
                                  className="text-sm bg-accent/20 border border-border rounded px-2 py-1 focus:border-primary outline-none"
                                />
                                <input
                                  type="date"
                                  value={tempEditValue?.endDate || ''}
                                  onChange={(e) => setTempEditValue({...tempEditValue, endDate: e.target.value})}
                                  placeholder="Present"
                                  className="text-sm bg-accent/20 border border-border rounded px-2 py-1 focus:border-primary outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{exp.position}</h3>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <span className="font-medium">{exp.company}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => editingSection === 'experience' && editingIndex === index ? saveEdit() : startEditing('experience', undefined, index)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              >
                                {editingSection === 'experience' && editingIndex === index ? <Save className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                              </button>
                              {editingSection === 'experience' && editingIndex === index ? (
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => deleteItem('experience', index)}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground flex items-center bg-secondary/20 px-3 py-1 rounded-full">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </div>
                        </div>
                      </div>

                      {editingSection === 'experience' && editingIndex === index ? (
                        <textarea
                          value={tempEditValue?.description || ''}
                          onChange={(e) => setTempEditValue({...tempEditValue, description: e.target.value})}
                          placeholder="Describe your role and responsibilities..."
                          className="w-full h-24 mb-4 bg-accent/20 border border-border rounded px-3 py-2 focus:border-primary outline-none text-muted-foreground leading-relaxed resize-none"
                        />
                      ) : (
                        <p className="text-muted-foreground mb-4 leading-relaxed cursor-pointer hover:bg-accent/10 rounded p-2 transition-all" 
                           onClick={() => isEditing && startEditing('experience', undefined, index)}>
                          {exp.description || 'Click to add description...'}
                        </p>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            Key Achievements:
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {exp.achievements.map((achievement, achIndex) => (
                              <motion.li 
                                key={achIndex}
                                className="flex items-start"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: achIndex * 0.05 }}
                              >
                                <span className="text-primary mr-2">•</span>
                                {achievement}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 hover:shadow-md transition-all"
                              whileHover={{ scale: 1.1 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: techIndex * 0.02 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No experience added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your work experience to showcase your professional journey</p>
                  {isEditing && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Skills Section */}
            <motion.div 
              id="section-skills" 
              className="p-8 border-b border-border scroll-mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills & Technologies
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {resume.skills.length} categories
                  </span>
                </h2>
                {isEditing && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill Category
                  </motion.button>
                )}
              </div>

              {resume?.skills && resume.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.skills.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      className="space-y-4 p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:shadow-lg transition-all duration-300 group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {skill.category}
                        </h3>
                        <span className="text-sm text-muted-foreground capitalize bg-primary/10 px-2 py-1 rounded-full">
                          {skill.proficiencyLevel}
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${getSkillPercentage(skill.proficiencyLevel)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item, itemIndex) => (
                          <motion.span
                            key={itemIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-purple/10 text-primary border border-primary/20 hover:shadow-md transition-all cursor-pointer"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: itemIndex * 0.05 }}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No skills added yet</h3>
                  <p className="text-muted-foreground mb-4">Showcase your technical and professional skills</p>
                  {isEditing && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skills
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>            {/* Projects Section */}
            <motion.div 
              id="section-projects" 
              className="p-8 border-b border-border scroll-mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Projects
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full">
                    {resume.projects.length} projects
                  </span>
                </h2>
                {isEditing && (
                  <motion.button 
                    onClick={addProject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </motion.button>
                )}
              </div>

              {resume?.projects && resume.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.projects.map((project, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-accent/20 group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditing('projects', undefined, index)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => deleteItem('projects', index)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-primary hover:text-primary/80 hover:bg-primary/10 rounded"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-primary hover:text-primary/80 hover:bg-primary/10 rounded"
                              >
                                <Github className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{project.description}</p>

                      {project.highlights && project.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            Key Features:
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {project.highlights.map((highlight, hlIndex) => (
                              <motion.li 
                                key={hlIndex}
                                className="flex items-start"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: hlIndex * 0.05 }}
                              >
                                <span className="text-primary mr-2">•</span>
                                {highlight}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 hover:shadow-md transition-all cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: techIndex * 0.02 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects added yet</h3>
                  <p className="text-muted-foreground mb-4">Showcase your best work and personal projects</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Education Section */}
            <div id="section-education" className="p-8 border-b border-border scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </button>
                )}
              </div>

              {resume?.education && resume.education.length > 0 ? (
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="relative border-l-4 border-green-500 pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.field}</p>
                          {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                        </div>
                      </div>

                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-3">
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {edu.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No education added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your educational background and qualifications</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div id="section-certifications" className="p-8 border-b border-border scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </button>
                )}
              </div>

              {resume?.certifications && resume.certifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="bg-accent/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-foreground">{cert.name}</h3>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued: {formatDate(cert.date)}
                        {cert.expiryDate && (
                          <span className="ml-2">
                            • Expires: {formatDate(cert.expiryDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No certifications added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your professional certifications and licenses</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Languages Section */}
            <div id="section-languages" className="p-8 scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Languages className="h-5 w-5 mr-2" />
                  Languages
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Language
                  </button>
                )}
              </div>

              {resume?.languages && resume.languages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {resume.languages.map((lang, index) => (
                    <div key={index} className="bg-accent/20 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
                      <h3 className="font-medium text-foreground mb-1">{lang.language}</h3>
                      <span className="text-sm text-muted-foreground capitalize">{lang.proficiency}</span>
                      <div className="mt-2 w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${
                              lang.proficiency === 'native' ? 100 : 
                              lang.proficiency === 'fluent' ? 85 : 
                              lang.proficiency === 'conversational' ? 65 : 40
                            }%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No languages added yet</h3>
                  <p className="text-muted-foreground mb-4">Add the languages you speak and your proficiency level</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Language
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
        </>
      )}
      </div>

      {/* Enhanced Toaster */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
        >
          {/* This will be managed by react-hot-toast */}
        </motion.div>
      </div>
    </div>
  );
};
