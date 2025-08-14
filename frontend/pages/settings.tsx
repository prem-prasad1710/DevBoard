import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Github, 
  MessageSquare, 
  Key, 
  Download, 
  Trash2,
  Save,
  Check,
  X,
  ExternalLink,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Camera,
  Upload,
  AlertTriangle,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  BarChart3
} from 'lucide-react';
import { useUserProfile } from '@/hooks';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  
  const { user, loading, error, updateUserProfile } = useUserProfile();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    phone: '',
    dateOfBirth: '',
    githubUsername: '',
    stackOverflowUsername: '',
    linkedinUrl: '',
    twitterUrl: '',
    personalWebsite: '',
    skills: [] as string[],
    experience: '',
    education: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    notifications: {
      email: true,
      push: true,
      inApp: true,
      commits: true,
      projects: true,
      mentions: true,
      weeklyDigest: true
    },
    privacy: {
      profilePublic: true,
      activityPublic: true,
      statsPublic: true,
      emailVisible: false,
      phoneVisible: false,
      locationVisible: true
    },
    integrations: {
      github: {
        connected: false,
        syncFrequency: 'daily',
        privateRepos: false
      },
      stackoverflow: {
        connected: false,
        syncFrequency: 'daily'
      },
      linkedin: {
        connected: false,
        autoPost: false
      }
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: null as Date | null,
    activeSessions: [],
    loginAlerts: true
  });

  // Initialize data from user when available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        jobTitle: (user as any).jobTitle || '',
        company: (user as any).company || '',
        location: (user as any).location || '',
        phone: (user as any).phone || '',
        dateOfBirth: (user as any).dateOfBirth || '',
        githubUsername: user.githubUsername || '',
        stackOverflowUsername: user.stackOverflowUsername || '',
        linkedinUrl: user.linkedinUrl || '',
        twitterUrl: user.twitterUrl || '',
        personalWebsite: user.personalWebsite || '',
        skills: (user as any).skills || [],
        experience: (user as any).experience || '',
        education: (user as any).education || ''
      });

      if ((user as any).preferences) {
        setPreferences(prev => ({
          ...prev,
          theme: (user as any).preferences.theme || prev.theme,
          notifications: {
            ...prev.notifications,
            ...(user as any).preferences.notifications
          },
          privacy: {
            ...prev.privacy,
            ...(user as any).preferences.privacy
          },
          integrations: {
            ...prev.integrations,
            ...(user as any).preferences.integrations
          }
        }));
      }

      if ((user as any).profileImage) {
        setProfileImagePreview((user as any).profileImage);
      }
    }
  }, [user]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Github },
    { id: 'security', name: 'Security', icon: Key },
    { id: 'data', name: 'Data & Export', icon: Download },
  ];

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        ...profileData,
        preferences,
        profileImage: profileImage ? await convertImageToBase64(profileImage) : undefined
      };
      await updateUserProfile(updateData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      console.log('Account deletion requested');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                `${profileData.firstName?.[0] || 'U'}${profileData.lastName?.[0] || ''}`
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Upload a new profile picture. Recommended size: 400x400px
            </p>
            <Button variant="outline" size="sm" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your-username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date of Birth
            </label>
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Tell us about yourself, your interests, and what you're passionate about..."
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Job Title
            </label>
            <input
              type="text"
              value={profileData.jobTitle}
              onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Software Engineer, Product Manager, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company
            </label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Your current company"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="City, State, Country"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github className="h-4 w-4 inline mr-1" />
              GitHub Username
            </label>
            <input
              type="text"
              value={profileData.githubUsername}
              onChange={(e) => setProfileData(prev => ({ ...prev, githubUsername: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your-github-username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Stack Overflow Username
            </label>
            <input
              type="text"
              value={profileData.stackOverflowUsername}
              onChange={(e) => setProfileData(prev => ({ ...prev, stackOverflowUsername: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your-stackoverflow-username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profileData.linkedinUrl}
              onChange={(e) => setProfileData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={profileData.twitterUrl}
              onChange={(e) => setProfileData(prev => ({ ...prev, twitterUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="https://twitter.com/your-handle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              Personal Website
            </label>
            <input
              type="url"
              value={profileData.personalWebsite}
              onChange={(e) => setProfileData(prev => ({ ...prev, personalWebsite: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="https://your-website.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Email Notifications</h3>
        <div className="space-y-6">
          {[
            { key: 'email', title: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'commits', title: 'New Commits', description: 'Get notified when new commits are pushed' },
            { key: 'projects', title: 'Project Updates', description: 'Updates about your projects and milestones' },
            { key: 'mentions', title: 'Mentions & Comments', description: 'When someone mentions you or comments on your work' },
            { key: 'weeklyDigest', title: 'Weekly Digest', description: 'Summary of your weekly activity and achievements' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications[item.key as keyof typeof preferences.notifications]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: { 
                      ...prev.notifications, 
                      [item.key]: e.target.checked 
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Push Notifications</h3>
        <div className="space-y-6">
          {[
            { key: 'push', title: 'Browser Push Notifications', description: 'Receive push notifications in your browser' },
            { key: 'inApp', title: 'In-App Notifications', description: 'Show notifications within the app interface' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications[item.key as keyof typeof preferences.notifications]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: { 
                      ...prev.notifications, 
                      [item.key]: e.target.checked 
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Visibility</h3>
        <div className="space-y-6">
          {[
            { 
              key: 'profilePublic', 
              title: 'Public Profile', 
              description: 'Allow others to view your basic profile information',
              icon: preferences.privacy.profilePublic ? Eye : EyeOff
            },
            { 
              key: 'activityPublic', 
              title: 'Public Activity', 
              description: 'Show your coding activity and contributions publicly',
              icon: preferences.privacy.activityPublic ? Eye : EyeOff
            },
            { 
              key: 'statsPublic', 
              title: 'Public Statistics', 
              description: 'Display your development statistics and achievements',
              icon: preferences.privacy.statsPublic ? Eye : EyeOff
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy[item.key as keyof typeof preferences.privacy]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    privacy: { 
                      ...prev.privacy, 
                      [item.key]: e.target.checked 
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Contact Information</h3>
        <div className="space-y-6">
          {[
            { 
              key: 'emailVisible', 
              title: 'Show Email Address', 
              description: 'Display your email address on your public profile',
              icon: Mail
            },
            { 
              key: 'phoneVisible', 
              title: 'Show Phone Number', 
              description: 'Display your phone number on your public profile',
              icon: Phone
            },
            { 
              key: 'locationVisible', 
              title: 'Show Location', 
              description: 'Display your location on your public profile',
              icon: MapPin
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy[item.key as keyof typeof preferences.privacy]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    privacy: { 
                      ...prev.privacy, 
                      [item.key]: e.target.checked 
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Theme Preference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun, description: 'Light theme for bright environments' },
            { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for low-light environments' },
            { value: 'system', label: 'System', icon: Monitor, description: 'Follows your system preference' }
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => {
                setPreferences(prev => ({ ...prev, theme: theme.value as 'light' | 'dark' | 'system' }));
                // Apply theme immediately
                if (typeof window !== 'undefined') {
                  const html = document.documentElement;
                  if (theme.value === 'dark') {
                    html.classList.add('dark');
                  } else if (theme.value === 'light') {
                    html.classList.remove('dark');
                  } else {
                    // System preference
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      html.classList.add('dark');
                    } else {
                      html.classList.remove('dark');
                    }
                  }
                  localStorage.setItem('theme', theme.value);
                }
              }}
              className={`p-6 border-2 rounded-xl flex flex-col items-center space-y-3 transition-all duration-200 ${
                preferences.theme === theme.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              <theme.icon className={`h-8 w-8 ${
                preferences.theme === theme.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`} />
              <div className="text-center">
                <span className={`text-sm font-medium ${
                  preferences.theme === theme.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                }`}>{theme.label}</span>
                <p className={`text-xs mt-1 ${
                  preferences.theme === theme.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                }`}>{theme.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Development Platforms</h3>
        <div className="space-y-6">
          {[
            {
              key: 'github',
              name: 'GitHub',
              description: 'Connect your GitHub account to sync repositories and activity',
              icon: Github,
              color: 'text-gray-700 dark:text-gray-300',
              bgColor: 'bg-gray-50 dark:bg-gray-700'
            },
            {
              key: 'stackoverflow',
              name: 'Stack Overflow',
              description: 'Sync your Stack Overflow reputation and activity',
              icon: MessageSquare,
              color: 'text-orange-600 dark:text-orange-400',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            }
          ].map((integration) => (
            <div key={integration.key} className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${integration.bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${integration.bgColor}`}>
                    <integration.icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{integration.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {preferences.integrations[integration.key as keyof typeof preferences.integrations].connected ? (
                    <>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connected</span>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              {preferences.integrations[integration.key as keyof typeof preferences.integrations].connected && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sync Frequency</span>
                    <select 
                      value={(preferences.integrations[integration.key as keyof typeof preferences.integrations] as any).syncFrequency || 'daily'}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          [integration.key]: {
                            ...prev.integrations[integration.key as keyof typeof prev.integrations],
                            syncFrequency: e.target.value
                          }
                        }
                      }))}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Account Security</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Button variant={securitySettings.twoFactorEnabled ? "outline" : "default"}>
              {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Change Password</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
              </div>
            </div>
            <Button variant="outline">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Login Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of new login attempts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Export Data</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Export All Data',
              description: 'Download all your data including journal entries, projects, and activities.',
              buttonText: 'Export Everything',
              icon: Download
            },
            {
              title: 'Export Profile Data',
              description: 'Download your profile information and settings.',
              buttonText: 'Export Profile',
              icon: User
            }
          ].map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {item.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-white/50 dark:bg-red-900/10">
            <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'integrations':
        return renderIntegrationsTab();
      case 'security':
        return renderSecurityTab();
      case 'data':
        return renderDataTab();
      default:
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Coming soon...</div>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
              </div>
              {showSuccess && (
                <div className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg backdrop-blur-sm">
                  <Check className="h-4 w-4 mr-2" />
                  Settings saved successfully
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-200/50 dark:border-gray-700/50">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
