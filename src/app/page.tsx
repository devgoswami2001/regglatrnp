'use client';

import { Suspense } from 'react';
import { RegistrationLayout } from '@/components/RegistrationLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <Suspense>
      <RegistrationLayout>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>GLA TransportPass</CardTitle>
            <CardDescription>
              Please use the unique login link sent to you to begin the registration process.
            </CardDescription>
          </CardHeader>
        </Card>
      </RegistrationLayout>
    </Suspense>
  );
}
