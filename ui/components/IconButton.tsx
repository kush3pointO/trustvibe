import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  variant?: 'brand-primary' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function IconButton({ 
  icon, 
  variant = 'brand-primary', 
  size = 'medium',
  onClick,
  disabled = false
}: IconButtonProps) {
  const variantClasses = {
    'brand-primary': 'bg-brand-600 text-white hover:bg-brand-700',
    'neutral': 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
  };

  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon}
    </button>
  );
}
