import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useResume } from '@/hooks';

// Dynamically import icons to prevent hydration issues
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
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Linkedin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Linkedin })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const Languages = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Languages })), { ssr: false });
const RefreshCw = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const Printer = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Printer })), { ssr: false });
const Share = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Share })), { ssr: false });
const ChevronDown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })), { ssr: false });
const ChevronUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronUp })), { ssr: false });
const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false });

const ResumePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'experience', 'skills']));
  const [isExporting, setIsExporting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { resume, loading, error, refetch, updateResume } = useResume();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add intersection observer to update active section on scroll
  useEffect(() => {
    if (!isClient || isExporting) return; // Don't run during PDF export

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
  }, [isClient, isExporting]);

  const handleSave = async () => {
    try {
      console.log('Saving resume...');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'json') => {
    if (format === 'pdf') {
      setIsExporting(true);
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
      } finally {
        setIsExporting(false);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your resume...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-destructive mb-4">Error loading resume</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              {isClient && <RefreshCw className="h-4 w-4 mr-2" />}
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              {isClient && <FileText className="h-6 w-6 mr-2" />}
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
              {isClient && <Eye className="h-4 w-4 mr-2" />}
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>

            {/* Export Options */}
            <div className="relative">
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClient && isExporting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    isClient && <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Generating...' : 'Export PDF'}
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-lg text-foreground hover:bg-accent text-sm font-medium"
                >
                  {isClient && <Download className="h-4 w-4 mr-2" />}
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
                  {isClient && <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </>
              ) : (
                <>
                  {isClient && <Edit3 className="h-4 w-4 mr-2" />}
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
                  { id: 'projects', label: 'Projects', icon: Target, color: 'red' },
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
                      {isClient && <section.icon className="h-4 w-4 mr-3" />}
                      {section.label}
                    </div>
                    {isClient && (
                      expandedSections.has(section.id) ? 
                        <ChevronUp className="h-3 w-3" /> : 
                        <ChevronDown className="h-3 w-3" />
                    )}
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                      {resume?.personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">
                      Full Stack Developer
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center">
                      {isClient && <Mail className="h-4 w-4 mr-2" />}
                      <span>{resume?.personalInfo?.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center">
                      {isClient && <Phone className="h-4 w-4 mr-2" />}
                      <span>{resume?.personalInfo?.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="flex items-center">
                      {isClient && <MapPin className="h-4 w-4 mr-2" />}
                      <span>{resume?.personalInfo?.location || 'City, State'}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    {resume?.personalInfo?.website && (
                      <a
                        href={resume.personalInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5"
                      >
                        {isClient && <Globe className="h-4 w-4 mr-2" />}
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
                        {isClient && <Github className="h-4 w-4 mr-2" />}
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
                        {isClient && <Linkedin className="h-4 w-4 mr-2" />}
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {(activeSection === 'overview' || expandedSections.has('overview') || isExporting) && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Professional Summary</h2>
                      {isEditing && isClient && (
                        <button className="text-muted-foreground hover:text-foreground">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {resume?.personalInfo?.summary || 'Passionate software developer with experience in modern web technologies and a strong commitment to writing clean, efficient code. Skilled in full-stack development with expertise in React, Node.js, and cloud technologies.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Experience Section */}
              {(activeSection === 'experience' || expandedSections.has('experience') || isExporting) && (
                <div id="section-experience" className="p-8 border-b border-border scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <Briefcase className="h-5 w-5 mr-2" />}
                      Experience
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                                {isClient && <Building className="h-4 w-4 mr-2" />}
                                <span className="font-medium">{exp.company}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              {isClient && <Calendar className="h-4 w-4 mr-1" />}
                              {isClient ? formatDate(exp.startDate) : ''} - {exp.endDate ? (isClient ? formatDate(exp.endDate) : '') : 'Present'}
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
                      {isClient && <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No experience added yet</h3>
                      <p className="text-muted-foreground mb-4">Add your work experience to showcase your professional journey</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Experience
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {(activeSection === 'skills' || expandedSections.has('skills') || isExporting) && (
                <div id="section-skills" className="p-8 border-b border-border scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <Code className="h-5 w-5 mr-2" />}
                      Skills & Technologies
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                      {isClient && <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No skills added yet</h3>
                      <p className="text-muted-foreground mb-4">Showcase your technical and professional skills</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Skills
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Projects Section */}
              {(activeSection === 'projects' || expandedSections.has('projects') || isExporting) && (
                <div id="section-projects" className="p-8 border-b border-border scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <Target className="h-5 w-5 mr-2" />}
                      Projects
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                                  {isClient && <ExternalLink className="h-4 w-4" />}
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  {isClient && <Github className="h-4 w-4" />}
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
                      {isClient && <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No projects added yet</h3>
                      <p className="text-muted-foreground mb-4">Showcase your best work and personal projects</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Project
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Education Section */}
              {(activeSection === 'education' || expandedSections.has('education') || isExporting) && (
                <div id="section-education" className="p-8 border-b border-border scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <GraduationCap className="h-5 w-5 mr-2" />}
                      Education
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                              {isClient && <Calendar className="h-4 w-4 mr-1" />}
                              {isClient ? formatDate(edu.startDate) : ''} - {edu.endDate ? (isClient ? formatDate(edu.endDate) : '') : 'Present'}
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
                      {isClient && <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No education added yet</h3>
                      <p className="text-muted-foreground mb-4">Add your educational background and qualifications</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Education
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Certifications Section */}
              {(activeSection === 'certifications' || expandedSections.has('certifications') || isExporting) && (
                <div id="section-certifications" className="p-8 border-b border-border scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <Award className="h-5 w-5 mr-2" />}
                      Certifications
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                                {isClient && <ExternalLink className="h-4 w-4" />}
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {isClient && <Calendar className="h-3 w-3 mr-1" />}
                            Issued: {isClient ? formatDate(cert.date) : ''}
                            {cert.expiryDate && (
                              <span className="ml-2">
                                • Expires: {isClient ? formatDate(cert.expiryDate) : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      {isClient && <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No certifications added yet</h3>
                      <p className="text-muted-foreground mb-4">Add your professional certifications and licenses</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Certification
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Languages Section */}
              {(activeSection === 'languages' || expandedSections.has('languages') || isExporting) && (
                <div id="section-languages" className="p-8 scroll-mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      {isClient && <Languages className="h-5 w-5 mr-2" />}
                      Languages
                    </h2>
                    {isEditing && (
                      <button className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        {isClient && <Plus className="h-4 w-4 mr-2" />}
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
                      {isClient && <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-3" />}
                      <h3 className="text-lg font-medium text-foreground mb-2">No languages added yet</h3>
                      <p className="text-muted-foreground mb-4">Add the languages you speak and your proficiency level</p>
                      {isEditing && (
                        <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                          {isClient && <Plus className="h-4 w-4 mr-2" />}
                          Add Language
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumePage;
