
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
import type { FetchedUser } from '@/lib/types';
import { CheckCircle, User, Clock, MapPin } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Stoppage } from '@/lib/types';

interface ConfirmationPageProps {
  searchParams: {
    userId?: string;
    shift?: string;
    stoppageId?: string;
  };
}

// These functions will be replaced by API calls in a real application
const findUserById = async (id: string): Promise<FetchedUser | null> => {
  try {
    const response = await fetch('https://glatrnp.in/transport/metadata/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ suggestion_id: id }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.staff;
  } catch (error) {
    return null;
  }
};

const getStoppageById = async (stoppageId: string, userId: string): Promise<Stoppage | undefined> => {
  try {
     const response = await fetch('https://glatrnp.in/transport/metadata/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ suggestion_id: userId }),
    });
    if (!response.ok) return undefined;
    const data = await response.json();
    return data.locations.find((s: Stoppage) => s.id.toString() === stoppageId);
  } catch (error) {
    return undefined;
  }
 
};

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { userId, shift, stoppageId } = searchParams;

  if (!userId || !shift || !stoppageId) {
    redirect('/');
  }

  const user = await findUserById(userId);
  const stoppage = await getStoppageById(stoppageId, userId);

  if (!user) {
    redirect('/');
  }

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
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-6">
            <h3 className="text-center text-lg font-semibold">
              Your Selection Summary
            </h3>
            <div className="space-y-3 text-foreground">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
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
                    {stoppage ? stoppage.name : `ID: ${stoppageId}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>You will receive further steps over the email.</p>
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

