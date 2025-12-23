'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RegistrationLayout } from '@/components/RegistrationLayout';
import { Loader2, Mail, KeyRound } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits.')
    .max(6, 'OTP must be 6 digits.'),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

// Mock backend functions
const sendOtp = async (
  email: string
): Promise<{ success: boolean; maskedEmail: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (email.toLowerCase() === 'user@example.com') {
    const atIndex = email.indexOf('@');
    const masked = `${email.substring(0, 1)}***${email.substring(atIndex)}`;
    return { success: true, maskedEmail: masked };
  }
  return { success: false, maskedEmail: '' };
};

const verifyOtp = async (
  otp: string
): Promise<{ success: boolean; userId?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (otp === '123456') {
    return { success: true, userId: '1' };
  }
  return { success: false };
};

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const { toast } = useToast();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSendOtp = async (data: EmailFormValues) => {
    setIsSending(true);
    setEmail(data.email);
    const result = await sendOtp(data.email);
    setIsSending(false);

    if (result.success) {
      setMaskedEmail(result.maskedEmail);
      setStep('otp');
      setCooldown(30);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not send OTP. Please check the email and try again.',
      });
    }
  };

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setIsVerifying(true);
    const result = await verifyOtp(data.otp);
    setIsVerifying(false);

    if (result.success && result.userId) {
      toast({
        title: 'Success',
        description: 'Login successful! Redirecting...',
      });
      router.push(`/shift-selection?userId=${result.userId}`);
    } else {
      otpForm.setError('otp', { message: 'Invalid or expired OTP.' });
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'The OTP you entered is incorrect.',
      });
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsSending(true);
    const result = await sendOtp(email);
    setIsSending(false);
    if (result.success) {
      toast({
        title: 'OTP Resent',
        description: `A new OTP has been sent to ${maskedEmail}`,
      });
      setCooldown(30);
    }
  };

  return (
    <RegistrationLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Secure Login</CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your registered email to receive a One-Time Password (OTP).'
              : `An OTP has been sent to ${maskedEmail}. Please enter it below.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleSendOtp)}
                className="space-y-6"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="· · · · · ·"
                            {...field}
                            className="pl-10 text-center tracking-[0.5em]"
                            maxLength={6}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isVerifying}
                >
                  {isVerifying && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify OTP
                </Button>
                <div className="text-center text-sm">
                  {cooldown > 0 ? (
                    <p className="text-muted-foreground">
                      Resend OTP in {cooldown}s
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      type="button"
                      onClick={handleResend}
                      className="h-auto p-0"
                      disabled={isSending}
                    >
                      Didn't receive code? Resend OTP
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </RegistrationLayout>
  );
}
