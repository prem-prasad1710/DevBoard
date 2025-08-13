import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

// Dynamically import icons to prevent hydration issues
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })), { ssr: false });
const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), { ssr: false });
const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), { ssr: false });
const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });
const Shield = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Shield })), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: false });
const Users = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), { ssr: false });
const Rocket = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Rocket })), { ssr: false });
const Database = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Database })), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Activity })), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: false });
const CheckCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false });
const Lightbulb = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lightbulb })), { ssr: false });
const Layers = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Layers })), { ssr: false });

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeConnection, setActiveConnection] = useState<number | null>(null);
  const [currentStats, setCurrentStats] = useState({
    repositories: 0,
    commits: 0,
    problems: 0,
    projects: 0
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Animate stats counter on load
    const animateStats = () => {
      const targets = { repositories: 45, commits: 1250, problems: 89, projects: 12 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCurrentStats({
          repositories: Math.floor(targets.repositories * easeOut),
          commits: Math.floor(targets.commits * easeOut),
          problems: Math.floor(targets.problems * easeOut),
          projects: Math.floor(targets.projects * easeOut)
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setCurrentStats(targets);
        }
      }, stepDuration);
    };
    
    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleGetStarted = () => {
    // Open sidebar if available
    if (typeof window !== 'undefined' && (window as any).openSidebar) {
      (window as any).openSidebar();
    }
  };

  // Array of platforms/features that connect to DevBoard
  const connections = [
    {
      id: 1,
      name: 'GitHub',
      description: 'Repository Management',
      icon: Github,
      href: '/github',
      color: 'from-gray-600 to-gray-800',
      position: 'top-left',
      delay: 0
    },
    {
      id: 2,
      name: 'Stack Overflow',
      description: 'Q&A Integration',
      icon: MessageSquare,
      href: '/stackoverflow',
      color: 'from-orange-500 to-orange-700',
      position: 'top-right',
      delay: 0.2
    },
    {
      id: 3,
      name: 'Journal',
      description: 'Development Log',
      icon: BookOpen,
      href: '/journal',
      color: 'from-blue-500 to-blue-700',
      position: 'left',
      delay: 0.4
    },
    {
      id: 4,
      name: 'Projects',
      description: 'Portfolio & Work',
      icon: Target,
      href: '/projects',
      color: 'from-green-500 to-green-700',
      position: 'right',
      delay: 0.6
    },
    {
      id: 5,
      name: 'AI Mentor',
      description: 'Coding Assistant',
      icon: Brain,
      href: '/ai-mentor',
      color: 'from-purple-500 to-purple-700',
      position: 'bottom-left',
      delay: 0.8
    },
    {
      id: 6,
      name: 'Resume',
      description: 'Professional Profile',
      icon: FileText,
      href: '/resume',
      color: 'from-indigo-500 to-indigo-700',
      position: 'bottom-right',
      delay: 1.0
    }
  ];

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'absolute top-6 left-6 md:top-12 md:left-12';
      case 'top-right':
        return 'absolute top-6 right-6 md:top-12 md:right-12';
      case 'left':
        return 'absolute top-1/2 left-6 md:left-12 transform -translate-y-1/2';
      case 'right':
        return 'absolute top-1/2 right-6 md:right-12 transform -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-6 left-6 md:bottom-12 md:left-12';
      case 'bottom-right':
        return 'absolute bottom-6 right-6 md:bottom-12 md:right-12';
      default:
        return '';
    }
  };

  const getConnectionPath = (position: string) => {
    const centerX = 50;
    const centerY = 50;
    
    switch (position) {
      case 'top-left':
        return `M15,25 Q${centerX},${centerY-15} ${centerX},${centerY}`;
      case 'top-right':
        return `M85,25 Q${centerX},${centerY-15} ${centerX},${centerY}`;
      case 'left':
        return `M15,50 Q${centerX-15},${centerY-10} ${centerX},${centerY}`; // Adjusted for higher position
      case 'right':
        return `M85,50 Q${centerX+15},${centerY-10} ${centerX},${centerY}`; // Adjusted for higher position
      case 'bottom-left':
        return `M15,75 Q${centerX},${centerY+15} ${centerX},${centerY}`;
      case 'bottom-right':
        return `M85,75 Q${centerX},${centerY+15} ${centerX},${centerY}`;
      default:
        return '';
    }
  };

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <Layout onOpenSidebar={handleGetStarted}>
      <div className="bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Floating Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const html = document.documentElement;
                if (html.classList.contains('dark')) {
                  html.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                } else {
                  html.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                }
              }
            }}
            className="shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 border border-white/30 dark:border-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-300"
          >
            {isClient && (
              typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 
                <Sun className="h-4 w-4" /> : 
                <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Hero Section - Enhanced */}
        <div className="relative h-[90vh] max-h-[800px] flex items-center justify-center px-4 md:px-8 pt-12 md:pt-16 lg:pt-20">

          {/* SVG for Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map((connection, index) => (
              <path
                key={connection.id}
                d={getConnectionPath(connection.position)}
                stroke="url(#gradient)"
                strokeWidth="0.3"
                fill="none"
                className={`transition-all duration-1000 ${
                  activeConnection === connection.id ? 'opacity-100 drop-shadow-lg' : 'opacity-50'
                }`}
                style={{
                  strokeDasharray: '3,3',
                  animation: `dash 4s linear infinite`,
                  animationDelay: `${connection.delay}s`,
                  filter: activeConnection === connection.id ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))' : 'none'
                }}
              />
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central DevBoard Logo - Enhanced with Darker Glassmorphism */}
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-float">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-2xl blur-xl opacity-30 animate-pulse scale-105"></div>
                <div className="relative bg-black/40 dark:bg-black/60 backdrop-blur-xl backdrop-saturate-150 border border-gray-700/40 dark:border-gray-600/40 px-8 md:px-12 py-6 md:py-8 rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-indigo-900/30 rounded-2xl"></div>
                  <div className="relative">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-3">
                      DevBoard
                    </h1>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {isClient && <Code className="h-5 w-5 md:h-6 md:w-6 text-cyan-400 dark:text-cyan-300 animate-pulse" />}
                      <span className="text-base md:text-lg text-gray-200 dark:text-gray-100 font-semibold">Your Development Universe</span>
                      {isClient && <Rocket className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 dark:text-yellow-300 animate" />}
                    </div>
                    {isClient && <Zap className="h-6 w-6 md:h-7 md:w-7 absolute -top-2 -right-2 text-yellow-400 dark:text-yellow-300 animate-bounce" />}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-10 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 leading-relaxed font-light">
                The <span className="font-bold text-blue-600 dark:text-blue-400">ultimate development dashboard</span> that unifies 
                your entire coding ecosystem into one powerful, intelligent platform
              </p>
              
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
                  <div className="bg-black/20 dark:bg-black/40 rounded-lg p-3 border border-gray-600/30 dark:border-gray-500/30 shadow-sm backdrop-blur-lg">
                    <div className="text-xl md:text-2xl font-bold text-blue-400 dark:text-blue-300">
                      {currentStats.repositories}+
                    </div>
                    <div className="text-xs text-gray-300 dark:text-gray-200">Repositories</div>
                  </div>
                  <div className="bg-black/20 dark:bg-black/40 rounded-lg p-3 border border-gray-600/30 dark:border-gray-500/30 shadow-sm backdrop-blur-lg">
                    <div className="text-xl md:text-2xl font-bold text-green-400 dark:text-green-300">
                      {currentStats.commits.toLocaleString()}+
                    </div>
                    <div className="text-xs text-gray-300 dark:text-gray-200">Commits</div>
                  </div>
                  <div className="bg-black/20 dark:bg-black/40 rounded-lg p-3 border border-gray-600/30 dark:border-gray-500/30 shadow-sm backdrop-blur-lg">
                    <div className="text-xl md:text-2xl font-bold text-orange-400 dark:text-orange-300">
                      {currentStats.problems}+
                    </div>
                    <div className="text-xs text-gray-300 dark:text-gray-200">Problems Solved</div>
                  </div>
                  <div className="bg-black/20 dark:bg-black/40 rounded-lg p-3 border border-gray-600/30 dark:border-gray-500/30 shadow-sm backdrop-blur-lg">
                    <div className="text-xl md:text-2xl font-bold text-purple-400 dark:text-purple-300">
                      {currentStats.projects}+
                    </div>
                    <div className="text-xs text-gray-300 dark:text-gray-200">Active Projects</div>
                  </div>
                </div>

              <p className="text-base md:text-lg text-muted-foreground/90 mb-8 max-w-xl mx-auto">
                Track Progress • Boost Productivity • Accelerate Growth • Build Better
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button 
                onClick={handleGetStarted}
                className="group inline-flex items-center px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-base font-bold"
              >
                <span>Launch DevBoard</span>
                {isClient && <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />}
              </button>
              <button 
                onClick={() => {
                  document.getElementById('about-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="inline-flex items-center px-8 py-3 md:px-10 md:py-4 border-2 border-white/40 dark:border-gray-600/40 rounded-xl text-foreground hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base font-bold backdrop-blur-xl backdrop-saturate-150 bg-white/20 dark:bg-gray-800/20"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Quick Access Grid - Enhanced */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
              {connections.slice(0, 6).map((connection, index) => {
                const IconComponent = connection.icon;
                return (
                  <div
                    key={connection.id}
                    onClick={() => router.push(connection.href)}
                    className="group p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg backdrop-saturate-150 rounded-lg border border-white/30 dark:border-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.8s ease-out forwards`,
                      animationDelay: `${2.5 + index * 0.1}s`,
                      opacity: 0
                    }}
                  >
                    <div className="text-center">
                      {isClient && <IconComponent className="h-5 w-5 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />}
                      <span className="text-xs font-semibold text-foreground block">{connection.name}</span>
                    </div>
                  </div>
                );  
              })}
            </div>
          </div>

          {/* Platform Connection Nodes - Enhanced Clickability with Pulse Animation */}
          {connections.map((connection, index) => {
            const IconComponent = connection.icon;
            return (
              <div
                key={connection.id}
                className={`${getPositionClasses(connection.position)} z-20 transform transition-all duration-500 hover:scale-110 cursor-pointer`}
                style={{
                  animation: `fadeInUp 0.8s ease-out forwards, pulse 3s infinite`,
                  animationDelay: `${connection.delay}s`,
                  opacity: 0
                }}
                onMouseEnter={() => setActiveConnection(connection.id)}
                onMouseLeave={() => setActiveConnection(null)}
                onClick={() => router.push(connection.href)}
              >
                <div className="block group">
                  <div className={`relative p-3 md:p-4 rounded-xl bg-gradient-to-br ${connection.color} text-white shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/20 backdrop-blur-sm hover:border-white/40`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                    <div className="relative text-center">
                      {isClient && <IconComponent className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform " />}
                      <h3 className="text-xs md:text-sm font-bold mb-1">{connection.name}</h3>
                      <p className="text-xs opacity-90 hidden md:block">{connection.description}</p>
                    </div>
                    
                    {/* Enhanced pulsing ring effects */}
                    <div className="absolute inset-0 rounded-xl border border-white/20 opacity-60"></div>
                    <div className="absolute inset-0 rounded-xl border-2 border-white/10 opacity-40" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* About DevBoard Section */}
        <div id="about-section" className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-lg px-4 py-2">
                  <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    About DevBoard
                  </span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Revolutionizing
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Developer Experience
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                DevBoard is more than a dashboard—it's your personal development companion that transforms 
                how you track, manage, and accelerate your coding journey.
              </p>
            </div>

            {/* Mission & Vision - Enhanced with Glassmorphism */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/40 dark:hover:bg-gray-900/40">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                <div className="relative">
                  <div className="mb-4">
                    {isClient && <Target className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-3" />}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Our Mission</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    To empower developers worldwide by creating the most intuitive, comprehensive, and intelligent 
                    development tracking platform that turns data into actionable insights and scattered tools into 
                    a unified workflow.
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                    {isClient && <Lightbulb className="h-4 w-4 mr-2" />}
                    Innovation-driven development
                  </div>
                </div>
              </div>

              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/40 dark:hover:bg-gray-900/40">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                <div className="relative">
                  <div className="mb-4">
                    {isClient && <Rocket className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-3" />}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Our Vision</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    A world where every developer has complete visibility into their growth, where productivity 
                    flows naturally, and where achieving coding goals becomes as simple as opening a dashboard.
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                    {isClient && <TrendingUp className="h-4 w-4 mr-2" />}
                    Future-focused solutions
                  </div>
                </div>
              </div>
            </div>

            {/* Key Problems We Solve */}
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Solving Real Developer Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Activity,
                    title: "Scattered Data",
                    problem: "Your coding activity is spread across GitHub, Stack Overflow, multiple IDEs, and platforms",
                    solution: "Unified view of all your development activities in one intelligent dashboard"
                  },
                  {
                    icon: Clock,
                    title: "Progress Tracking",
                    problem: "Difficulty measuring growth, productivity, and achieving development goals",
                    solution: "Smart analytics that track your progress and suggest areas for improvement"
                  },
                  {
                    icon: Layers,
                    title: "Tool Fragmentation",
                    problem: "Switching between multiple tools disrupts flow and wastes valuable time",
                    solution: "Seamless integration of all essential development tools in one place"
                  }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl backdrop-saturate-150 rounded-xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-900/30"
                      style={{
                        animation: `fadeInUp 0.8s ease-out forwards`,
                        animationDelay: `${index * 0.2}s`,
                        opacity: 0
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl"></div>
                      <div className="relative">
                        {isClient && (
                          <div className="mb-4 p-3 bg-red-100/80 dark:bg-red-900/30 backdrop-blur-sm rounded-lg inline-block border border-red-200/30 dark:border-red-800/30">
                            <IconComponent className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-foreground mb-3">{item.title}</h4>
                        <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                          <span className="text-red-600 dark:text-red-400 font-semibold">Problem:</span> {item.problem}
                        </p>
                        <p className="text-green-600 dark:text-green-400 text-sm leading-relaxed">
                          <span className="font-semibold">Solution:</span> {item.solution}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Features Section */}
        <div id="features-section" className="relative z-10 py-16 md:py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Powerful Features for
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Modern Developers
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everything you need to supercharge your development workflow, all in one beautiful, intelligent platform
              </p>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Github,
                  title: 'GitHub Integration',
                  description: 'Complete repository management with real-time commit tracking, branch monitoring, and contribution analytics',
                  features: ['Live repository sync', 'Commit statistics', 'Branch management', 'Contribution graphs']
                },
                {
                  icon: MessageSquare,
                  title: 'Stack Overflow Hub',
                  description: 'Track your Q&A activity, reputation growth, and knowledge sharing across the developer community',
                  features: ['Question tracking', 'Answer analytics', 'Reputation monitoring', 'Tag expertise']
                },
                {
                  icon: Brain,
                  title: 'AI-Powered Mentor',
                  description: 'Intelligent coding assistant providing personalized guidance, code reviews, and learning recommendations',
                  features: ['Code assistance', 'Smart suggestions', 'Learning paths', 'Skill assessment']
                },
                {
                  icon: Target,
                  title: 'Project Management',
                  description: 'Comprehensive project tracking with milestone management, progress visualization, and team collaboration',
                  features: ['Project templates', 'Milestone tracking', 'Progress charts', 'Team features']
                },
                {
                  icon: BookOpen,
                  title: 'Developer Journal',
                  description: 'Document your coding journey with rich text entries, code snippets, and learning reflections',
                  features: ['Rich text editor', 'Code highlighting', 'Tag organization', 'Search capabilities']
                },
                {
                  icon: FileText,
                  title: 'Dynamic Resume Builder',
                  description: 'Auto-generating professional resumes from your development activity and project portfolio',
                  features: ['Auto-generation', 'Multiple templates', 'PDF export', 'Skills highlighting']
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Deep insights into your coding patterns, productivity trends, and skill development over time',
                  features: ['Productivity metrics', 'Skill tracking', 'Time analysis', 'Growth trends']
                },
                {
                  icon: Zap,
                  title: 'Real-time Sync',
                  description: 'Lightning-fast data synchronization across all platforms ensuring you always have the latest information',
                  features: ['Instant updates', 'Live notifications', 'Offline support', 'Multi-device sync']
                },
                {
                  icon: Shield,
                  title: 'Privacy & Security',
                  description: 'Enterprise-grade security with granular privacy controls and data encryption',
                  features: ['Data encryption', 'Privacy controls', 'Secure storage', 'Access management']
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:bg-white/30 dark:hover:bg-gray-900/30"
                    style={{
                      animation: `fadeInUp 0.8s ease-out forwards`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                    <div className="relative">
                      <div className="mb-6">
                        {isClient && (
                          <div className="p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            {isClient && <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why Choose DevBoard */}
            <div className="text-center mb-20">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                Why Developers Choose DevBoard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Star,
                    title: "5-Star Experience",
                    description: "Intuitive design that developers love"
                  },
                  {
                    icon: Globe,
                    title: "Global Community",
                    description: "Join thousands of developers worldwide"
                  },
                  {
                    icon: Database,
                    title: "Secure & Reliable",
                    description: "Enterprise-grade infrastructure"
                  },
                  {
                    icon: Users,
                    title: "Team Collaboration",
                    description: "Built for individual and team success"
                  }
                ].map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/40 dark:hover:bg-gray-900/40 transform hover:-translate-y-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                      <div className="relative">
                        {isClient && (
                          <div className="mb-4 p-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl inline-block shadow-md">
                            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h4>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-1 rounded-3xl inline-block mb-8">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl px-12 py-8">
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Ready to Transform Your Development Journey?
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join the revolution of data-driven development. Start tracking, growing, and achieving more than ever before.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <button 
                      onClick={handleGetStarted}
                      className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-bold"
                    >
                      <span>Start Free Today</span>
                      {isClient && <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />}
                    </button>
                    <button className="inline-flex items-center px-10 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-lg font-semibold">
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Custom CSS for animations */}
        <style jsx>{`
          @keyframes dash {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 30; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(1deg); }
            50% { transform: translateY(-25px) rotate(0deg); }
            75% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(60px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0,-20px,0); }
            70% { transform: translate3d(0,-10px,0); }
            90% { transform: translate3d(0,-4px,0); }
          }
          
          @keyframes slideInFromLeft {
            0% { transform: translateX(-100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInFromRight {
            0% { transform: translateX(100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4); }
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce 3s infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse 4s infinite;
          }
          
          .animate-glow {
            animation: glow 3s ease-in-out infinite;
          }
          
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
          
          .shadow-4xl {
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25);
          }
          
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .dark .glass-effect {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .text-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .bg-mesh {
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
          }
          
          .dark .bg-mesh {
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 50%);
          }
          
          /* Particle animations */
          .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
          }
          
          .particle:nth-child(odd) {
            animation: float 6s ease-in-out infinite;
          }
          
          .particle:nth-child(even) {
            animation: float 8s ease-in-out infinite reverse;
          }
          
          /* Hover effects */
          .hover-lift:hover {
            transform: translateY(-8px) scale(1.02);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-glow:hover {
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Dashboard;
