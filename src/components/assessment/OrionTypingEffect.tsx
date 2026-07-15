'use client';

import React, { useState, useEffect, useRef } from 'react';

interface OrionTypingEffectProps {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * Typewriter effect for Orion's conversational script.
 * Types each line character by character with a pause between lines.
 */
export default function OrionTypingEffect({
  lines,
  speed = 30,
  lineDelay = 600,
  onComplete,
  className = '',
}: OrionTypingEffectProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    if (isComplete) {
      setShowCursor(false);
      return;
    }
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, [isComplete]);

  // Typing animation
  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex === 0) {
      // Start new line
      setDisplayedLines((prev) => [...prev, '']);
    }

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = currentLine.substring(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Line complete — pause before next
      const timeout = setTimeout(() => {
        setCurrentLineIndex((l) => l + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed, lineDelay, onComplete]);

  // Auto-scroll to latest line
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Allow clicking to skip to full text
  const handleSkip = () => {
    if (isComplete) return;
    setDisplayedLines(lines);
    setCurrentLineIndex(lines.length);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <div
      ref={containerRef}
      className={`orion-typing-container ${className}`}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSkip()}
    >
      {displayedLines.map((line, idx) => (
        <p
          key={idx}
          className="orion-line"
          style={{
            opacity: idx === displayedLines.length - 1 && !isComplete ? 1 : 0.95,
          }}
        >
          {line}
          {idx === displayedLines.length - 1 && !isComplete && showCursor && (
            <span className="orion-cursor">|</span>
          )}
        </p>
      ))}
      {!isComplete && (
        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Tap anywhere to skip
        </p>
      )}
    </div>
  );
}
