"use client";

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface VslPlayerProps {
  src: string;
  /** Optional poster image. If omitted, the first frame of the video is used. */
  poster?: string;
  label?: string;
  /** 'landscape' = 16:9 (default), 'portrait' = 9:16 vertical video. */
  orientation?: 'landscape' | 'portrait';
  className?: string;
}

/**
 * Click-to-play video sales letter player.
 * Loads only metadata until the visitor presses play (keeps the hero fast),
 * then hands over to native controls.
 */
export function VslPlayer({ src, poster, label = 'Watch: See PlayIQ in action', orientation = 'landscape', className = '' }: VslPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setStarted(true);
    void v.play();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Neon frame glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-[#00c8ff] via-[#7b4fce] to-[#00c8ff] opacity-40 blur-lg pointer-events-none ${orientation === 'portrait' ? 'rounded-3xl' : ''}`} />

      <div className={`relative ${orientation === 'portrait' ? 'aspect-[9/16] rounded-2xl' : 'aspect-video'} overflow-hidden border-2 border-[#00c8ff]/60 bg-black shadow-[0_0_30px_rgba(0,200,255,0.25)]`}>
        <video
          ref={videoRef}
          // #t=0.5 makes browsers render a real frame as the poster when none is supplied
          src={poster ? src : `${src}#t=0.5`}
          poster={poster}
          preload="metadata"
          playsInline
          controls={started}
          className="w-full h-full object-cover"
          aria-label="PlayIQ overview video"
        />

        {!started && (
          <button
            type="button"
            id="vsl-play-button"
            onClick={handlePlay}
            aria-label="Play PlayIQ overview video"
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#020617]/45 hover:bg-[#020617]/25 transition-colors cursor-pointer"
          >
            <span className="relative flex items-center justify-center">
              <span className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#00c8ff]/30 animate-ping" />
              <span className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#00c8ff] border-2 border-white shadow-[0_0_30px_#00c8ff] group-hover:scale-110 group-hover:bg-white transition-transform">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#020617] ml-1" fill="currentColor" />
              </span>
            </span>
            <span className="font-display uppercase font-bold text-xs sm:text-sm tracking-[0.2em] text-white bg-black/60 border border-[#7b4fce] px-3 py-1">
              {label}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
