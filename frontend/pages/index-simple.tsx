import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DevBoard Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">Welcome!</h2>
            <p className="text-gray-600 mt-2">Your DevBoard is ready</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <p className="text-gray-600 mt-2">Manage your projects</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">Journal</h2>
            <p className="text-gray-600 mt-2">Track your progress</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">AI Mentor</h2>
            <p className="text-gray-600 mt-2">Get coding help</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/journal" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
              <h3 className="font-medium text-blue-900">Journal</h3>
              <p className="text-sm text-blue-600">Write & reflect</p>
            </a>
            <a href="/projects" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100">
              <h3 className="font-medium text-green-900">Projects</h3>
              <p className="text-sm text-green-600">Manage work</p>
            </a>
            <a href="/ai-mentor" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
              <h3 className="font-medium text-purple-900">AI Mentor</h3>
              <p className="text-sm text-purple-600">Get guidance</p>
            </a>
            <a href="/resume" className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100">
              <h3 className="font-medium text-orange-900">Resume</h3>
              <p className="text-sm text-orange-600">Build resume</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
