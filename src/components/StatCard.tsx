import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  description?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  className = '',
  description,
  onClick
}) => {
  // Function to get hover color based on current color
  const getHoverClass = () => {
    if (className.includes('bg-blue')) return 'hover:bg-blue-100/90';
    if (className.includes('bg-green')) return 'hover:bg-green-100/90';
    if (className.includes('bg-yellow')) return 'hover:bg-yellow-100/90';
    if (className.includes('bg-purple')) return 'hover:bg-purple-100/90';
    return 'hover:bg-gray-100/90';
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden p-6 rounded-lg shadow-md
        transition-all duration-300 transform
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
        ${className}
        ${onClick ? getHoverClass() : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs mt-2 opacity-70">{description}</p>
      )}
      
      {/* Gradient overlay on hover */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
    </div>
  );
};

export default StatCard; 