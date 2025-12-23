import { StepIndicator } from '@/components/StepIndicator';
import Logo from '@/components/Logo';

export function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-background p-4 pt-8 sm:p-6 sm:pt-12 lg:p-8 lg:pt-16">
      <div className="flex w-full max-w-4xl flex-col items-center">
        <header className="mb-12 flex flex-col items-center text-center">
          <Logo />
          <h2 className="mt-4 text-xl font-semibold text-foreground/80">
            Transport Department
          </h2>
          <p className="mt-2 text-base tracking-wide text-muted-foreground">
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
