'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import type { FetchedUser, Shift, Stoppage } from '@/lib/types';
import {
  Clock,
  User as UserIcon,
  Building,
  Hash,
  Loader2,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://glatrnp.in/transport';

async function getMetadata(
  userId: string
): Promise<{ staff: FetchedUser; shifts: Shift[]; locations: Stoppage[] }> {
  const response = await fetch(`${API_BASE_URL}/metadata/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ suggestion_id: userId }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch metadata';
    try {
      const errorData = await response.json();
      if (typeof errorData?.error === 'string') {
        errorMessage = errorData.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

async function submitSelection(
  userId: string,
  shiftId: number,
  locationId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/registration/${userId}/submit/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shift: shiftId, location: locationId }),
      }
    );

    if (response.ok) {
      return { success: true };
    } else {
      let errorMessage = 'An unknown error occurred.';
      try {
        const errorData = await response.json();
        errorMessage =
          typeof errorData.error === 'string'
            ? errorData.error
            : (errorData.shift &&
                Array.isArray(errorData.shift) &&
                errorData.shift[0]) ||
              errorMessage;
      } catch {
        // ignore JSON parse errors
      }
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred during submission.',
    };
  }
}

function ShiftAndStoppageSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [user, setUser] = useState<FetchedUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [selectedStoppageId, setSelectedStoppageId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUserId = searchParams.get('userId');

    if (!currentUserId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User ID is missing.',
      });
      router.push('/');
      return;
    }

    setUserId(currentUserId);

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const {
          staff,
          shifts: fetchedShifts,
          locations: fetchedStoppages,
        } = await getMetadata(currentUserId);

        setUser(staff);
        setShifts(fetchedShifts);
        setStoppages(fetchedStoppages);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error?.message || 'Could not load shift and stoppage data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [searchParams, router, toast]);

  const handleContinue = async () => {
    if (!selectedShiftId || !selectedStoppageId || !userId) {
      return;
    }

    setIsSubmitting(true);

    const result = await submitSelection(
      userId,
      selectedShiftId,
      selectedStoppageId
    );

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Your selection has been submitted successfully.',
      });

      const selectedShift = shifts.find((s) => s.id === selectedShiftId);
      const shiftTime = selectedShift?.time ?? '';

      const confirmationUrl = `/confirmation?userId=${encodeURIComponent(
        userId
      )}&shift=${encodeURIComponent(
        shiftTime
      )}&stoppageId=${encodeURIComponent(String(selectedStoppageId))}`;
      
      router.push(confirmationUrl);
    } else {
      setIsSubmitting(false);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  const handleShiftSelection = (shiftId: number) => {
    setSelectedShiftId(shiftId);
  };

  if (loading || !user) {
    return (
      <RegistrationLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading your details...</p>
        </div>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout>
      <Card>
        <CardHeader>
          <CardTitle>Shift &amp; Stoppage Selection</CardTitle>
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
                  <span className="font-medium">Name:</span> {user.first_name}{' '}
                  {user.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <span>
                  <span className="font-medium">Employee ID:</span>{' '}
                  {user.employee_id}
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
            <h3 className="font-semibold">1. Select Your Shift</h3>
            <p className="text-sm text-muted-foreground">
              Only one shift can be selected.
            </p>
            <RadioGroup
              onValueChange={(value) => handleShiftSelection(parseInt(value))}
              value={selectedShiftId?.toString()}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {shifts.map((shift) => (
                <Label
                  key={shift.id}
                  htmlFor={`shift-${shift.id}`}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition-all duration-200',
                    selectedShiftId === shift.id
                      ? 'scale-105 border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  )}
                >
                  <RadioGroupItem
                    value={shift.id.toString()}
                    id={`shift-${shift.id}`}
                    className="sr-only"
                  />
                  <Clock className="mb-2 h-8 w-8" />
                  <span className="font-semibold">{shift.time}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Stoppage Selection */}
          {shifts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">2. Select Your Stoppage</h3>
              <p className="text-sm text-muted-foreground">
                Please select your desired pickup location.
              </p>
              <ScrollArea className="h-72 w-full rounded-md border">
                <RadioGroup
                  onValueChange={(value) =>
                    setSelectedStoppageId(parseInt(value))
                  }
                  value={selectedStoppageId?.toString()}
                  className="p-4"
                >
                  {stoppages.length > 0 ? (
                    stoppages.map((stoppage) => (
                      <Label
                        key={stoppage.id}
                        htmlFor={`stoppage-${stoppage.id}`}
                        className={cn(
                          'flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/50',
                          selectedStoppageId === stoppage.id &&
                            'border-primary bg-primary/10'
                        )}
                      >
                        <RadioGroupItem
                          value={stoppage.id.toString()}
                          id={`stoppage-${stoppage.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <MapPin className="h-4 w-4 text-primary" />
                            {stoppage.name}
                          </div>
                        </div>
                      </Label>
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                      No stoppages available.
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
            disabled={!selectedShiftId || !selectedStoppageId || isSubmitting}
            className="ml-auto w-full md:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit &amp; Continue
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
