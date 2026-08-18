'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PlayIQLogoProps {
  variant?: 'navbar' | 'hero';
  className?: string;
}

export function PlayIQLogo({ variant = 'navbar', className = '' }: PlayIQLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        {!imgError ? (
          <img
            src="/images/playiq-logo-cropped.png"
            alt="PlayIQ"
            onError={() => setImgError(true)}
            className="w-full max-w-[500px] h-auto drop-shadow-[2px_2px_0_#7b4fce] dark:drop-shadow-[0_0_15px_rgba(0,200,255,0.6)]"
            draggable={false}
          />
        ) : (
          <div className="font-display font-black text-5xl md:text-7xl uppercase tracking-widest flex items-center gap-1 py-4">
            <span className="text-[#00c8ff] drop-shadow-[0_0_20px_rgba(0,200,255,0.8)]">PLAY</span>
            <span className="text-[#a855f7] drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">IQ</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      {!imgError ? (
        <img
          src="/images/playiq-logo-cropped.png"
          alt="PlayIQ"
          onError={() => setImgError(true)}
          className="h-8 md:h-10 w-auto drop-shadow-[1px_1px_0_#7b4fce] dark:drop-shadow-[0_0_8px_rgba(0,200,255,0.5)] object-contain"
          draggable={false}
        />
      ) : (
        <div className="font-display font-black text-2xl uppercase tracking-wider flex items-center gap-0.5">
          <span className="text-[#00c8ff] drop-shadow-[0_0_10px_rgba(0,200,255,0.6)]">PLAY</span>
          <span className="bg-[#7b4fce] text-black px-1.5 py-0.5 rounded text-xs font-bold font-mono tracking-widest shadow-[0_0_10px_#7b4fce]">IQ</span>
        </div>
      )}
    </div>
  );
}
