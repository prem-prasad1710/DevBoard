import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically import icons to prevent hydration issues
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MapPin })), { ssr: false });
const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Phone })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Linkedin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Linkedin })), { ssr: false });
const Twitter = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Twitter })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Award })), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const Briefcase = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Briefcase })), { ssr: false });
const GraduationCap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GraduationCap })), { ssr: false });
const Download = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Download })), { ssr: false });
const Edit = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Edit })), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false });
const EyeOff = dynamic(() => import('lucide-react').then(mod => ({ default: mod.EyeOff })), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  avatar: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    github: string;
    demo: string;
    featured: boolean;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: string;
  }>;
  stats: {
    totalProjects: number;
    githubStars: number;
    yearsExperience: number;
    technologiesUsed: number;
  };
}

const ProfilePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const { user, updateUser } = useAuth();

  // Sample profile data - in real app this would come from API/database
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "Developer",
    title: "Full Stack Developer & AI Enthusiast",
    bio: "Passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and exploring the intersection of AI and web development. Always eager to learn new technologies and solve complex problems.",
    location: user?.location || "San Francisco, CA",
    email: user?.email || "developer@example.com",
    phone: "+1 (555) 123-4567",
    website: user?.website || "https://developer.dev",
    avatar: user?.avatar || "/api/placeholder/150/150",
    github: user?.provider === 'github' ? `https://github.com/${user.githubUsername || user.email.split('@')[0]}` : "https://github.com/developer",
    linkedin: "https://linkedin.com/in/developer",
    twitter: "https://twitter.com/developer",
    skills: [
      { name: "JavaScript", level: 95, category: "Frontend" },
      { name: "TypeScript", level: 90, category: "Frontend" },
      { name: "React", level: 95, category: "Frontend" },
      { name: "Next.js", level: 85, category: "Frontend" },
      { name: "Node.js", level: 88, category: "Backend" },
      { name: "Python", level: 82, category: "Backend" },
      { name: "PostgreSQL", level: 80, category: "Database" },
      { name: "MongoDB", level: 75, category: "Database" },
      { name: "AWS", level: 78, category: "Cloud" },
      { name: "Docker", level: 85, category: "DevOps" },
      { name: "AI/ML", level: 70, category: "AI" },
      { name: "GraphQL", level: 80, category: "API" },
    ],
    experience: [
      {
        company: "TechCorp Solutions",
        position: "Senior Full Stack Developer",
        duration: "2022 - Present",
        description: "Leading development of enterprise-scale applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.",
        technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"]
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        duration: "2020 - 2022",
        description: "Built and maintained multiple client applications from concept to deployment. Worked closely with design and product teams to deliver exceptional user experiences.",
        technologies: ["Vue.js", "Express", "MongoDB", "Docker"]
      },
      {
        company: "Digital Agency Inc",
        position: "Frontend Developer",
        duration: "2018 - 2020",
        description: "Developed responsive web applications and e-commerce platforms. Collaborated with designers to implement pixel-perfect UIs.",
        technologies: ["React", "SASS", "WordPress", "PHP"]
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        duration: "2014 - 2018",
        description: "Graduated Magna Cum Laude. Specialized in software engineering and artificial intelligence."
      }
    ],
    projects: [
      {
        name: "DevBoard - Developer Dashboard",
        description: "A comprehensive developer dashboard with AI mentor, project tracking, and analytics. Built with Next.js and modern technologies.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
        github: "https://github.com/premprasad/devboard",
        demo: "https://devboard.premprasad.dev",
        featured: true
      },
      {
        name: "AI Code Assistant",
        description: "An intelligent code assistant powered by machine learning that helps developers write better code with real-time suggestions.",
        technologies: ["Python", "TensorFlow", "React", "FastAPI"],
        github: "https://github.com/premprasad/ai-code-assistant",
        demo: "https://ai-assistant.premprasad.dev",
        featured: true
      },
      {
        name: "E-Commerce Platform",
        description: "A scalable e-commerce platform with advanced features like real-time inventory, payment processing, and analytics dashboard.",
        technologies: ["React", "Node.js", "Stripe API", "Redis"],
        github: "https://github.com/premprasad/ecommerce",
        demo: "https://shop.premprasad.dev",
        featured: false
      }
    ],
    achievements: [
      {
        title: "AWS Certified Solutions Architect",
        description: "Achieved AWS Solutions Architect certification with distinction",
        date: "2023",
        type: "certification"
      },
      {
        title: "Best Innovation Award",
        description: "Won company-wide innovation award for AI-powered development tools",
        date: "2023",
        type: "award"
      },
      {
        title: "Open Source Contributor",
        description: "Active contributor to major open source projects with 50+ merged PRs",
        date: "2022-Present",
        type: "contribution"
      }
    ],
    stats: {
      totalProjects: 25,
      githubStars: 1250,
      yearsExperience: 6,
      technologiesUsed: 15
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const skillCategories = Array.from(new Set(profileData.skills.map(skill => skill.category)));

  const getSkillColor = (category: string) => {
    const colors = {
      'Frontend': 'from-blue-500 to-cyan-500',
      'Backend': 'from-green-500 to-emerald-500',
      'Database': 'from-purple-500 to-violet-500',
      'Cloud': 'from-orange-500 to-red-500',
      'DevOps': 'from-gray-500 to-slate-500',
      'AI': 'from-pink-500 to-rose-500',
      'API': 'from-indigo-500 to-blue-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  if (!isClient) {
    return <Layout><div className="flex justify-center items-center h-64">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                onClick={() => setIsPrivateMode(!isPrivateMode)}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isPrivateMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isPrivateMode ? 'Private' : 'Public'}
              </Button>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-1">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-foreground">{profileData.name}</h1>
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Pro
                  </div>
                </div>
                <p className="text-xl text-muted-foreground">{profileData.title}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>{profileData.website}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Projects', value: profileData.stats.totalProjects, icon: Code, color: 'from-blue-500 to-cyan-500' },
            { label: 'GitHub Stars', value: profileData.stats.githubStars, icon: Star, color: 'from-yellow-500 to-orange-500' },
            { label: 'Experience', value: `${profileData.stats.yearsExperience}+ Years`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: 'Technologies', value: `${profileData.stats.technologiesUsed}+`, icon: Zap, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-background to-accent/10 border-border/50 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <Card className="p-1 bg-muted/30">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* About Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    About Me
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Featured Projects
                  </h3>
                  <div className="space-y-4">
                    {profileData.projects.filter(project => project.featured).map((project, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{project.name}</h4>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Github className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Globe className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.website}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Github className="h-4 w-4 mr-3" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Linkedin className="h-4 w-4 mr-3" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Twitter className="h-4 w-4 mr-3" />
                      Twitter
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
                  <div className="space-y-3">
                    {profileData.skills.slice(0, 5).map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${getSkillColor(skill.category)} transition-all duration-500`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-border last:border-l-0">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="text-lg font-semibold text-foreground">{exp.position}</h4>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-muted-foreground">{exp.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {exp.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h3>
                <div className="space-y-4">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h4 className="text-lg font-semibold text-foreground">{edu.degree}</h4>
                        <span className="text-sm text-muted-foreground">{edu.duration}</span>
                      </div>
                      <p className="text-primary font-medium mb-2">{edu.institution}</p>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.projects.map((project, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      {project.featured && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Globe className="h-4 w-4 mr-2" />
                        Demo
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {skillCategories.map((category) => (
                <Card key={category} className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.skills
                      .filter(skill => skill.category === category)
                      .map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full bg-gradient-to-r ${getSkillColor(category)} transition-all duration-1000 ease-out`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.achievements.map((achievement, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${
                        achievement.type === 'certification' ? 'from-blue-500 to-cyan-500' :
                        achievement.type === 'award' ? 'from-yellow-500 to-orange-500' :
                        'from-green-500 to-emerald-500'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">{achievement.date}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{achievement.title}</h4>
                      <p className="text-muted-foreground text-sm">{achievement.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
