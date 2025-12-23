'use client';

import { useState, useEffect, Suspense } from 'react';
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
      // Maybe show an error or redirect to a 'invalid link' page
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

  const handleSendOtp = async (emailToSend: string) => {
    setIsSending(true);
    const result = await sendOtp(emailToSend);
    setIsSending(false);

    if (result.success) {
      setMaskedEmail(result.maskedEmail);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${result.maskedEmail}`,
      });
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
    if (cooldown > 0 || !email) return;
    await handleSendOtp(email);
  };
  
  if (!userId) {
     return (
       <RegistrationLayout>
         <Card className="w-full">
           <CardHeader>
             <CardTitle>Secure Login</CardTitle>
             <CardDescription>
               Please use the unique login link sent to you.
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
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Preparing your secure login...</p>
          </CardContent>
        </Card>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>One-Time Password</CardTitle>
          <CardDescription>
            {`An OTP has been sent to ${maskedEmail}. Please enter it below.`}
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
                    <FormLabel>Enter Your OTP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="· · · · · ·"
                          {...field}
                          className="pl-10 text-center text-2xl tracking-[0.5em] font-mono"
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
                Verify & Proceed
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
                    Didn't receive the code? Resend OTP
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
