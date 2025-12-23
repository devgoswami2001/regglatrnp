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
import { findUserById, getStoppageById } from '@/lib/data';
import type { Shift } from '@/lib/types';
import { CheckCircle, User, Clock, MapPin } from 'lucide-react';
import { redirect } from 'next/navigation';

interface ConfirmationPageProps {
  searchParams: {
    userId?: string;
    shift?: Shift;
    stoppageId?: string;
  };
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { userId, shift, stoppageId } = searchParams;

  if (!userId || !shift || !stoppageId) {
    redirect('/');
  }

  const user = findUserById(userId);
  const stoppage = getStoppageById(stoppageId);

  if (!user || !stoppage) {
    redirect('/');
  }

  return (
    <RegistrationLayout>
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl">Registration Complete!</CardTitle>
          <CardDescription>
            Your transport registration has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-6">
            <h3 className="text-center text-lg font-semibold">
              Your Registration Summary
            </h3>
            <div className="space-y-3 text-foreground">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Selected Shift</p>
                  <p className="font-medium">{shift}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Selected Stoppage
                  </p>
                  <p className="font-medium">
                    {stoppage.name} ({stoppage.route})
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for using GLA TransportPass.</p>
            <p>For any assistance, please contact support.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </RegistrationLayout>
  );
}
