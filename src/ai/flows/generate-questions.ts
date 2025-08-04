// This file contains the Genkit flow for generating new quiz questions.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating new quiz questions.
 *
 * - `generateQuestions`: A function that takes a topic and existing questions and returns new questions.
 * - `GenerateQuestionsInput`: The input type for the `generateQuestions` function.
 * - `GenerateQuestionsOutput`: The output type for the `generateQuestions` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Question } from '@/lib/types';

const GenerateQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz questions.'),
  count: z.number().describe('The number of new questions to generate.'),
  existingQuestions: z.string().describe('A JSON string array of existing question texts to avoid generating duplicates.'),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;


const QuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correct_answer: z.string().length(1),
    explanation: z.string(),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of newly generated quiz questions.'),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const questionsPrompt = ai.definePrompt({
  name: 'questionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are an AI assistant that creates quiz questions.

  Generate {{count}} new and unique quiz questions about the topic: {{topic}}.

  The questions should be distinct from the following existing questions:
  {{{existingQuestions}}}

  Each question must have exactly 4 multiple-choice options, labeled A, B, C, and D.
  One of these options must be the correct answer.
  You must also provide a brief explanation for why the answer is correct.

  Return the questions in the specified JSON format. Ensure the 'correct_answer' is only the letter (e.g., "A", "B", "C", or "D").
  The options should be formatted as "A) Answer text", "B) Answer text", etc.
  `,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async input => {
    const { output } = await questionsPrompt(input);
    return output!;
  }
);
