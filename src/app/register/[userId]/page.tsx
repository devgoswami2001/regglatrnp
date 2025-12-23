'use client';

import { useState, useEffect, Suspense, useTransition } from 'react';
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
import { Loader2, KeyRound } from 'lucide-react';

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits.')
    .max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const API_BASE_URL = 'https://glatrnp.in/transport/registration';

const verifyOtp = async (
  otp: string,
  userId: string
): Promise<{ success: boolean; userId?: string }> => {
  console.log(`Verifying OTP ${otp} for user ${userId}`);
  // This is a placeholder for the actual API call to verify the OTP
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (otp === '123456') {
    return { success: true, userId: userId };
  }
  return { success: false };
};

function OtpLoginContent({ params }: { params: { userId: string } }) {
  const [isSending, setIsSending] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const { toast } = useToast();
  const userId = params.userId;

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handleSendOtp = async (id: string) => {
    setIsSending(true);
    otpForm.reset();
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`);
      
      const data = await response.json();

      if (response.ok) {
        const email = data.email;
        const atIndex = email.indexOf('@');
        const masked = `${email.substring(0, 3)}***${email.substring(atIndex)}`;
        setMaskedEmail(masked);
        toast({
          title: 'OTP Sent Successfully',
          description: `A 6-digit code has been sent to ${masked}.`,
        });
        setCooldown(30);
      } else {
        throw new Error(data.error || 'Failed to send OTP.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not send OTP. Please check the link and try again.',
      });
      // Redirect or show a specific UI for invalid links
      if (error.message.includes('Invalid or expired link')) {
        setTimeout(() => router.push('/'), 3000);
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (userId) {
      handleSendOtp(userId);
    } else {
       toast({
        variant: 'destructive',
        title: 'Invalid Link',
        description: 'User ID is missing. Please use the link provided.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
    if (!userId) return;
    setIsVerifying(true);
    try {
      // TODO: Replace with actual OTP verification API call
      const result = await verifyOtp(data.otp, userId);
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
    if (cooldown > 0 || isSending || !userId) return;
    handleSendOtp(userId);
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
            {maskedEmail ? `Enter the 6-digit one-time password (OTP) sent to ${maskedEmail}.` : 'Please wait while we send your OTP.'}
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
                          disabled={isSending || !maskedEmail}
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
                disabled={isVerifying || isSending || !maskedEmail}
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
                    disabled={isSending || isVerifying || !maskedEmail}
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

export default function LoginPage({ params }: { params: { userId: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpLoginContent params={params} />
    </Suspense>
  );
}
