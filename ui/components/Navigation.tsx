"use client";

import React from 'react';
import Link from 'next/link';
import { IconWithBackground } from '@/ui/components/IconWithBackground';
import { FeatherHeart } from '@/subframe/core';

export function Navigation() {
  return (
    <nav className="w-full border-b border-neutral-200 bg-white px-6 py-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <IconWithBackground
            variant="brand"
            size="medium"
            icon={<FeatherHeart />}
            square={false}
          />
          <span className="text-heading-3 font-heading-3 text-brand-600">
            TrustVibe
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/reviews" 
            className="text-body-bold font-body-bold text-default-font hover:text-brand-600 transition-colors"
          >
            Read Reviews
          </Link>
          <Link 
            href="/write-review" 
            className="text-body-bold font-body-bold text-default-font hover:text-brand-600 transition-colors"
          >
            Write Review
          </Link>
        </div>
      </div>
    </nav>
  );
}
