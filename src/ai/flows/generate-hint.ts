// This file contains the Genkit flow for generating hints for questions.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hints for quiz questions.
 *
 * - `generateHint`: A function that takes a question as input and returns a hint.
 * - `GenerateHintInput`: The input type for the `generateHint` function.
 * - `GenerateHintOutput`: The output type for the `generateHint` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateHintInputSchema = z.object({
  question: z.string().describe('The question to generate a hint for.'),
});
export type GenerateHintInput = z.infer<typeof GenerateHintInputSchema>;

const GenerateHintOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the question.'),
  isHelpful: z
    .boolean()
    .describe(
      'A flag indicating whether the hint is relevant to the question.'
    ),
});
export type GenerateHintOutput = z.infer<typeof GenerateHintOutputSchema>;

export async function generateHint(
  input: GenerateHintInput
): Promise<GenerateHintOutput> {
  return generateHintFlow(input);
}

const hintPrompt = ai.definePrompt({
  name: 'hintPrompt',
  input: { schema: GenerateHintInputSchema },
  output: { schema: GenerateHintOutputSchema },
  prompt: `You are an AI assistant designed to provide hints for quiz questions.

  Given the following question, generate a concise and helpful hint that guides the user towards the answer without giving it away directly. Also, determine if the generated hint is actually helpful and relevant to the question.

  Question: {{{question}}}
  `,
});

const generateHintFlow = ai.defineFlow(
  {
    name: 'generateHintFlow',
    inputSchema: GenerateHintInputSchema,
    outputSchema: GenerateHintOutputSchema,
  },
  async (input) => {
    const { output } = await hintPrompt(input);
    return output!;
  }
);
