import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const DebugPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Session Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <div className="mt-4">
                  <h3 className="font-semibold">Session Data:</h3>
                  <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
            <div className="space-y-2">
              <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
              <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
              <p><strong>Has NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Yes' : 'No'}</p>
              <p><strong>Has GITHUB_CLIENT_ID:</strong> {process.env.GITHUB_CLIENT_ID ? 'Yes' : 'No'}</p>
              <p><strong>Has GOOGLE_CLIENT_ID:</strong> {process.env.GOOGLE_CLIENT_ID ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Current URL */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Request</h2>
            <div className="space-y-2">
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
              <p><strong>Router Path:</strong> {router.asPath}</p>
              <p><strong>Router Query:</strong> {JSON.stringify(router.query)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Login Page
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
              >
                Go to Home Page
              </button>
              <button
                onClick={() => window.location.href = '/api/auth/signin'}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-4"
              >
                NextAuth Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
