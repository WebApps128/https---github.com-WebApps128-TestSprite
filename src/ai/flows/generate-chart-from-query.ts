// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI chart generation from natural language queries.
 *
 * - generateChartFromQuery - A function that generates a chart based on a natural language query and a dataset.
 * - GenerateChartFromQueryInput - The input type for the generateChartFromQuery function.
 * - GenerateChartFromQueryOutput - The return type for the generateChartFromQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChartFromQueryInputSchema = z.object({
  dataset: z
    .string()
    .describe('The dataset to analyze, in CSV or JSON format.'),
  query: z.string().describe('The natural language query to use for chart generation.'),
});
export type GenerateChartFromQueryInput = z.infer<typeof GenerateChartFromQueryInputSchema>;

const GenerateChartFromQueryOutputSchema = z.object({
  chartData: z.string().describe('The chart data in a format suitable for rendering (e.g., JSON).'),
  chartType: z.string().describe('The type of chart to render (e.g., bar, line, pie).'),
  chartDescription: z.string().describe('A description of the chart that was generated.'),
});
export type GenerateChartFromQueryOutput = z.infer<typeof GenerateChartFromQueryOutputSchema>;

export async function generateChartFromQuery(input: GenerateChartFromQueryInput): Promise<GenerateChartFromQueryOutput> {
  return generateChartFromQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChartFromQueryPrompt',
  input: {schema: GenerateChartFromQueryInputSchema},
  output: {schema: GenerateChartFromQueryOutputSchema},
  prompt: `You are an AI data visualization expert.  A user has provided a dataset and a query.  Your job is to generate a chart based on the query and the dataset.

Dataset:
{{dataset}}

Query:
{{query}}

You should respond with a JSON object that contains the chartData, chartType, and chartDescription.
`,
});

const generateChartFromQueryFlow = ai.defineFlow(
  {
    name: 'generateChartFromQueryFlow',
    inputSchema: GenerateChartFromQueryInputSchema,
    outputSchema: GenerateChartFromQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
