import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
const Bell = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Bell })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
const Plus = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Plus })), { ssr: false });

import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSidebar?: () => void;
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

export default function Layout({ children, onOpenSidebar }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Pass the setSidebarOpen function to the parent component
  useEffect(() => {
    if (onOpenSidebar) {
      (window as any).openSidebar = () => setSidebarOpen(true);
    }
  }, [onOpenSidebar]);

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

  // Hide navbar on homepage
  const isHomePage = router.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar backdrop for homepage */}
      {isHomePage && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar with Glassmorphism */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-hidden="true">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 pb-4 pt-5 shadow-2xl border-r border-white/20 dark:border-gray-800/20">
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DevBoard</h1>
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">Beta</Badge>
            </div>
            
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 shadow-md backdrop-blur-sm'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-800/30 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 hover:shadow-sm'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar with Glassmorphism */}
      {(!isHomePage || sidebarOpen) && (
        <div className={`${isHomePage ? 'fixed' : 'hidden lg:fixed'} lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
          navbarCollapsed ? 'lg:w-16' : 'lg:w-72'
        } ${isHomePage ? 'inset-y-0 z-50 flex flex-col w-72' : ''}`}>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 dark:border-gray-800/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 px-6 pb-4 shadow-2xl shadow-black/10">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className={`flex items-center ${navbarCollapsed && !isHomePage ? 'justify-center' : ''}`}>
                {(!navbarCollapsed || isHomePage) && (
                  <>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DevBoard</h1>
                    <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">Beta</Badge>
                  </>
                )}
                {navbarCollapsed && !isHomePage && (
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">D</div>
                )}
              </div>
              {!isHomePage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNavbarCollapsed(!navbarCollapsed)}
                  className="h-8 w-8 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              {isHomePage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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
                              navbarCollapsed && !isHomePage ? 'justify-center' : ''
                            )}
                            title={navbarCollapsed && !isHomePage ? item.name : undefined}
                            onClick={isHomePage ? () => setSidebarOpen(false) : undefined}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 shrink-0 transition-all duration-300",
                              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                            )} />
                            {(!navbarCollapsed || isHomePage) && (
                              <span className="truncate">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                
                <li className="mt-auto">
                  <div className={`flex items-center gap-x-4 px-3 py-3 text-sm font-medium leading-6 text-gray-900 dark:text-white bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl shadow-sm ${
                    navbarCollapsed && !isHomePage ? 'justify-center' : ''
                  }`}>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    {(!navbarCollapsed || isHomePage) && (
                      <>
                        <span className="sr-only">Your profile</span>
                        <span aria-hidden="true" className="truncate">{user?.name || 'Developer'}</span>
                      </>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`${!isHomePage ? (navbarCollapsed ? 'lg:pl-16' : 'lg:pl-72') : ''}`}>
        {/* Top bar with Glassmorphism - only show on non-homepage */}
        {!isHomePage && (
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 px-4 shadow-lg shadow-black/5 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-lg transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200/50 dark:bg-gray-800/50 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
                  <div className="relative flex items-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl px-4 py-2 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <input
                      className="block w-full border-0 bg-transparent py-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm outline-none"
                      placeholder="Search projects, code, or anything..."
                      type="search"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-x-2 lg:gap-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-9 w-9 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 shadow-sm"
                >
                  {getThemeIcon()}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 shadow-sm relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200/30 dark:lg:bg-gray-800/30" aria-hidden="true" />

                {/* Profile dropdown with glassmorphism */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center p-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 shadow-sm"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={logout}
                    title="Sign out"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white" aria-hidden="true">
                        {user?.name || 'Developer'}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className={isHomePage ? '' : 'py-6'}>
          <div className={isHomePage ? '' : 'px-4 sm:px-6 lg:px-8'}>
            {children}
          </div>
        </main>
      </div>

      {/* Floating navigation toggle for homepage with Glassmorphism */}
      {isHomePage && !sidebarOpen && (
        <div className="fixed top-6 left-6 z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 hover:bg-white/90 dark:hover:bg-gray-900/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Menu className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
