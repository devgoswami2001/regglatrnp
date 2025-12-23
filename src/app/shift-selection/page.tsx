'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { RegistrationLayout } from '@/components/RegistrationLayout';
import { findUserById } from '@/lib/data';
import type { User, Shift } from '@/lib/types';
import { shifts } from '@/lib/types';
import {
  Clock,
  User as UserIcon,
  Building,
  Hash,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShiftSuggestion from '@/components/ShiftSuggestion';

function ShiftSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      // In a real app, you'd fetch this from your backend
      const foundUser = findUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        router.push('/'); // User not found, redirect to login
      }
    } else {
      router.push('/'); // No userId, redirect to login
    }
    setLoading(false);
  }, [searchParams, router]);

  const handleContinue = () => {
    if (selectedShift && user) {
      router.push(
        `/stoppage-selection?userId=${user.id}&shift=${selectedShift}`
      );
    }
  };

  if (loading || !user) {
    return (
      <RegistrationLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout>
      <Card>
        <CardHeader>
          <CardTitle>User Details & Shift Selection</CardTitle>
          <CardDescription>
            Confirm your details and select your preferred shift.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Your Details</h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>
                  <span className="font-medium">Name:</span> {user.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <span>
                  <span className="font-medium">Employee ID:</span>{' '}
                  {user.enrollmentId}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2 md:col-span-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>
                  <span className="font-medium">Department:</span>{' '}
                  {user.department}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Select Your Shift</h3>
              {user.enrollmentId && (
                <ShiftSuggestion
                  employeeId={user.enrollmentId}
                  onSuggestion={setSelectedShift}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Only one shift can be selected.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {shifts.map(shift => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition-all duration-200',
                    selectedShift === shift
                      ? 'scale-105 border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  )}
                >
                  <Clock className="mb-2 h-8 w-8" />
                  <span className="font-semibold">{shift}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleContinue}
            disabled={!selectedShift}
            className="ml-auto w-full md:w-auto"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </RegistrationLayout>
  );
}

export default function ShiftSelectionPage() {
  return (
    <Suspense>
      <ShiftSelectionContent />
    </Suspense>
  );
}
