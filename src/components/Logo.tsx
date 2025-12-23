import React from 'react';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
      aria-label="GLA Transport Logo"
    >
      <path
        d="M14 32C14 35.3137 11.3137 38 8 38C4.68629 38 2 35.3137 2 32C2 28.6863 4.68629 26 8 26C11.3137 26 14 28.6863 14 32Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M46 32C46 35.3137 43.3137 38 40 38C36.6863 38 34 35.3137 34 32C34 28.6863 36.6863 26 40 26C43.3137 26 46 28.6863 46 32Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M14 32H34"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 26V15C8 12.7909 9.79086 11 12 11H36C38.2091 11 40 12.7909 40 15V26"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17H46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-2xl font-bold text-foreground">GLA TransportPass</span>
  </div>
);

export default Logo;
