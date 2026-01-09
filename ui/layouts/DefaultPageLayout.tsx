import React from 'react';

interface DefaultPageLayoutProps {
  children: React.ReactNode;
}

export function DefaultPageLayout({ children }: DefaultPageLayoutProps) {
  return (
    <div className="min-h-screen bg-default-background">
      {children}
    </div>
  );
}
