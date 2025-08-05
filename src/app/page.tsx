import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question, QuizData } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';
import QuizClient from './quizz-client';

// Remove the shuffle function from here

async function getQuizData(): Promise<{
  title: string;
  questions: Question[];
}> {
  const filePath = path.join(
    process.cwd(),
    'src',
    'data',
    'quizzes',
    'blockchain.json'
  );
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const quizData: QuizData = JSON.parse(fileContent);

    // Assuming the first key in the JSON file is the quiz
    const quizKey = Object.keys(quizData)[0];
    if (!quizKey || !Array.isArray(quizData[quizKey])) {
      throw new Error('Invalid JSON format');
    }
    let questions = quizData[quizKey];

    // Remove the shuffling logic from here

    // Format the title from the key
    const title = quizKey
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { title, questions };
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    // Return empty state to be handled by the page component
    return { title: 'Quiz Not Found', questions: [] };
  }
}

export default async function Home() {
  const { title, questions } = await getQuizData();

  if (!questions || questions.length === 0) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-background p-8'>
        <Card className='w-full max-w-2xl'>
          <CardHeader>
            <CardTitle>Error Loading Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Could not load the quiz data. Please ensure
              'src/data/quizzes/blockchain.json' exists and is correctly
              formatted.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8'>
      <QuizClient title={title} initialQuestions={questions} />
    </main>
  );
}
