import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  image?: string;
}

export function Avatar({ children, size = 'medium', image }: AvatarProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold overflow-hidden ${sizeClasses[size]}`}>
      {image ? (
        <Image src={image} alt="Avatar" fill className="object-cover" />
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
}
