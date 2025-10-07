import { config } from 'dotenv';
config();

import '@/ai/flows/generate-answers-for-pyq.ts';
import '@/ai/flows/generate-flashcards-from-document.ts';
import '@/ai/flows/enhanced-topic-search.ts';
import '@/ai/flows/summarize-and-highlight-document.ts';