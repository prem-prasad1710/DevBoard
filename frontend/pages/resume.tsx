import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Code
} from 'lucide-react';
import { useResume } from '@/hooks';

const ResumePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');

  const { resume, loading, error, refetch } = useResume();

  const handleSave = async () => {
    try {
      console.log('Saving resume...');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'json') => {
    try {
      console.log('Exporting resume as', format);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading resume</div>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
                <p className="text-gray-600">Create and manage your professional resume</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Resume Sections Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
              <nav className="space-y-2">
                {[
                  { id: 'personal', label: 'Personal Info', icon: User },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'skills', label: 'Skills', icon: Code }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Resume Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Personal Information */}
              <div className="p-8 border-b border-gray-200">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {resume?.personalInfo?.fullName || 'Your Name'}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    Software Developer
                  </p>
                  <div className="flex justify-center gap-6 text-gray-600">
                    <span>{resume?.personalInfo?.email || 'email@example.com'}</span>
                    <span>{resume?.personalInfo?.phone || '+1 (555) 123-4567'}</span>
                    <span>{resume?.personalInfo?.location || 'City, State'}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resume?.personalInfo?.summary || 'Passionate software developer with experience in modern web technologies and a strong commitment to writing clean, efficient code. Skilled in full-stack development with expertise in React, Node.js, and cloud technologies.'}
                  </p>
                </div>
              </div>

              {/* Experience Section */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                  {isEditing && (
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  )}
                </div>

                {resume?.experience?.length > 0 ? (
                  <div className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                        {exp.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
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
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No experience added yet</p>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                {resume?.skills?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{skill.category}</span>
                          <span className="text-sm text-gray-500">{skill.proficiencyLevel}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${
                                skill.proficiencyLevel === 'expert' ? 100 :
                                skill.proficiencyLevel === 'advanced' ? 80 :
                                skill.proficiencyLevel === 'intermediate' ? 60 :
                                skill.proficiencyLevel === 'beginner' ? 40 : 50
                              }%`
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skill.items.map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No skills added yet</p>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                {resume?.education?.length > 0 ? (
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.institution}</p>
                            {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No education added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
