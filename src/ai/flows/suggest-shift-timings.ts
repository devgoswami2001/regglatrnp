'use server';

/**
 * @fileOverview Suggests shift timings for employees based on their employee ID.
 *
 * - suggestShiftTimings - A function that suggests shift timings.
 * - SuggestShiftTimingsInput - The input type for the suggestShiftTimings function.
 * - SuggestShiftTimingsOutput - The return type for the suggestShiftTimings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShiftTimingsInputSchema = z.object({
  employeeId: z.string().describe('The employee ID of the user.'),
});
export type SuggestShiftTimingsInput = z.infer<typeof SuggestShiftTimingsInputSchema>;

const SuggestShiftTimingsOutputSchema = z.object({
  suggestedShift: z.string().describe('The suggested shift timing for the employee.'),
});
export type SuggestShiftTimingsOutput = z.infer<typeof SuggestShiftTimingsOutputSchema>;

export async function suggestShiftTimings(input: SuggestShiftTimingsInput): Promise<SuggestShiftTimingsOutput> {
  return suggestShiftTimingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShiftTimingsPrompt',
  input: {schema: SuggestShiftTimingsInputSchema},
  output: {schema: SuggestShiftTimingsOutputSchema},
  prompt: `Based on the employee ID {{{employeeId}}}, suggest an appropriate shift timing (Morning, Evening, or Night) for the employee. Consider typical work patterns and logistics when making your suggestion.`,
});

const suggestShiftTimingsFlow = ai.defineFlow(
  {
    name: 'suggestShiftTimingsFlow',
    inputSchema: SuggestShiftTimingsInputSchema,
    outputSchema: SuggestShiftTimingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
