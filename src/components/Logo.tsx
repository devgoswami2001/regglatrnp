import React from 'react';
import { cn } from '@/lib/utils';
import { BusFront } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="rounded-lg bg-primary p-3 shadow-inner shadow-primary/50">
      <BusFront className="h-8 w-8 text-primary-foreground" />
    </div>
    <span className="text-3xl font-bold text-foreground">GLA TransportPass</span>
  </div>
);

export default Logo;
