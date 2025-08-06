import React from 'react';
import Layout from '@/components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">DevBoard Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold text-card-foreground">Welcome!</h2>
            <p className="text-muted-foreground mt-2">Your DevBoard is ready</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold text-card-foreground">Projects</h2>
            <p className="text-muted-foreground mt-2">Manage your projects</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold text-card-foreground">Journal</h2>
            <p className="text-muted-foreground mt-2">Track your progress</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold text-card-foreground">AI Mentor</h2>
            <p className="text-muted-foreground mt-2">Get coding help</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/journal" className="block p-4 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Journal</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">Write & reflect</p>
            </a>
            <a href="/projects" className="block p-4 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
              <h3 className="font-medium text-green-900 dark:text-green-100">Projects</h3>
              <p className="text-sm text-green-600 dark:text-green-300">Manage work</p>
            </a>
            <a href="/ai-mentor" className="block p-4 bg-purple-50 dark:bg-purple-950 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">AI Mentor</h3>
              <p className="text-sm text-purple-600 dark:text-purple-300">Get guidance</p>
            </a>
            <a href="/resume" className="block p-4 bg-orange-50 dark:bg-orange-950 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">
              <h3 className="font-medium text-orange-900 dark:text-orange-100">Resume</h3>
              <p className="text-sm text-orange-600 dark:text-orange-300">Build resume</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
