import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'brand-primary' | 'neutral' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'brand-primary', 
  size = 'medium',
  icon,
  onClick,
  disabled = false
}: ButtonProps) {
  const variantClasses = {
    'brand-primary': 'bg-brand-600 text-white hover:bg-brand-700',
    'neutral': 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    'success': 'bg-success-600 text-white hover:bg-success-700',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-caption',
    medium: 'px-4 py-2 text-body',
    large: 'px-6 py-3 text-body-bold',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
