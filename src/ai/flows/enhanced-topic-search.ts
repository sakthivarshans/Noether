'use server';

/**
 * @fileOverview Implements a flow for enhanced topic search using GenAI.
 *
 * - enhancedTopicSearch - A function that takes a topic as input and returns a summary of the top search results.
 * - EnhancedTopicSearchInput - The input type for the enhancedTopicSearch function.
 * - EnhancedTopicSearchOutput - The return type for the enhancedTopicSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancedTopicSearchInputSchema = z.object({
  topic: z.string().describe('The topic to search for.'),
});
export type EnhancedTopicSearchInput = z.infer<typeof EnhancedTopicSearchInputSchema>;

const EnhancedTopicSearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the top search results for the topic.'),
});
export type EnhancedTopicSearchOutput = z.infer<typeof EnhancedTopicSearchOutputSchema>;

export async function enhancedTopicSearch(input: EnhancedTopicSearchInput): Promise<EnhancedTopicSearchOutput> {
  return enhancedTopicSearchFlow(input);
}

const enhancedTopicSearchPrompt = ai.definePrompt({
  name: 'enhancedTopicSearchPrompt',
  input: {schema: EnhancedTopicSearchInputSchema},
  output: {schema: EnhancedTopicSearchOutputSchema},
  prompt: `Summarize the top search results for the topic "{{topic}}". Provide a concise and informative summary.
`,
});

const enhancedTopicSearchFlow = ai.defineFlow(
  {
    name: 'enhancedTopicSearchFlow',
    inputSchema: EnhancedTopicSearchInputSchema,
    outputSchema: EnhancedTopicSearchOutputSchema,
  },
  async input => {
    const {output} = await enhancedTopicSearchPrompt(input);
    return output!;
  }
);
