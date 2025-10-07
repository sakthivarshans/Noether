'use server';
/**
 * @fileOverview A flashcard generation AI agent.
 *
 * - generateFlashcardsFromDocument - A function that handles the flashcard generation process.
 * - GenerateFlashcardsFromDocumentInput - The input type for the generateFlashcardsFromDocument function.
 * - GenerateFlashcardsFromDocumentOutput - The return type for the generateFlashcardsFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsFromDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to generate flashcards from.'),
});
export type GenerateFlashcardsFromDocumentInput = z.infer<
  typeof GenerateFlashcardsFromDocumentInputSchema
>;

const GenerateFlashcardsFromDocumentOutputSchema = z.object({
  flashcards: z
    .array(z.object({front: z.string(), back: z.string()}))
    .describe('An array of flashcards generated from the document.'),
});
export type GenerateFlashcardsFromDocumentOutput = z.infer<
  typeof GenerateFlashcardsFromDocumentOutputSchema
>;

export async function generateFlashcardsFromDocument(
  input: GenerateFlashcardsFromDocumentInput
): Promise<GenerateFlashcardsFromDocumentOutput> {
  return generateFlashcardsFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsFromDocumentPrompt',
  input: {schema: GenerateFlashcardsFromDocumentInputSchema},
  output: {schema: GenerateFlashcardsFromDocumentOutputSchema},
  prompt: `You are an expert educator. Your task is to generate flashcards from a document to help students learn.

Document Content: {{{documentContent}}}

Generate a list of flashcards. Each flashcard should have a front and a back. The front should be a question or topic, and the back should be the answer or explanation.  Generate at least 5 flashcards.

Output in JSON format:
{
  "flashcards": [
    { "front": "Question 1", "back": "Answer 1" },
    { "front": "Question 2", "back": "Answer 2" },
    ...
  ]
}`,
});

const generateFlashcardsFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromDocumentFlow',
    inputSchema: GenerateFlashcardsFromDocumentInputSchema,
    outputSchema: GenerateFlashcardsFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
