
import { RegistrationLayout } from '@/components/RegistrationLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <RegistrationLayout>
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-primary" />
          <CardTitle className="text-2xl">Request Received!</CardTitle>
          <CardDescription>
            Your interest in availing the transport facility has been recorded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>You will receive further steps over the email shortly.</p>
            <p className="mt-2 font-medium text-foreground">Thank you for your submission!</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </RegistrationLayout>
  );
}
