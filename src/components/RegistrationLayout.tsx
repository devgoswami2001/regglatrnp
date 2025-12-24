import { StepIndicator } from '@/components/StepIndicator';
import Logo from '@/components/Logo';
import Image from 'next/image';

export function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-background p-4 pt-8 sm:p-6 sm:pt-12 lg:p-8 lg:pt-16">
      <div className="w-full max-w-4xl">
        <header className="relative mb-12 rounded-2xl border-2 border-primary/10 bg-card p-8 text-center shadow-lg shadow-primary/5">
          <div
            className="absolute inset-0 -z-10 h-full w-full rounded-2xl bg-muted/20"
            style={{
              backgroundImage:
                'linear-gradient(45deg, hsl(var(--primary) / 0.02) 25%, transparent 25%, transparent 75%, hsl(var(--primary) / 0.02) 75%, hsl(var(--primary) / 0.02)), linear-gradient(45deg, hsl(var(--primary) / 0.02) 25%, transparent 25%, transparent 75%, hsl(var(--primary) / 0.02) 75%, hsl(var(--primary) / 0.02))',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
              opacity: 0.5,
            }}
          />
          
          {/* Logo image with lg:w-32 (14rem/224px) and no shadows */}
          <div className="mx-auto mb-4 w-30 h-24 sm:w-28 sm:h-28 lg:w-80 lg:h-32">
            <Image
              src="/gla_logo.png"
              alt="Transport Department"
              width={224}  // 14rem = 224px for lg breakpoint
              height={224}
              className="h-full w-full object-contain rounded-xl"
              priority
            />
          </div>
          
          <Logo className="justify-center" />
          <div className="mt-4 space-y-1">
            <p className="text-sm tracking-wide text-muted-foreground">
              One Shift • One Route • One Bus • One Seat
            </p>
          </div>
        </header>

        <div className="mb-8 flex w-full justify-center">
          <StepIndicator />
        </div>

        <main className="flex w-full justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
