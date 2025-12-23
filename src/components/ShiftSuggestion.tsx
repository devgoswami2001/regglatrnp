'use client';

import { useState } from 'react';
import { suggestShiftTimings } from '@/ai/flows/suggest-shift-timings';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShiftSuggestionProps {
  employeeId: string;
  onSuggestion: (shiftTime: string) => void;
}

export default function ShiftSuggestion({
  employeeId,
  onSuggestion,
}: ShiftSuggestionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestion = async () => {
    setIsLoading(true);
    try {
      const result = await suggestShiftTimings({ employeeId });
      const suggestedShift = result.suggestedShift; // This is a string like "Morning", "Evening"
      
      if (suggestedShift) {
        onSuggestion(suggestedShift);
        toast({
          title: 'AI Suggestion',
          description: `We've selected a shift for you based on our analysis.`,
        });
      } else {
        throw new Error('Invalid shift suggestion received.');
      }
    } catch (error) {
      console.error('Error getting shift suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get an AI suggestion at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSuggestion}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
      )}
      Get AI Suggestion
    </Button>
  );
}
