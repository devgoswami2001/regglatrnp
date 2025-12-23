'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { path: '/register', name: 'OTP Verification' },
  { path: '/shift-selection', name: 'Shift & Stoppage' },
  { path: '/confirmation', name: 'Confirmation' },
];

export function StepIndicator() {
  const pathname = usePathname();
  
  let activeStepIndex = steps.findIndex(step => pathname.startsWith(step.path));

  if (pathname === '/') {
    activeStepIndex = 0;
  }
  
  if (pathname.startsWith('/confirmation')) {
    activeStepIndex = 2;
  }

  if (activeStepIndex === -1 && pathname.startsWith('/register')) {
    activeStepIndex = 0;
  }

  if (activeStepIndex === -1) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-start">
        {steps.map((step, index) => (
          <div key={step.name} className="flex w-full items-center">
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all duration-300',
                  index < activeStepIndex
                    ? 'border-green-500 bg-green-500 text-white'
                    : index === activeStepIndex
                    ? 'scale-110 border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground'
                )}
              >
                {index < activeStepIndex ? (
                  <Check className="h-6 w-6" />
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={cn(
                  'mt-2 w-24 text-center text-xs font-medium md:text-sm',
                  index <= activeStepIndex
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="relative mx-2 h-1 flex-1 rounded bg-border">
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded transition-all duration-500',
                    index < activeStepIndex ? 'w-full bg-green-500' : 'w-0'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
