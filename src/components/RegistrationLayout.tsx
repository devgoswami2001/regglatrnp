import { StepIndicator } from '@/components/StepIndicator';
import Logo from '@/components/Logo';

export function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-background p-4 pt-8 sm:p-6 sm:pt-12 lg:p-8 lg:pt-16">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <div className="mt-6 space-y-1">
            <h2 className="text-xl font-semibold text-foreground/80">
              Transport Department
            </h2>
            <p className="text-sm tracking-wide text-muted-foreground">
              One Shift • One Route • One Bus • One Seat
            </p>
          </div>
        </header>

        <div className="mb-8 flex w-full justify-center px-4 md:px-10">
          <StepIndicator />
        </div>

        <main className="flex w-full justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
