import React from 'react';

interface IconWithBackgroundProps {
  icon: React.ReactNode;
  variant?: 'brand' | 'success' | 'neutral';
  size?: 'small' | 'medium' | 'large' | 'x-large';
  square?: boolean;
}

export function IconWithBackground({ 
  icon, 
  variant = 'brand', 
  size = 'medium',
  square = false
}: IconWithBackgroundProps) {
  const variantClasses = {
    'brand': 'bg-brand-100 text-brand-600',
    'success': 'bg-success-100 text-success-600',
    'neutral': 'bg-neutral-100 text-neutral-600',
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-10 h-10 text-xl',
    large: 'w-12 h-12 text-2xl',
    'x-large': 'w-16 h-16 text-3xl',
  };

  return (
    <div className={`inline-flex items-center justify-center ${square ? 'rounded-lg' : 'rounded-full'} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {icon}
    </div>
  );
}
