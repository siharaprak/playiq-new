'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PlayIQLogoProps {
  variant?: 'navbar' | 'hero';
  className?: string;
}

export function PlayIQLogo({ variant = 'navbar', className = '' }: PlayIQLogoProps) {
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <img
          src="/images/playiq-logo-cropped.png"
          alt="PlayIQ"
          className="w-full max-w-[500px] h-auto drop-shadow-[2px_2px_0_#7b4fce] dark:drop-shadow-[0_0_15px_rgba(0,200,255,0.6)]"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/images/playiq-logo-cropped.png"
        alt="PlayIQ"
        className="h-8 md:h-10 w-auto drop-shadow-[1px_1px_0_#7b4fce] dark:drop-shadow-[0_0_8px_rgba(0,200,255,0.5)] object-contain"
        draggable={false}
      />
    </div>
  );
}
