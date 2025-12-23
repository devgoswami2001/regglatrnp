import React from 'react';
import { cn } from '@/lib/utils';
import { BusFront } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="rounded-lg bg-primary p-2">
      <BusFront className="h-6 w-6 text-primary-foreground" />
    </div>
    <span className="text-2xl font-bold text-foreground">GLA TransportPass</span>
  </div>
);

export default Logo;
