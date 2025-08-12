import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Plus, 
  Search, 
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
  Play,
  Edit,
  Trash2
} from 'lucide-react';
import Layout from '@/components/Layout';
// import { useProjects } from '@/hooks';

// Temporary mock hook for development
const useProjectsMock = () => {
  const [projects, setProjects] = useState<any[]>([
    {
      id: '1',
      name: 'DevBoard Platform',
      description: 'A comprehensive developer dashboard for tracking projects, journal entries, and coding activities.',
      status: 'active',
      technologies: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'MongoDB'],
      githubUrl: 'https://github.com/username/devboard',
      liveUrl: 'https://devboard.example.com',
      priority: 'high',
      progress: 75,
      startDate: new Date('2025-01-15'),
      updatedAt: new Date('2025-08-01'),
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2',
      name: 'AI Chat Assistant',
      description: 'An intelligent chatbot for helping with coding questions and debugging.',
      status: 'planning',
      technologies: ['Python', 'OpenAI API', 'FastAPI', 'React'],
      githubUrl: 'https://github.com/username/ai-chat',
      liveUrl: '',
      priority: 'medium',
      progress: 20,
      startDate: new Date('2025-07-01'),
      updatedAt: new Date('2025-07-28'),
      createdAt: new Date('2025-07-01')
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const createProject = async (projectData: any) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProjects(prev => [newProject, ...prev]);
    setLoading(false);
  };

  const updateProject = async (id: string, updates: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProjects(prev => prev.filter(project => project.id !== id));
    setLoading(false);
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: () => {}
  };
};

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjectsMock();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
        status: 'planning',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        priority: 'medium'
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject?.name.trim() || !editingProject?.description.trim()) {
      return;
    }

    try {
      await updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
        status: editingProject.status,
        technologies: typeof editingProject.technologies === 'string' 
          ? editingProject.technologies.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech)
          : editingProject.technologies,
        githubUrl: editingProject.githubUrl,
        liveUrl: editingProject.liveUrl,
        priority: editingProject.priority,
        progress: editingProject.progress
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

  const startEditingProject = (project: any) => {
    setEditingProject({
      ...project,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies.join(', ')
        : project.technologies
    });
  };

  const filteredProjects = (projects || []).filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'planning': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'on-hold': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Tracker</h1>
            <p className="text-muted-foreground">Manage and track your coding projects</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Create/Edit Project Modal */}
        {(isCreating || editingProject) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl backdrop-saturate-150 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/20">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {isCreating ? 'Create New Project' : 'Edit Project'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newProject.name : editingProject?.name || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, name: e.target.value }));
                        } else {
                          setEditingProject((prev: any) => ({ ...prev, name: e.target.value }));
                        }
                      }}
                      placeholder="Enter project name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newProject.description : editingProject?.description || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, description: e.target.value }));
                        } else {
                          setEditingProject((prev: any) => ({ ...prev, description: e.target.value }));
                        }
                      }}
                      placeholder="Describe your project..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        value={isCreating ? newProject.status : editingProject?.status || 'planning'}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, status: e.target.value as any }));
                          } else {
                            setEditingProject((prev: any) => ({ ...prev, status: e.target.value }));
                          }
                        }}
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Priority
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        value={isCreating ? newProject.priority : editingProject?.priority || 'medium'}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, priority: e.target.value as any }));
                          } else {
                            setEditingProject((prev: any) => ({ ...prev, priority: e.target.value }));
                          }
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {!isCreating && (
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        value={editingProject?.progress || 0}
                        onChange={(e) => {
                          setEditingProject((prev: any) => ({ ...prev, progress: parseInt(e.target.value) || 0 }));
                        }}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newProject.technologies : editingProject?.technologies || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewProject(prev => ({ ...prev, technologies: e.target.value }));
                        } else {
                          setEditingProject((prev: any) => ({ ...prev, technologies: e.target.value }));
                        }
                      }}
                      placeholder="React, Node.js, MongoDB, TypeScript..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        value={isCreating ? newProject.githubUrl : editingProject?.githubUrl || ''}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, githubUrl: e.target.value }));
                          } else {
                            setEditingProject((prev: any) => ({ ...prev, githubUrl: e.target.value }));
                          }
                        }}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Live URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        value={isCreating ? newProject.liveUrl : editingProject?.liveUrl || ''}
                        onChange={(e) => {
                          if (isCreating) {
                            setNewProject(prev => ({ ...prev, liveUrl: e.target.value }));
                          } else {
                            setEditingProject((prev: any) => ({ ...prev, liveUrl: e.target.value }));
                          }
                        }}
                        placeholder="https://your-project.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="px-4 py-2 border border-input rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isCreating ? handleCreateProject : handleUpdateProject}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-4">Error loading projects</div>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Start tracking your coding projects'}
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
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
                        {project.technologies.slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated {isClient ? formatDate(project.updatedAt) : ''}
                      </div>
                      <div className="text-sm font-medium text-card-foreground">
                        {project.progress}% complete
                      </div>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-row">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    <div className="flex flex-row justify-between items-center ml-auto">
                        <button
                          onClick={() => startEditingProject(project)}
                          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
                          title="Edit project"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-accent"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
