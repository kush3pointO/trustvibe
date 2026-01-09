import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'success' | 'error';
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'neutral', icon }: BadgeProps) {
  const variantClasses = {
    neutral: 'bg-neutral-100 text-neutral-700',
    brand: 'bg-brand-100 text-brand-700',
    success: 'bg-success-100 text-success-700',
    error: 'bg-error-100 text-error-700',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-caption-bold ${variantClasses[variant]}`}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
}
