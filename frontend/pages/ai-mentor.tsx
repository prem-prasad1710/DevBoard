import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MarkdownRenderer from '../utils/markdownRenderer';

// Dynamically import icons to prevent hydration issues
const Bot = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Bot })), { ssr: false });
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });
const Send = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Send })), { ssr: false });
const Loader2 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Loader2 })), { ssr: false });
const Code = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Code })), { ssr: false });
const Lightbulb = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lightbulb })), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })), { ssr: false });
const HelpCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.HelpCircle })), { ssr: false });
const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const MessageCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageCircle })), { ssr: false });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIMentorPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    // Create empty assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      // Call streaming AI API
      const response = await fetch('/api/ai-mentor-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedContent += chunk;

            // Update the assistant message with streaming content
            setMessages(prev => {
              const newMessages = [...prev];
              const messageIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
              if (messageIndex !== -1) {
                newMessages[messageIndex] = {
                  ...newMessages[messageIndex],
                  content: accumulatedContent
                };
              }
              return newMessages;
            });
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Update the assistant message with error content
      setMessages(prev => {
        const newMessages = [...prev];
        const messageIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
        if (messageIndex !== -1) {
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: 'I apologize, but I encountered an error while processing your request. Please try again or check your connection.'
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    // This function is no longer needed since we're using the API
    return "This function is deprecated. Using API instead.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    {
      icon: Code,
      title: "Code Review",
      prompt: "Can you review this code and suggest improvements?",
      category: "Development",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: Lightbulb,
      title: "Algorithm Help",
      prompt: "I need help optimizing this algorithm. Can you suggest a better approach?",
      category: "Problem Solving",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: BookOpen,
      title: "Learning Path",
      prompt: "What should I learn next to advance my career as a developer?",
      category: "Career",
      gradient: "from-green-500 to-green-700"
    },
    {
      icon: HelpCircle,
      title: "Debug Issue",
      prompt: "I'm having trouble with this bug. Can you help me debug it?",
      category: "Debugging",
      gradient: "from-red-500 to-red-700"
    },
    {
      icon: Brain,
      title: "Architecture",
      prompt: "How should I structure this application for scalability?",
      category: "System Design",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: Zap,
      title: "Performance",
      prompt: "How can I improve the performance of my application?",
      category: "Optimization",
      gradient: "from-indigo-500 to-indigo-700"
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 p-4 rounded-2xl">
                {isClient && <Brain className="h-8 w-8 text-white" />}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Mentor</h1>
              <p className="text-muted-foreground">Your personal coding companion and development guide</p>
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="p-8 text-center bg-gradient-to-br from-background to-accent/20 border-border/50">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 p-6 rounded-full">
                    {isClient && <Sparkles className="h-12 w-12 text-white animate-pulse" />}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Welcome to Your AI Mentor</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Get instant help with coding challenges, architecture decisions, debugging issues, 
                    and career guidance. Your AI mentor is here to accelerate your development journey.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    {isClient && <Code className="h-4 w-4" />}
                    <span>Code Reviews</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isClient && <Lightbulb className="h-4 w-4" />}
                    <span>Problem Solving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isClient && <BookOpen className="h-4 w-4" />}
                    <span>Learning Guidance</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Suggested Prompts */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground text-center">How can I help you today?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedPrompts.map((prompt, index) => {
                  const IconComponent = prompt.icon;
                  return (
                    <Card
                      key={index}
                      className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
                      onClick={() => setCurrentMessage(prompt.prompt)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${prompt.gradient}`}>
                            {isClient && <IconComponent className="h-5 w-5 text-white" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground">{prompt.title}</h4>
                            <p className="text-xs text-muted-foreground">{prompt.category}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {prompt.prompt}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Message Input */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  {isClient && <MessageCircle className="h-5 w-5" />}
                  <span className="font-medium">Start a conversation</span>
                </div>
                <div className="flex space-x-3">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your AI mentor anything... (e.g., 'How do I implement authentication in Next.js?')"
                    className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground placeholder:text-muted-foreground"
                    rows={3}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="px-6 py-3 h-auto"
                  >
                    {isLoading ? (
                      isClient && <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      isClient && <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Chat Interface */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-[70vh] flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-700 p-2 rounded-lg">
                      {isClient && <Brain className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Mentor Session</h3>
                      <p className="text-sm text-muted-foreground">{messages.length} messages</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-6 py-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-12'
                              : 'bg-muted text-muted-foreground mr-12'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {message.role === 'user' ? (
                              isClient && <User className="h-4 w-4" />
                            ) : (
                              isClient && <Bot className="h-4 w-4" />
                            )}
                            <span className="text-xs font-medium opacity-70">
                              {message.role === 'user' ? 'You' : 'AI Mentor'}
                            </span>
                            <span className="text-xs opacity-50">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {message.content ? (
                            <div className="leading-relaxed">
                              {message.role === 'assistant' ? (
                                <MarkdownRenderer content={message.content} />
                              ) : (
                                <div className="whitespace-pre-wrap">{message.content}</div>
                              )}
                              {message.id === streamingMessageId && isLoading && (
                                <span className="inline-block w-3 h-5 bg-current animate-pulse ml-1">|</span>
                              )}
                            </div>
                          ) : message.id === streamingMessageId && isLoading ? (
                            <div className="flex items-center space-x-2 text-sm opacity-70">
                              <span>AI Mentor is typing</span>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex space-x-3">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Continue the conversation..."
                      className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground placeholder:text-muted-foreground"
                      rows={2}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !currentMessage.trim()}
                      className="px-6 h-auto"
                    >
                      {isLoading ? (
                        isClient && <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        isClient && <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar with suggestions */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  {suggestedPrompts.slice(0, 4).map((prompt, index) => {
                    const IconComponent = prompt.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMessage(prompt.prompt)}
                        className="w-full justify-start text-left h-auto p-3"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <div className={`p-1 rounded bg-gradient-to-r ${prompt.gradient}`}>
                            {isClient && <IconComponent className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{prompt.title}</div>
                            <div className="text-xs text-muted-foreground">{prompt.category}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-foreground mb-3">Tips</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    {isClient && <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />}
                    <p>Be specific in your questions for better responses</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    {isClient && <Code className="h-4 w-4 mt-0.5 text-blue-500" />}
                    <p>Include code snippets when asking for reviews</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    {isClient && <BookOpen className="h-4 w-4 mt-0.5 text-green-500" />}
                    <p>Ask follow-up questions to dive deeper</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIMentorPage;
