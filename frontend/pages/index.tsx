import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

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

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeConnection, setActiveConnection] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center p-8">
          {/* SVG for Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map((connection, index) => (
              <path
                key={connection.id}
                d={getConnectionPath(connection.position)}
                stroke="rgb(59, 130, 246)"
                strokeWidth="0.2"
                fill="none"
                className={`transition-all duration-1000 ${
                  activeConnection === connection.id ? 'opacity-100 drop-shadow-lg' : 'opacity-40'
                }`}
                style={{
                  strokeDasharray: '2,2',
                  animation: `dash 3s linear infinite`,
                  animationDelay: `${connection.delay}s`,
                  filter: activeConnection === connection.id ? 'drop-shadow(0 0 8px rgb(59, 130, 246))' : 'none'
                }}
              />
            ))}
          </svg>

          {/* Central DevBoard Logo */}
          <div className="relative z-10 text-center">
            <div className="mb-8 animate-float">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white px-12 py-8 rounded-2xl shadow-2xl border border-blue-500/20">
                  <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    DevBoard
                  </h1>
                  {isClient && <Zap className="h-8 w-8 absolute -top-2 -right-2 text-yellow-400 animate-bounce" />}
                </div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Your unified development dashboard connecting all your coding platforms, 
              projects, and productivity tools in one place
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="text-lg font-semibold">Get Started</span>
                {isClient && <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
              <button className="inline-flex items-center px-8 py-4 border border-input rounded-lg text-foreground hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="text-lg font-semibold">Learn More</span>
              </button>
            </div>
          </div>

          {/* Platform Connection Nodes */}
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
                  <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${connection.color} text-white shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 border border-white/20`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                    <div className="relative text-center">
                      {isClient && <IconComponent className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />}
                      <h3 className="text-lg font-bold mb-1">{connection.name}</h3>
                      <p className="text-sm opacity-90">{connection.description}</p>
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
        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why DevBoard?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Streamline your development workflow with integrated tools and insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Unified Analytics',
                description: 'Track your progress across all platforms with comprehensive analytics and insights.'
              },
              {
                icon: Zap,
                title: 'Real-time Sync',
                description: 'Stay updated with live data synchronization from GitHub, Stack Overflow, and more.'
              },
              {
                icon: Target,
                title: 'Goal Tracking',
                description: 'Set and monitor your development goals with intelligent progress tracking.'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.8s ease-out forwards`,
                    animationDelay: `${1.5 + index * 0.2}s`,
                    opacity: 0
                  }}
                >
                  <div className="text-center">
                    {isClient && <IconComponent className="h-12 w-12 mx-auto mb-4 text-primary" />}
                    <h3 className="text-xl font-bold text-card-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
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
            50% { transform: translateY(-10px); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
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
