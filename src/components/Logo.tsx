import React from 'react';
import { cn } from '@/lib/utils';
import { BusFront } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="rounded-lg bg-primary p-1 shadow-inner shadow-primary/50">
      {/* Smaller bus icon */}
      <BusFront className="h-5 w-5 text-primary-foreground" />
      {/* Alternatively: <BusFront size={18} className="text-primary-foreground" /> */}
    </div>
    <span className="text-xl font-bold text-foreground">Transport Department</span>
  </div>
);

export default Logo;
