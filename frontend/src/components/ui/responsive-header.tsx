import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from '@/components/ui/mobile-nav';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

// Dynamically import icons
const Sun = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false });
const Monitor = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Monitor })), { ssr: false });
const Bell = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Bell })), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false });
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

interface ResponsiveHeaderProps {
  showOnMobile?: boolean;
  className?: string;
}

export function ResponsiveHeader({ showOnMobile = true, className }: ResponsiveHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return <Monitor className="h-4 w-4" />;
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (!showOnMobile && typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-white/10 dark:border-gray-800/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150 shadow-sm",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DevBoard
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                Beta
              </Badge>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-1">
            {navigation.slice(0, 6).map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search - hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-9 w-9 p-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 relative"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                <span className="sr-only">3 unread notifications</span>
              </span>
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              {getThemeIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User menu - desktop only */}
            {user && (
              <div className="hidden lg:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden xl:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.username}
                </span>
              </div>
            )}

            {/* Mobile navigation */}
            <MobileNav
              navigation={navigation}
              isOpen={mobileNavOpen}
              onToggle={() => setMobileNavOpen(!mobileNavOpen)}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
