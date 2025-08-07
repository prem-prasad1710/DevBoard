// components/SkillsChart.tsx
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false });

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillsChartProps {
  skills: Skill[];
}

const SkillsChart: React.FC<SkillsChartProps> = ({ skills }) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  const maxLevel = Math.max(...skills.map(skill => skill.level));
  
  return (
    <div className="space-y-6">
      {/* Radar Chart Style Visualization */}
      <div className="relative h-64 w-full">
        <svg className="w-full h-full" viewBox="0 0 300 300">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((radius) => (
            <circle
              key={radius}
              cx="150"
              cy="150"
              r={radius * 1.2}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}
          
          {/* Skill points */}
          {skills.slice(0, 8).map((skill, index) => {
            const angle = (index * 360) / 8;
            const radian = (angle - 90) * (Math.PI / 180);
            const radius = (skill.level / 100) * 120;
            const x = 150 + Math.cos(radian) * radius;
            const y = 150 + Math.sin(radian) * radius;
            
            return (
              <g key={skill.name}>
                {/* Skill line */}
                <line
                  x1="150"
                  y1="150"
                  x2={150 + Math.cos(radian) * 120}
                  y2={150 + Math.sin(radian) * 120}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="1"
                />
                
                {/* Skill point */}
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredSkill === skill.name ? "8" : "6"}
                  fill="url(#skillGradient)"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
                
                {/* Skill label */}
                <text
                  x={150 + Math.cos(radian) * 140}
                  y={150 + Math.sin(radian) * 140}
                  textAnchor="middle"
                  className="text-xs fill-current"
                  dominantBaseline="middle"
                >
                  {skill.name}
                </text>
                
                {/* Skill level on hover */}
                {hoveredSkill === skill.name && (
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs fill-current font-bold"
                    dominantBaseline="middle"
                  >
                    {skill.level}%
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Interactive Skill Bars */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Skill Levels
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group p-4 rounded-lg border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    hoveredSkill === skill.name 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-105' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{ 
                    width: `${skill.level}%`,
                    transformOrigin: 'left center'
                  }}
                ></div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsChart;
