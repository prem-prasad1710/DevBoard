import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Trash2, 
  Plus,
  BookOpen,
  Code,
  Lightbulb,
  HelpCircle,
  Clock,
  Settings
} from 'lucide-react';
import { useAIChat } from '@/hooks';

const AIMentorPage = () => {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    chatHistory, 
    loading, 
    error, 
    sendAIMessage,
    refetch
  } = useAIChat();

  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      await sendMessage({
        sessionId: selectedSession,
        message: currentMessage,
        context: 'developer-mentor'
      });
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const session = await createSession();
      setSelectedSession(session.id);
      setIsCreatingSession(false);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await deleteSession(sessionId);
        if (selectedSession === sessionId) {
          setSelectedSession(null);
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const currentChat = chats.find(chat => chat.sessionId === selectedSession);
  const chatSessions = [...new Set(chats.map(chat => chat.sessionId))];

  const suggestedPrompts = [
    {
      icon: Code,
      title: "Code Review",
      prompt: "Can you review this code and suggest improvements?",
      category: "Development"
    },
    {
      icon: Lightbulb,
      title: "Algorithm Help",
      prompt: "I need help optimizing this algorithm. Can you suggest a better approach?",
      category: "Problem Solving"
    },
    {
      icon: BookOpen,
      title: "Learning Path",
      prompt: "What should I learn next to advance my career as a developer?",
      category: "Career"
    },
    {
      icon: HelpCircle,
      title: "Debug Issue",
      prompt: "I'm having trouble with this bug. Can you help me debug it?",
      category: "Debugging"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="p-2 text-gray-400 hover:text-gray-600 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">AI Mentor</h1>
                  <p className="text-sm text-gray-500">Your coding companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat Sessions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">Chat Sessions</h2>
                  <button
                    onClick={() => setIsCreatingSession(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-2 overflow-y-auto">
                {chatSessions.map((sessionId) => {
                  const session = chats.find(chat => chat.sessionId === sessionId);
                  return (
                    <div
                      key={sessionId}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSession === sessionId
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSession(sessionId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Session {sessionId.slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(session?.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(sessionId);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {chatSessions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No chat sessions yet</p>
                    <button
                      onClick={handleCreateSession}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Start your first chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              {selectedSession ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Bot className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">AI Mentor</h3>
                          <p className="text-xs text-gray-500">Online • Ready to help</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChat?.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 mr-2" />
                            ) : (
                              <Bot className="h-4 w-4 mr-2" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.role === 'user' ? 'You' : 'AI Mentor'}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask your AI mentor anything..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSending || !currentMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Welcome Screen */
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bot className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome to AI Mentor
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your personal coding companion. Ask questions, get code reviews, learn new concepts, and accelerate your development journey.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleCreateSession();
                            setCurrentMessage(prompt.prompt);
                          }}
                          className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center mb-2">
                            <prompt.icon className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {prompt.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{prompt.category}</p>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleCreateSession}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Start New Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentorPage;
