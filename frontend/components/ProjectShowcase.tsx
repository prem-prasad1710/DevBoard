// components/ProjectShowcase.tsx
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const GitFork = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitFork })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Users = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Code2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code2 })), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })), { ssr: false });

interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  technologies: string[];
  github: string;
  demo: string;
  featured: boolean;
  image: string;
  stats: {
    stars: number;
    forks: number;
    views: number;
    contributors: number;
  };
  status: 'completed' | 'in-progress' | 'planning';
  category: string;
  timeline: string;
  highlights: string[];
}

interface ProjectShowcaseProps {
  projects: Project[];
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-96 bg-muted animate-pulse rounded-lg"></div>;
  }

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = projects
    .filter(project => filter === 'all' || project.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured ? 1 : -1;
        case 'stars':
          return b.stats.stars - a.stats.stars;
        case 'recent':
          return new Date(b.timeline).getTime() - new Date(a.timeline).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress':
        return 'from-blue-500 to-cyan-500';
      case 'planning':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🚧';
      case 'planning':
        return '📋';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Filter:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm bg-background"
          >
            <option value="featured">Featured</option>
            <option value="stars">Most Stars</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card
            key={project.id}
            className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer ${
              project.featured ? 'ring-2 ring-purple-500/20' : ''
            }`}
            onClick={() => setSelectedProject(project)}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Project Image/Preview */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code2 className="h-16 w-16 text-muted-foreground/30" />
              </div>
              
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-3 left-3 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </div>
                </div>
              )}

              {/* Status indicator */}
              <div className="absolute top-3 right-3 z-20">
                <div className={`bg-gradient-to-r ${getStatusColor(project.status)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                  <span className="mr-1">{getStatusIcon(project.status)}</span>
                  {project.status.replace('-', ' ')}
                </div>
              </div>

              {/* Quick stats overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between text-white text-sm">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    {project.stats.stars}
                  </span>
                  <span className="flex items-center">
                    <GitFork className="h-3 w-3 mr-1" />
                    {project.stats.forks}
                  </span>
                </div>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {project.timeline}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.github, '_blank');
                  }}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.demo, '_blank');
                  }}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Demo
                </Button>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-blue-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Card>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedProject.name}</h2>
                  <p className="text-muted-foreground">{selectedProject.longDescription}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Stars', value: selectedProject.stats.stars, icon: Star },
                  { label: 'Forks', value: selectedProject.stats.forks, icon: GitFork },
                  { label: 'Views', value: selectedProject.stats.views, icon: Eye },
                  { label: 'Contributors', value: selectedProject.stats.contributors, icon: Users }
                ].map((stat, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 text-center">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              {selectedProject.highlights && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Key Highlights</h3>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start text-muted-foreground">
                        <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-foreground rounded-md text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </Button>
                <Button variant="outline" className="flex-1">
                  <Globe className="h-4 w-4 mr-2" />
                  Live Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
