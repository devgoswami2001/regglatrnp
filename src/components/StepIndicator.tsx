'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { path: '/', name: 'OTP Verification' },
  { path: '/shift-selection', name: 'Shift & Stoppage' },
  { path: '/confirmation', name: 'Confirmation' },
];

export function StepIndicator() {
  const pathname = usePathname();
  
  // Find the index of the current step based on the path
  let activeStepIndex = steps.findIndex(step => pathname.startsWith(step.path) && step.path !== '/');
  if (pathname === '/') {
    activeStepIndex = 0;
  }
  // For paths that might not be explicitly listed but belong to a step (like stoppage selection)
  if (pathname.startsWith('/stoppage-selection')) {
    activeStepIndex = 1;
  }
   if (pathname.startsWith('/confirmation')) {
    activeStepIndex = 2;
  }


  if (activeStepIndex === -1 && pathname !== '/') {
     const lastActiveStep = [...steps].reverse().find(step => pathname.startsWith(step.path));
     if(lastActiveStep) {
        activeStepIndex = steps.indexOf(lastActiveStep);
     }
  }
  if (activeStepIndex === -1 && pathname === '/') {
    activeStepIndex = 0;
  }


  if (activeStepIndex === -1) return null;

  return (
    <div className="mb-12 w-full max-w-2xl">
      <div className="flex items-start">
        {steps.map((step, index) => (
          <div key={step.name} className="flex w-full items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all duration-300',
                  index < activeStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : index === activeStepIndex
                    ? 'scale-110 border-2 border-primary bg-primary/10 text-primary'
                    : 'border bg-card text-muted-foreground'
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
                  'mt-2 w-24 text-center text-xs md:text-sm',
                  index <= activeStepIndex
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-1 flex-1 rounded',
                  index < activeStepIndex ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
