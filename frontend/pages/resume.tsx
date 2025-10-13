import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

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
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['overview', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages']));
  const resumeRef = useRef<HTMLDivElement>(null);

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
      console.log('Saving resume...');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving resume:', error);
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
      // Mock file upload
      console.log('Resume file uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload resume. Please try again.');
    }
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
        return 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Resume Builder
          </h1>
          <p className="text-muted-foreground">Create and manage your professional resume</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Template Selector */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as any)}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground text-sm"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
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

          {/* Export Options */}
          <div className="relative">
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => handleExport('json')}
                className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Save/Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
          >
            {isEditing ? (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Sections</h3>
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: User, color: 'blue' },
                { id: 'experience', label: 'Experience', icon: Briefcase, color: 'green' },
                { id: 'education', label: 'Education', icon: GraduationCap, color: 'purple' },
                { id: 'skills', label: 'Skills', icon: Code, color: 'orange' },
                { id: 'projects', label: 'Projects', icon: Briefcase, color: 'red' },
                { id: 'certifications', label: 'Certifications', icon: Award, color: 'yellow' },
                { id: 'languages', label: 'Languages', icon: Languages, color: 'indigo' }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </div>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-card-foreground mb-3">Resume Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{resume?.experience?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills</span>
                  <span className="font-medium">{resume?.skills?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-medium">{resume?.projects?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education</span>
                  <span className="font-medium">{resume?.education?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div 
            ref={resumeRef}
            data-resume-content
            className={`rounded-lg shadow-sm border ${getTemplateStyles()} transition-all duration-300`}
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
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {resume?.personalInfo?.fullName || 'Your Name'}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4">
                    Full Stack Developer
                  </p>
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
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Professional Summary</h2>
                  {isEditing && (
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {resume?.personalInfo?.summary || 'Passionate software developer with experience in modern web technologies and a strong commitment to writing clean, efficient code. Skilled in full-stack development with expertise in React, Node.js, and cloud technologies.'}
                </p>
              </div>
            </div>

            {/* Experience Section */}
            {/*
              <div id="section-experience" className="p-8 border-b border-border scroll-mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Experience
                  </h2>
                  {isEditing && (
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  )}
                </div>

                {resume?.experience && resume.experience.length > 0 ? (
                  <div className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div key={index} className="relative border-l-4 border-primary pl-6 pb-6">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                        
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{exp.position}</h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <span className="font-medium">{exp.company}</span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {exp.achievements.map((achievement, achIndex) => (
                                <li key={achIndex}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No experience added yet</h3>
                    <p className="text-muted-foreground mb-4">Add your work experience to showcase your professional journey</p>
                    {isEditing && (
                      <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </button>
                    )}
                  </div>
                )}
              </div>
            */}
            <div id="section-experience" className="p-8 border-b border-border scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </button>
                )}
              </div>

              {resume?.experience && resume.experience.length > 0 ? (
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="relative border-l-4 border-primary pl-6 pb-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{exp.position}</h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <span className="font-medium">{exp.company}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No experience added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your work experience to showcase your professional journey</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Skills Section */}
            {/*
              <div id="section-skills" className="p-8 border-b border-border scroll-mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Skills & Technologies
                  </h2>
                  {isEditing && (
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill Category
                    </button>
                  )}
                </div>

                {resume?.skills && resume.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="space-y-4 p-4 bg-accent/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-semibold text-foreground">{skill.category}</h3>
                          <span className="text-sm text-muted-foreground capitalize">{skill.proficiencyLevel}</span>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${getSkillPercentage(skill.proficiencyLevel)}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {skill.items.map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No skills added yet</h3>
                    <p className="text-muted-foreground mb-4">Showcase your technical and professional skills</p>
                    {isEditing && (
                      <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skills
                      </button>
                    )}
                  </div>
                )}
              </div>
            */}
            <div id="section-skills" className="p-8 border-b border-border scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills & Technologies
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill Category
                  </button>
                )}
              </div>

              {resume?.skills && resume.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="space-y-4 p-4 bg-accent/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold text-foreground">{skill.category}</h3>
                        <span className="text-sm text-muted-foreground capitalize">{skill.proficiencyLevel}</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${getSkillPercentage(skill.proficiencyLevel)}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No skills added yet</h3>
                  <p className="text-muted-foreground mb-4">Showcase your technical and professional skills</p>
                  {isEditing && (
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skills
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div id="section-projects" className="p-8 border-b border-border scroll-mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Projects
                </h2>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </button>
                )}
              </div>

              {resume?.projects && resume.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="bg-accent/20 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                        <div className="flex gap-2">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{project.description}</p>

                      {project.highlights && project.highlights.length > 0 && (
                        <div className="mb-4">
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {project.highlights.map((highlight, hlIndex) => (
                              <li key={hlIndex}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
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
            </div>

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
                    <div key={index} className="bg-accent/20 rounded-lg p-4 text-center">
                      <h3 className="font-medium text-foreground mb-1">{lang.language}</h3>
                      <span className="text-sm text-muted-foreground capitalize">{lang.proficiency}</span>
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
                    <div key={index} className="bg-accent/20 rounded-lg p-4 text-center">
                      <h3 className="font-medium text-foreground mb-1">{lang.language}</h3>
                      <span className="text-sm text-muted-foreground capitalize">{lang.proficiency}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
