import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveHeader } from '@/components/ui/responsive-header';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically import all icons to prevent hydration issues
const LayoutDashboard = dynamic(() => import('lucide-react').then(mod => ({ default: mod.LayoutDashboard })), { ssr: false });
const GitBranch = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitBranch })), { ssr: false });
const MessageCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageCircle })), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false });
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });
const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), { ssr: false });
const Settings = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Settings })), { ssr: false });
const Menu = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Menu })), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false });
const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false });
const Monitor = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Monitor })), { ssr: false });

import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
  showMobileHeader?: boolean;
  contentPadding?: "none" | "sm" | "md" | "lg";
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'GitHub', href: '/github', icon: GitBranch },
  { name: 'Stack Overflow', href: '/stackoverflow', icon: MessageCircle },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Projects', href: '/projects', icon: Target },
  { name: 'Resume', href: '/resume', icon: FileText },
  { name: 'Code Challenges', href: '/code-challenges', icon: Code },
  { name: 'AI Mentor', href: '/ai-mentor', icon: Brain },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout({ 
  children, 
  showMobileHeader = true,
  contentPadding = "md"
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Check if it's the homepage
  const isHomePage = router.pathname === '/';
  
  // Get content padding classes
  const getContentPadding = () => {
    switch (contentPadding) {
      case "none":
        return "p-0";
      case "sm":
        return "p-2 sm:p-4";
      case "md":
        return "p-4 sm:p-6 lg:p-8";
      case "lg":
        return "p-6 sm:p-8 lg:p-12";
      default:
        return "p-4 sm:p-6 lg:p-8";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first responsive header */}
      {showMobileHeader && !isHomePage && (
        <ResponsiveHeader showOnMobile={true} />
      )}

      {/* Desktop sidebar - only show when not on homepage */}
      {!isHomePage && (
        <div className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          navbarCollapsed ? "lg:w-16" : "lg:w-72"
        )}>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 dark:border-gray-800/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 px-6 pb-4 shadow-2xl shadow-black/10">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className={cn(
                "flex items-center",
                navbarCollapsed ? "justify-center" : ""
              )}>
                {!navbarCollapsed && (
                  <>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      DevBoard
                    </h1>
                    <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                      Beta
                    </Badge>
                  </>
                )}
                {navbarCollapsed && (
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    D
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNavbarCollapsed(!navbarCollapsed)}
                className="h-8 w-8 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = router.pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-300',
                              isActive
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 shadow-md backdrop-blur-sm'
                                : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-800/30 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 hover:shadow-sm',
                              navbarCollapsed ? 'justify-center' : ''
                            )}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 flex-shrink-0 transition-all duration-300",
                              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                            )} />
                            {!navbarCollapsed && (
                              <span className="truncate">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn(
        "flex flex-1 flex-col",
        !isHomePage && showMobileHeader && "lg:pl-72",
        navbarCollapsed && !isHomePage && "lg:pl-16"
      )}>
        <main className={cn(
          "flex-1 min-h-screen",
          getContentPadding()
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
                            title={navbarCollapsed && !isHomePage ? item.name : undefined}
                            onClick={isHomePage ? () => setSidebarOpen(false) : undefined}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 flex-shrink-0 transition-all duration-300",
                              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                            )} />
                            {!navbarCollapsed && (
                              <span className="truncate">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn(
        "flex flex-1 flex-col",
        !isHomePage && showMobileHeader && "lg:pl-72",
        navbarCollapsed && !isHomePage && "lg:pl-16"
      )}>
        <main className={cn(
          "flex-1 min-h-screen",
          getContentPadding()
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
