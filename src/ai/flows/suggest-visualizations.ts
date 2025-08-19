'use server';

/**
 * @fileOverview Suggests suitable visualizations based on the uploaded dataset.
 *
 * - suggestVisualizations - A function that suggests visualizations for a given dataset.
 * - SuggestVisualizationsInput - The input type for the suggestVisualizations function.
 * - SuggestVisualizationsOutput - The return type for the suggestVisualizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVisualizationsInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A detailed description of the uploaded dataset, including column names and data types.'),
});
export type SuggestVisualizationsInput = z.infer<typeof SuggestVisualizationsInputSchema>;

const SuggestVisualizationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested visualization types suitable for the dataset.'),
});
export type SuggestVisualizationsOutput = z.infer<typeof SuggestVisualizationsOutputSchema>;

export async function suggestVisualizations(
  input: SuggestVisualizationsInput
): Promise<SuggestVisualizationsOutput> {
  return suggestVisualizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVisualizationsPrompt',
  input: {schema: SuggestVisualizationsInputSchema},
  output: {schema: SuggestVisualizationsOutputSchema},
  prompt: `You are an expert data visualization consultant. Given a description of a dataset, you will suggest suitable visualization types to explore the data.

Dataset Description: {{{datasetDescription}}}

Suggest at least 3 different visualization types that would be appropriate for this dataset.  Explain why each is suitable.

Your output MUST be a JSON array of strings. Each string should be a visualization type.

Example: [\'bar chart\', \'line graph\', \'scatter plot\']`,
});

const suggestVisualizationsFlow = ai.defineFlow(
  {
    name: 'suggestVisualizationsFlow',
    inputSchema: SuggestVisualizationsInputSchema,
    outputSchema: SuggestVisualizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
