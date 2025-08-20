import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'booked' | 'ongoing' | 'completed' | 'pending' | 'alert';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    booked: 'bg-amber-100 text-amber-800',
    ongoing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-red-100 text-red-800',
    alert: 'bg-orange-100 text-orange-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};