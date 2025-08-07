// components/AnimatedTimeline.tsx
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MapPin })), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })), { ssr: false });

interface TimelineItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
  type: 'work' | 'education' | 'project';
  location?: string;
  achievements?: string[];
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
}

const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({ items }) => {
  const [isClient, setIsClient] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsClient(true);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-id');
            if (itemId) {
              setVisibleItems(prev => new Set(prev).add(itemId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isClient && observerRef.current) {
      const elements = document.querySelectorAll('[data-id]');
      elements.forEach(el => observerRef.current?.observe(el));

      return () => {
        elements.forEach(el => observerRef.current?.unobserve(el));
      };
    }
  }, [isClient, items]);

  if (!isClient) {
    return <div className="h-96 bg-muted animate-pulse rounded-lg"></div>;
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'work':
        return '💼';
      case 'education':
        return '🎓';
      case 'project':
        return '🚀';
      default:
        return '📍';
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'work':
        return 'from-blue-500 to-cyan-500';
      case 'education':
        return 'from-green-500 to-emerald-500';
      case 'project':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500"></div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            data-id={item.id}
            className={`relative pl-20 transition-all duration-700 transform ${
              visibleItems.has(item.id) 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Timeline node */}
            <div className={`absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-background transition-all duration-300 ${
              hoveredItem === item.id 
                ? `bg-gradient-to-r ${getItemColor(item.type)} scale-150 shadow-lg` 
                : `bg-gradient-to-r ${getItemColor(item.type)}`
            }`}>
              {hoveredItem === item.id && (
                <div className="absolute -top-8 -left-4 text-2xl animate-bounce">
                  {getItemIcon(item.type)}
                </div>
              )}
            </div>

            {/* Content card */}
            <div className={`bg-background border border-border rounded-xl p-6 shadow-sm transition-all duration-300 ${
              hoveredItem === item.id 
                ? 'shadow-lg scale-105 border-primary/50' 
                : 'hover:shadow-md'
            }`}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-primary font-medium flex items-center">
                      {item.company}
                      {item.location && (
                        <>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.duration}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>

                {/* Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {item.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            hoveredItem === item.id
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white transform scale-110'
                              : 'bg-accent text-accent-foreground hover:bg-accent/80'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hover effect decoration */}
              {hoveredItem === item.id && (
                <div className="absolute top-0 right-0 p-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Animated particles */}
      {hoveredItem && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedTimeline;
