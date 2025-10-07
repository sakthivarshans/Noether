'use server';
/**
 * @fileOverview A document summarization and highlighting AI agent.
 *
 * - summarizeAndHighlightDocument - A function that handles the document summarization and highlighting process.
 * - SummarizeAndHighlightDocumentInput - The input type for the summarizeAndHighlightDocument function.
 * - SummarizeAndHighlightDocumentOutput - The return type for the summarizeAndHighlightDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAndHighlightDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF or PPTX), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeAndHighlightDocumentInput = z.infer<typeof SummarizeAndHighlightDocumentInputSchema>;

const SummarizeAndHighlightDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document.'),
  highlights: z.array(z.string()).describe('Key topics and important highlights from the document.'),
  flashcards: z.array(z.string()).describe('Generated flashcard questions from the document content.'),
  flowchart: z.string().optional().describe('A flowchart representation of the document content, if possible.'),
});
export type SummarizeAndHighlightDocumentOutput = z.infer<typeof SummarizeAndHighlightDocumentOutputSchema>;

export async function summarizeAndHighlightDocument(input: SummarizeAndHighlightDocumentInput): Promise<SummarizeAndHighlightDocumentOutput> {
  return summarizeAndHighlightDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAndHighlightDocumentPrompt',
  input: {schema: SummarizeAndHighlightDocumentInputSchema},
  output: {schema: SummarizeAndHighlightDocumentOutputSchema},
  prompt: `You are an expert academic assistant. Your goal is to summarize a document and extract key information from it.

You will be provided with the document in the form of a data URI. Generate a summary of the document, highlight the most important topics, and create flashcards to test the user's knowledge.

If the document lends itself to a flowchart representation, create a textual flowchart of the document's main arguments.

Document: {{media url=documentDataUri}}`,
});

const summarizeAndHighlightDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeAndHighlightDocumentFlow',
    inputSchema: SummarizeAndHighlightDocumentInputSchema,
    outputSchema: SummarizeAndHighlightDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
