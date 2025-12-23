'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { path: '/', name: 'Login' },
  { path: '/shift-selection', name: 'Details & Shift' },
  { path: '/stoppage-selection', name: 'Route & Stoppage' },
  { path: '/confirmation', name: 'Confirmation' },
];

export function StepIndicator() {
  const pathname = usePathname();
  const currentStep = [...steps]
    .reverse()
    .find(step => pathname.startsWith(step.path));
  const activeStepIndex = currentStep ? steps.indexOf(currentStep) : -1;

  if (activeStepIndex === -1) return null;

  return (
    <div className="mb-12">
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
                  'mt-2 w-20 text-center text-xs md:text-sm',
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
