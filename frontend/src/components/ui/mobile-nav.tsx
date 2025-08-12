import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically import icons
const Menu = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Menu })), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false });
const ChevronDown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })), { ssr: false });
const LogOut = dynamic(() => import('lucide-react').then(mod => ({ default: mod.LogOut })), { ssr: false });
const Settings = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Settings })), { ssr: false });
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });

interface MobileNavProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileNav({ navigation, isOpen, onToggle, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNavClick = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile nav button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-10 w-10 p-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
          />
          
          {/* Slide-out panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/20 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/20">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    DevBoard
                  </h2>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                    Beta
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User info */}
              {user && (
                <div className="p-4 border-b border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )} />
                    </Button>
                  </div>
                  
                  {/* User submenu */}
                  {userMenuOpen && (
                    <div className="mt-3 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 text-left"
                        onClick={() => handleNavClick('/profile')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 text-left"
                        onClick={() => handleNavClick('/settings')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-3 text-left transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3 flex-shrink-0",
                        isActive 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                      {item.name}
                    </Button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-white/20 dark:border-gray-700/20">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  © 2025 DevBoard. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
