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
import { getStoppagesByShift } from '@/lib/data';
import type { Stoppage, Shift } from '@/lib/types';
import { shifts } from '@/lib/types';
import { MapPin, BusFront, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function StoppageSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [selectedStoppageId, setSelectedStoppageId] = useState<string | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const shiftParam = searchParams.get('shift') as Shift;

    if (userIdParam && shiftParam && shifts.includes(shiftParam)) {
      setUserId(userIdParam);
      setShift(shiftParam);
      const availableStoppages = getStoppagesByShift(shiftParam);
      setStoppages(availableStoppages);
    } else {
      router.push('/'); // Invalid params, redirect to login
    }
    setLoading(false);
  }, [searchParams, router]);

  const handleConfirm = () => {
    if (selectedStoppageId && userId && shift) {
      router.push(
        `/confirmation?userId=${userId}&shift=${shift}&stoppageId=${selectedStoppageId}`
      );
    }
  };

  if (loading) {
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
          <CardTitle>Route & Stoppage Selection</CardTitle>
          <CardDescription>
            Select your preferred stoppage for the{' '}
            <span className="font-semibold text-primary">{shift}</span> shift.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            You can only select one stoppage.
          </p>
          <ScrollArea className="h-72 w-full rounded-md border">
            <RadioGroup
              onValueChange={setSelectedStoppageId}
              value={selectedStoppageId || ''}
              className="p-4"
            >
              {stoppages.map(stoppage => (
                <Label
                  key={stoppage.id}
                  htmlFor={stoppage.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/50',
                    selectedStoppageId === stoppage.id && 'border-primary bg-primary/10'
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
              ))}
            </RadioGroup>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.back()} variant="outline">
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedStoppageId}
            className="w-auto"
          >
            Confirm Selection
          </Button>
        </CardFooter>
      </Card>
    </RegistrationLayout>
  );
}

export default function StoppageSelectionPage() {
  return (
    <Suspense>
      <StoppageSelectionContent />
    </Suspense>
  );
}
