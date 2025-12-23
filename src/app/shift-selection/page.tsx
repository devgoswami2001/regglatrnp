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
import { findUserById, getStoppagesByShift } from '@/lib/data';
import type { User, Shift, Stoppage } from '@/lib/types';
import { shifts } from '@/lib/types';
import {
  Clock,
  User as UserIcon,
  Building,
  Hash,
  Loader2,
  MapPin,
  BusFront,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShiftSuggestion from '@/components/ShiftSuggestion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

function ShiftAndStoppageSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [selectedStoppageId, setSelectedStoppageId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      const foundUser = findUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [searchParams, router]);

  useEffect(() => {
    if (selectedShift) {
      const availableStoppages = getStoppagesByShift(selectedShift);
      setStoppages(availableStoppages);
      setSelectedStoppageId(null); // Reset stoppage selection when shift changes
    } else {
      setStoppages([]);
    }
  }, [selectedShift]);

  const handleContinue = () => {
    if (selectedShift && selectedStoppageId && user) {
      router.push(
        `/confirmation?userId=${user.id}&shift=${selectedShift}&stoppageId=${selectedStoppageId}`
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
          <CardTitle>Shift & Stoppage Selection</CardTitle>
          <CardDescription>
            Confirm your details, then select your shift and stoppage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* User Details */}
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

          {/* Shift Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">1. Select Your Shift</h3>
              {user.enrollmentId && (
                <ShiftSuggestion
                  employeeId={user.enrollmentId}
                  onSuggestion={setSelectedShift}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Only one shift can be selected. This will determine available
              stoppages.
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

          {/* Stoppage Selection */}
          {selectedShift && (
            <div className="space-y-4">
              <h3 className="font-semibold">2. Select Your Stoppage</h3>
              <p className="text-sm text-muted-foreground">
                Available stoppages for the{' '}
                <span className="font-semibold text-primary">
                  {selectedShift}
                </span>{' '}
                shift.
              </p>
              <ScrollArea className="h-72 w-full rounded-md border">
                <RadioGroup
                  onValueChange={setSelectedStoppageId}
                  value={selectedStoppageId || ''}
                  className="p-4"
                >
                  {stoppages.length > 0 ? (
                    stoppages.map(stoppage => (
                      <Label
                        key={stoppage.id}
                        htmlFor={stoppage.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/50',
                          selectedStoppageId === stoppage.id &&
                            'border-primary bg-primary/10'
                        )}
                      >
                        <RadioGroupItem value={stoppage.id} id={stoppage.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <MapPin className="h-4 w-4 text-primary" />
                            {stoppage.name}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <BusFront className="h-3 w-3" />
                            {stoppage.route}
                          </div>
                        </div>
                      </Label>
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                      No stoppages available for this shift.
                    </div>
                  )}
                </RadioGroup>
              </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleContinue}
            disabled={!selectedStoppageId}
            className="ml-auto w-full md:w-auto"
          >
            Confirm & Continue
          </Button>
        </CardFooter>
      </Card>
    </RegistrationLayout>
  );
}

export default function ShiftSelectionPage() {
  return (
    <Suspense>
      <ShiftAndStoppageSelectionContent />
    </Suspense>
  );
}
