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

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeConnection, setActiveConnection] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
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
        return 'absolute top-8 left-8 md:top-16 md:left-16';
      case 'top-right':
        return 'absolute top-8 right-8 md:top-16 md:right-16';
      case 'left':
        return 'absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2';
      case 'right':
        return 'absolute top-1/2 right-8 md:right-16 transform -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-8 left-8 md:bottom-16 md:left-16';
      case 'bottom-right':
        return 'absolute bottom-8 right-8 md:bottom-16 md:right-16';
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
        return `M15,50 Q${centerX-15},${centerY} ${centerX},${centerY}`;
      case 'right':
        return `M85,50 Q${centerX+15},${centerY} ${centerX},${centerY}`;
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
            className="shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            {isClient && (
              typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 
                <Sun className="h-4 w-4" /> : 
                <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Hero Section - Compact Size */}
        <div className="relative h-[100vh] max-h-[900px] flex items-center justify-center px-7 md:px-8 pt-16 md:pt-20 lg:pt-24">
          {/* SVG for Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map((connection, index) => (
              <path
                key={connection.id}
                d={getConnectionPath(connection.position)}
                stroke="rgba(0, 60, 255, 1)"
                strokeWidth="0.2"
                fill="none"
                className={`transition-all duration-1000 ${
                  activeConnection === connection.id ? 'opacity-100 drop-shadow-lg' : 'opacity-40'
                }`}
                style={{
                  strokeDasharray: '2,2',
                  animation: `dash 3s linear infinite`,
                  animationDelay: `${connection.delay}s`,
                  filter: activeConnection === connection.id ? 'drop-shadow(0 0 8px rgba(0, 60, 255, 1))' : 'none'
                }}
              />
            ))}
          </svg>

          {/* Central DevBoard Logo */}
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-float">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-8 md:px-12 py-6 md:py-8 rounded-2xl shadow-2xl border border-blue-500/20">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                    DevBoard
                  </h1>
                  {isClient && <Zap className="h-6 w-6 md:h-8 md:w-8 absolute -top-2 -right-2 text-yellow-400 animate-bounce" />}
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed font-light">
                Your unified development dashboard connecting all your coding platforms, 
                projects, and productivity tools in one place
              </p>
              
              <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8">
                Streamline your workflow • Track your progress • Boost your productivity
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button 
                onClick={handleGetStarted}
                className="group inline-flex items-center px-8 py-3 md:px-10 md:py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg font-semibold"
              >
                <span>Get Started</span>
                {isClient && <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />}
              </button>
              <button 
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="inline-flex items-center px-8 py-3 md:px-10 md:py-4 border-2 border-input rounded-xl text-foreground hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg font-semibold backdrop-blur-sm bg-background/50"
              >
                <span>Learn More</span>
              </button>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
              {connections.slice(0, 6).map((connection, index) => {
                const IconComponent = connection.icon;
                return (
                  <a
                    key={connection.id}
                    href={connection.href}
                    className="group p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-border/50 hover:bg-background/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      animation: `fadeInUp 0.8s ease-out forwards`,
                      animationDelay: `${2 + index * 0.1}s`,
                      opacity: 0
                    }}
                  >
                    <div className="text-center">
                      {isClient && <IconComponent className="h-5 w-5 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />}
                      <span className="text-xs font-medium text-foreground">{connection.name}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Connection Nodes - Smaller */}
          {connections.map((connection, index) => {
            const IconComponent = connection.icon;
            return (
              <div
                key={connection.id}
                className={`${getPositionClasses(connection.position)} z-20 transform transition-all duration-500 hover:scale-110`}
                style={{
                  animation: `fadeInUp 0.8s ease-out forwards`,
                  animationDelay: `${connection.delay}s`,
                  opacity: 0
                }}
                onMouseEnter={() => setActiveConnection(connection.id)}
                onMouseLeave={() => setActiveConnection(null)}
              >
                <a
                  href={connection.href}
                  className="block group"
                >
                  <div className={`relative p-4 md:p-6 rounded-2xl bg-gradient-to-br ${connection.color} text-white shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 border border-white/20 backdrop-blur-sm`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                    <div className="relative text-center">
                      {isClient && <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 group-hover:scale-125 transition-transform" />}
                      <h3 className="text-sm md:text-base font-bold mb-1">{connection.name}</h3>
                      <p className="text-xs opacity-90 hidden md:block">{connection.description}</p>
                    </div>
                    
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-75"></div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div id="features-section" className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">Why DevBoard?</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Streamline your development workflow with integrated tools and insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: BarChart3,
                  title: 'Unified Analytics',
                  description: 'Track your progress across all platforms with comprehensive analytics and insights that help you understand your development patterns.'
                },
                {
                  icon: Zap,
                  title: 'Real-time Sync',
                  description: 'Stay updated with live data synchronization from GitHub, Stack Overflow, and more. Never miss an important update or contribution.'
                },
                {
                  icon: Target,
                  title: 'Goal Tracking',
                  description: 'Set and monitor your development goals with intelligent progress tracking that adapts to your workflow and celebrates your achievements.'
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-card/80"
                    style={{
                      animation: `fadeInUp 0.8s ease-out forwards`,
                      animationDelay: `${1.5 + index * 0.3}s`,
                      opacity: 0
                    }}
                  >
                    <div className="text-center">
                      {isClient && (
                        <div className="mb-4 md:mb-6 p-3 bg-primary/10 rounded-xl inline-block">
                          <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                        </div>
                      )}
                      <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 md:mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 md:mt-16">
              <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <button className="px-8 md:px-12 py-3 md:py-4 bg-background rounded-lg text-foreground hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-xl text-lg font-semibold">
                  Start Your Journey Today
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes dash {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Dashboard;
