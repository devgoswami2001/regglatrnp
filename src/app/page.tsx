'use client';

import { useState, useEffect, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Loader2, KeyRound } from 'lucide-react';
import { findUserById } from '@/lib/data';

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits.')
    .max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

// Mock backend functions
const sendOtp = async (
  email: string
): Promise<{ success: boolean; maskedEmail: string }> => {
  console.log(`Sending OTP to ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const atIndex = email.indexOf('@');
  if (atIndex < 1) return { success: false, maskedEmail: '' };
  const masked = `${email.substring(0, 1)}***${email.substring(atIndex)}`;
  return { success: true, maskedEmail: masked };
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

function OtpLoginContent() {
  const [isSending, setIsSending] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    const id = searchParams.get('userId');
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Invalid Link',
        description: 'User ID is missing. Please use the link provided.',
      });
      return;
    }
    const user = findUserById(id);
    if (user) {
      setUserId(id);
      setEmail(user.email);
    } else {
      toast({
        variant: 'destructive',
        title: 'User Not Found',
        description: 'No user found for the provided ID.',
      });
    }
  }, [searchParams, toast]);

  const handleSendOtp = async (emailToSend: string) => {
    setIsSending(true);
    otpForm.reset();
    try {
      const result = await sendOtp(emailToSend);
      if (result.success) {
        setMaskedEmail(result.maskedEmail);
        toast({
          title: 'OTP Sent Successfully',
          description: `A 6-digit code has been sent to ${result.maskedEmail}.`,
        });
        setCooldown(30);
      } else {
        throw new Error('Failed to send OTP.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Sending OTP',
        description:
          'Could not send OTP. Please check the link and try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (email) {
      handleSendOtp(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setIsVerifying(true);
    try {
      const result = await verifyOtp(data.otp);
      if (result.success && result.userId) {
        toast({
          title: 'Login Successful',
          description: 'You are now being redirected...',
        });
        router.push(`/shift-selection?userId=${result.userId}`);
      } else {
        otpForm.setError('otp', { message: 'The OTP you entered is invalid or has expired.' });
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: 'The OTP you entered is incorrect. Please try again.',
        });
      }
    } catch (error) {
      toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'An unexpected error occurred. Please try again later.',
        });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0 || isSending || !email) return;
    handleSendOtp(email);
  };
  
  if (!userId) {
     return (
       <RegistrationLayout>
         <Card className="w-full">
           <CardHeader>
             <CardTitle>Secure Login</CardTitle>
             <CardDescription>
               Please use the unique login link sent to you to begin the process.
             </CardDescription>
           </CardHeader>
         </Card>
       </RegistrationLayout>
     );
  }

  if (isSending && !maskedEmail) {
    return (
      <RegistrationLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Preparing your secure login...</p>
            <p className="mt-2 text-xs text-muted-foreground">Sending OTP to your registered email.</p>
          </CardContent>
        </Card>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Secure Email Verification</CardTitle>
          <CardDescription>
            {`Enter the 6-digit one-time password (OTP) sent to ${maskedEmail}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FormLabel className="sr-only">6-Digit OTP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="· · · · · ·"
                          {...field}
                          className="pl-10 text-center text-2xl tracking-[0.5em] font-mono"
                          maxLength={6}
                          autoFocus
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
                disabled={isVerifying || isSending}
              >
                {isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Verify & Continue
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <p>OTP is valid for 5 minutes. Do not refresh the page.</p>
                {cooldown > 0 ? (
                  <p className="mt-2">
                    Resend OTP in {cooldown}s
                  </p>
                ) : (
                  <Button
                    variant="link"
                    type="button"
                    onClick={handleResend}
                    className="mt-1 h-auto p-0"
                    disabled={isSending || isVerifying}
                  >
                    Didn't receive the code? Resend
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </RegistrationLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <OtpLoginContent />
    </Suspense>
  );
}
