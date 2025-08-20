'use server';

/**
 * @fileOverview A simple text generation AI flow.
 *
 * - generateText - A function that generates text from a given prompt.
 * - GenerateTextInput - The input type for the generateText function.
 * - GenerateTextOutput - The return type for the generateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a response for.'),
});
export type GenerateTextInput = z.infer<typeof GenerateTextInputSchema>;

const GenerateTextOutputSchema = z.object({
  response: z.string().describe('The generated text response.'),
});
export type GenerateTextOutput = z.infer<typeof GenerateTextOutputSchema>;

export async function generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
  return generateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTextPrompt',
  input: {schema: GenerateTextInputSchema},
  output: {schema: GenerateTextOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the following prompt:
{{prompt}}`,
});

const generateTextFlow = ai.defineFlow(
  {
    name: 'generateTextFlow',
    inputSchema: GenerateTextInputSchema,
    outputSchema: GenerateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
