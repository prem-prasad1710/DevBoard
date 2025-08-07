// components/MessageRenderer.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ content, className = '' }) => {
  const renderContent = () => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0] || 'javascript';
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '8px',
                fontSize: '14px',
                margin: 0,
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        // Regular text with formatting
        return (
          <div key={index} className="space-y-2">
            {part.split('\n').map((line, lineIndex) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h4 key={lineIndex} className="font-semibold text-foreground mt-4 mb-2">
                    {line.slice(2, -2)}
                  </h4>
                );
              } else if (line.startsWith('• ')) {
                return (
                  <div key={lineIndex} className="flex items-start space-x-2 ml-4">
                    <span className="text-primary">•</span>
                    <span>{line.slice(2)}</span>
                  </div>
                );
              } else if (line.includes('`') && !line.startsWith('```')) {
                // Inline code
                const inlineCodeRegex = /`([^`]+)`/g;
                const formatted = line.replace(inlineCodeRegex, (match, code) => 
                  `<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">${code}</code>`
                );
                return (
                  <p key={lineIndex} dangerouslySetInnerHTML={{ __html: formatted }} />
                );
              } else if (line.trim()) {
                return <p key={lineIndex}>{line}</p>;
              }
              return null;
            })}
          </div>
        );
      }
    });
  };

  return <div className={className}>{renderContent()}</div>;
};
