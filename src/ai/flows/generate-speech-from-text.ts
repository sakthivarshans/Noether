'use server';
/**
 * @fileOverview Implements a flow for converting text to speech.
 *
 * - generateSpeechFromText - A function that takes text and returns a data URI for the audio.
 * - GenerateSpeechFromTextInput - The input type for the function.
 * - GenerateSpeechFromTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const GenerateSpeechFromTextInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateSpeechFromTextInput = z.infer<typeof GenerateSpeechFromTextInputSchema>;

const GenerateSpeechFromTextOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateSpeechFromTextOutput = z.infer<typeof GenerateSpeechFromTextOutputSchema>;

export async function generateSpeechFromText(input: GenerateSpeechFromTextInput): Promise<GenerateSpeechFromTextOutput> {
  return generateSpeechFromTextFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateSpeechFromTextFlow = ai.defineFlow(
  {
    name: 'generateSpeechFromTextFlow',
    inputSchema: GenerateSpeechFromTextInputSchema,
    outputSchema: GenerateSpeechFromTextOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
            },
        },
        prompt: text,
    });
    if (!media) {
      throw new Error('No audio was generated from the text.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
