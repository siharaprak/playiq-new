'use client';

import React from 'react';

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
}

export default function ConfirmButton({ confirmMessage, onClick, children, ...props }: ConfirmButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
