import { StepIndicator } from '@/components/StepIndicator';
import Logo from '@/components/Logo';

export function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-4xl flex-col items-center">
        <header className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-4 text-lg font-medium tracking-wide text-muted-foreground">
            One Shift • One Route • One Bus • One Seat
          </p>
        </header>
        <div className="flex w-full justify-center px-4 md:px-10">
          <StepIndicator />
        </div>
        <main className="w-full max-w-md">{children}</main>
      </div>
    </div>
  );
}
