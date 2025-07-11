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
  Eye,
  Copy,
  Share2,
  Settings
} from 'lucide-react';
import { useResume } from '../hooks';

const ResumePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: ''
  });
  const [showAddExperience, setShowAddExperience] = useState(false);

  const { resume, loading, error, refetch } = useResume();

  const handleSave = async () => {
    try {
      // This would be implemented with a mutation
      console.log('Saving resume...');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'json') => {
    try {
      // This would be implemented with a mutation
      console.log('Exporting resume as', format);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  const addExperience = () => {
    if (!newExperience.title || !newExperience.company) return;
    
    const updatedResume = {
      ...resume,
      experience: [
        ...(resume?.experience || []),
        {
          ...newExperience,
          technologies: newExperience.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
          current: !newExperience.endDate
        }
      ]
    };
    
    updateResume(updatedResume);
    setNewExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: ''
    });
    setShowAddExperience(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                  { id: 'personal', label: 'Personal Info', icon: FileText },
                  { id: 'experience', label: 'Experience', icon: FileText },
                  { id: 'education', label: 'Education', icon: FileText },
                  { id: 'skills', label: 'Skills', icon: FileText },
                  { id: 'projects', label: 'Projects', icon: FileText },
                  { id: 'certifications', label: 'Certifications', icon: FileText }
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
                    {isEditing ? (
                      <input
                        type="text"
                        className="text-center border-b-2 border-blue-500 bg-transparent text-3xl font-bold w-full"
                        defaultValue={resume?.personalInfo?.fullName || 'Your Name'}
                      />
                    ) : (
                      resume?.personalInfo?.fullName || 'Your Name'
                    )}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="text-center border-b border-gray-300 bg-transparent text-xl w-full"
                        defaultValue={resume?.personalInfo?.title || 'Professional Title'}
                      />
                    ) : (
                      resume?.personalInfo?.title || 'Professional Title'
                    )}
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
                  {isEditing ? (
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      defaultValue={resume?.personalInfo?.summary || 'Write a brief professional summary...'}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {resume?.personalInfo?.summary || 'Write a brief professional summary...'}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddExperience(true)}
                      className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  )}
                </div>

                {resume?.experience?.map((exp, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                    {exp.technologies && exp.technologies.length > 0 && (
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
                )) || (
                  <p className="text-gray-500 text-center py-8">No experience added yet</p>
                )}
              </div>

              {/* Skills Section */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                {resume?.skills?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resume.skills.map((skillCategory, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">{skillCategory.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skillCategory.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No skills added yet</p>
                )}
              </div>

              {/* Education Section */}
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                {resume?.education?.length > 0 ? (
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No education added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Experience Modal */}
      {showAddExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add Experience</h2>
                <button
                  onClick={() => setShowAddExperience(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newExperience.technologies}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, technologies: e.target.value }))}
                    placeholder="React, Node.js, Python..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddExperience(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
