import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  Edit3, 
  Trash2, 
  Star,
  GitBranch,
  ArrowLeft,
  Save,
  X,
  Clock,
  ExternalLink,
  Github,
  Globe,
  CheckCircle,
  AlertCircle,
  Pause,
  Play
} from 'lucide-react';
import { useProjects } from '../hooks';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'planning' | 'on-hold' | 'cancelled',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedHours: 0,
    actualHours: 0,
    notes: ''
  });

  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject
  } = useProjects();

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      return;
    }

    try {
      await createProject({
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        githubUrl: newProject.githubUrl,
        liveUrl: newProject.liveUrl,
        priority: newProject.priority,
        progress: 0,
        startDate: new Date()
      });
      
      setNewProject({
        name: '',
        description: '',
        status: 'active',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        priority: 'medium',
        estimatedHours: 0,
        actualHours: 0,
        notes: ''
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.name.trim() || !editingProject.description.trim()) {
      return;
    }

    try {
      await updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
        status: editingProject.status,
        technologies: editingProject.technologies || [],
        githubUrl: editingProject.githubUrl,
        liveUrl: editingProject.liveUrl,
        priority: editingProject.priority,
        estimatedHours: editingProject.estimatedHours,
        actualHours: editingProject.actualHours,
        notes: editingProject.notes
      });
      
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'archived': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Project Tracker</h1>
                <p className="text-gray-600">Manage and track your coding projects</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Create/Edit Project Modal */}
        {(isCreating || editingProject) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'Create New Project' : 'Edit Project'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={isCreating ? newProject.name : editingProject?.name || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, name: e.target.value }));
                        } else {
                          setEditingProject(prev => ({ ...prev, name: e.target.value }));
                        }
                      }}
                      placeholder="Enter project name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={isCreating ? newProject.description : editingProject?.description || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, description: e.target.value }));
                        } else {
                          setEditingProject(prev => ({ ...prev, description: e.target.value }));
                        }
                      }}
                      placeholder="Describe your project..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isCreating ? newProject.status : editingProject?.status || 'active'}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, status: e.target.value as any }));
                          } else {
                            setEditingProject(prev => ({ ...prev, status: e.target.value }));
                          }
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isCreating ? newProject.priority : editingProject?.priority || 'medium'}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, priority: e.target.value as any }));
                          } else {
                            setEditingProject(prev => ({ ...prev, priority: e.target.value }));
                          }
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={isCreating ? newProject.technologies : editingProject?.technologies?.join(', ') || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, technologies: e.target.value }));
                        } else {
                          setEditingProject(prev => ({ ...prev, technologies: e.target.value.split(',').map(tech => tech.trim()) }));
                        }
                      }}
                      placeholder="React, Node.js, MongoDB, TypeScript..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isCreating ? newProject.githubUrl : editingProject?.githubUrl || ''}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, githubUrl: e.target.value }));
                          } else {
                            setEditingProject(prev => ({ ...prev, githubUrl: e.target.value }));
                          }
                        }}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isCreating ? newProject.liveUrl : editingProject?.liveUrl || ''}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, liveUrl: e.target.value }));
                          } else {
                            setEditingProject(prev => ({ ...prev, liveUrl: e.target.value }));
                          }
                        }}
                        placeholder="https://your-project.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={isCreating ? newProject.notes : editingProject?.notes || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, notes: e.target.value }));
                        } else {
                          setEditingProject(prev => ({ ...prev, notes: e.target.value }));
                        }
                      }}
                      placeholder="Additional notes or todo items..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isCreating ? handleCreateProject : handleUpdateProject}
                    disabled={isCreatingProject || isUpdatingProject}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isCreatingProject || isUpdatingProject ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isCreating ? 'Create Project' : 'Update Project'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">Error loading projects</div>
              <p className="text-gray-600">{error.message}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Start tracking your coding projects'}
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          disabled={isDeletingProject}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority} priority
                      </span>
                    </div>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
