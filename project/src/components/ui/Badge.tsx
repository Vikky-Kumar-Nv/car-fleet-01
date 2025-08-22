import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'booked' | 'yet-to-start' | 'ongoing' | 'completed' | 'pending' | 'alert' | 'canceled';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-100 text-gray-800',
    booked: 'bg-amber-100 text-amber-800',
    'yet-to-start': 'bg-blue-100 text-blue-800',
    ongoing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-red-100 text-red-800',
    alert: 'bg-orange-100 text-orange-800',
    canceled: 'bg-gray-200 text-gray-600'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};