// utils/markdownRenderer.tsx
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Simple markdown parsing for common elements
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];
    let listItems: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-2 overflow-x-auto">
              <pre className="text-sm">
                <code className={`language-${codeLanguage}`}>
                  {codeContent.join('\n')}
                </code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeContent = [];
          codeLanguage = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.substring(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Handle lists (bullet points)
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          // End previous list if exists
          if (listItems.length > 0) {
            elements.push(
              <ul key={`list-${i}`} className="list-disc pl-6 my-2 space-y-1">
                {listItems.map((item, idx) => (
                  <li key={idx}>{parseInlineMarkdown(item)}</li>
                ))}
              </ul>
            );
            listItems = [];
          }
          inList = true;
        }
        listItems.push(line.substring(2).trim());
        continue;
      } else if (inList && line.trim() !== '') {
        // End list when encountering non-list content
        elements.push(
          <ul key={`list-${i}`} className="list-disc pl-6 my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        inList = false;
        listItems = [];
        // Continue processing this line as regular content
      } else if (inList && line.trim() === '') {
        // Continue list on empty lines
        continue;
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(line.replace(/^\d+\.\s/, ''));
        continue;
      }

      // Handle headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold mt-4 mb-2">{parseInlineMarkdown(line.substring(2))}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold mt-3 mb-2">{parseInlineMarkdown(line.substring(3))}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold mt-2 mb-1">{parseInlineMarkdown(line.substring(4))}</h3>);
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="mb-2">{parseInlineMarkdown(line)}</p>);
      }
    }

    // Handle remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc pl-6 my-2 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // Process bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        if (beforeText) {
          result.push(<span key={key++}>{beforeText}</span>);
        }
      }

      // Add the bold text
      result.push(
        <strong key={key++} className="font-bold">
          {match[1]}
        </strong>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        // Handle inline code in remaining text
        const codeRegex = /`([^`]+)`/g;
        let codeLastIndex = 0;
        let codeMatch;
        const codeResult: React.ReactNode[] = [];

        while ((codeMatch = codeRegex.exec(remainingText)) !== null) {
          if (codeMatch.index > codeLastIndex) {
            const beforeCode = remainingText.substring(codeLastIndex, codeMatch.index);
            if (beforeCode) {
              codeResult.push(<span key={key++}>{beforeCode}</span>);
            }
          }

          codeResult.push(
            <code key={key++} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
              {codeMatch[1]}
            </code>
          );

          codeLastIndex = codeMatch.index + codeMatch[0].length;
        }

        if (codeLastIndex < remainingText.length) {
          const finalText = remainingText.substring(codeLastIndex);
          if (finalText) {
            codeResult.push(<span key={key++}>{finalText}</span>);
          }
        }

        result.push(...codeResult);
      }
    }

    return result.length > 0 ? result : [<span key={0}>{text}</span>];
  };

  return (
    <div className={className}>
      {parseMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
