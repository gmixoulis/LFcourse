'use server';

import { generateHint } from '@/ai/flows/generate-hint';
import { generateQuestions } from '@/ai/flows/generate-questions';
import type { Question } from '@/lib/types';

export async function getAIHint(question: string): Promise<string> {
  try {
    const result = await generateHint({ question });
    if (result.isHelpful) {
      return result.hint;
    } else {
      return "I couldn't generate a helpful hint for this question. Try your best!";
    }
  } catch (error) {
    console.error('Error generating hint:', error);
    return 'Sorry, an error occurred while generating the hint.';
  }
}

export async function getNewQuestions(
  topic: string,
  existingQuestions: Question[]
): Promise<Question[]> {
  const result = await generateQuestions({
    topic,
    count: 5,
    existingQuestions: JSON.stringify(existingQuestions.map((q) => q.question)),
  });
  return result.questions;
}
