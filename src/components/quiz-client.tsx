'use client';

import { getAIHint, getNewQuestions } from '@/app/actions';
import type { Question } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface QuizClientProps {
  title: string;
  initialQuestions: Question[];
}

export default function QuizClient({
  title,
  initialQuestions,
}: QuizClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [isHintLoading, startHintTransition] = useTransition();
  const [isGeneratingQuestions, startNewQuestionsTransition] = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer;

  // Effect to handle state reset when the question changes
  useEffect(() => {
    if (!quizCompleted) {
      const timer = setTimeout(
        () => {
          setSelectedAnswer(null);
          setShowExplanation(false);
          setHint(null);
        },
        isAnimating ? 300 : 0
      );
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, isAnimating, quizCompleted]);

  // Effect to check for quiz completion
  useEffect(() => {
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleNavigation = (direction: 'next' | 'back') => {
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === 'next' && currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (direction === 'back' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const handleAnswerSelect = (option: string) => {
    if (showExplanation) return;
    const answerLetter = option.charAt(0);
    setSelectedAnswer(answerLetter);
    setShowExplanation(true);
    if (answerLetter === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleGetHint = () => {
    setHint(null);
    startHintTransition(async () => {
      const hintText = await getAIHint(currentQuestion.question);
      setHint(hintText);
    });
  };

  const handleGenerateNewQuestions = () => {
    startNewQuestionsTransition(async () => {
      try {
        const newQuestions = await getNewQuestions(title, questions);
        if (newQuestions && newQuestions.length > 0) {
          setQuestions((prev) => [...prev, ...newQuestions]);
          setQuizCompleted(false);
          // The next question will be the one after the current last question
          setCurrentQuestionIndex(questions.length);
        } else {
          toast({
            variant: 'destructive',
            title: 'Failed to generate questions',
            description:
              'The AI could not generate new questions. Please try again.',
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: 'Something went wrong while generating new questions.',
        });
      }
    });
  };

  const getOptionLetter = (option: string) => option.charAt(0);

  const getOptionStyling = (option: string) => {
    const optionLetter = getOptionLetter(option);

    if (!showExplanation) {
      return selectedAnswer === optionLetter
        ? 'bg-secondary border-primary'
        : 'hover:bg-secondary/80 border-border';
    }

    const isCorrectAnswer = optionLetter === currentQuestion.correct_answer;
    const isSelectedAnswer = optionLetter === selectedAnswer;

    if (isCorrectAnswer) {
      return 'bg-primary/10 border-primary text-primary font-bold';
    }
    if (isSelectedAnswer && !isCorrect) {
      return 'bg-destructive/10 border-destructive text-destructive font-bold';
    }

    return 'bg-muted/50 text-muted-foreground cursor-not-allowed border-border';
  };

  if (quizCompleted) {
    return (
      <Card className='w-full max-w-3xl shadow-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl md:text-4xl font-bold font-headline text-primary'>
            Quiz Completed!
          </CardTitle>
          <CardDescription className='pt-2 text-lg'>
            You scored {score} out of {questions.length} questions.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center p-8'>
          <p className='text-2xl font-bold mb-4'>Great Job!</p>
          <Button
            onClick={handleGenerateNewQuestions}
            disabled={isGeneratingQuestions}
          >
            {isGeneratingQuestions ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 h-4 w-4' />
            )}
            Generate More Questions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'w-full max-w-3xl shadow-2xl transition-opacity duration-300 ease-in-out',
        isAnimating ? 'opacity-0' : 'opacity-100'
      )}
    >
      <CardHeader className='text-center border-b pb-4'>
        <CardTitle className='text-3xl md:text-4xl font-bold font-headline text-primary'>
          {title}
        </CardTitle>
        <CardDescription className='pt-2'>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className='w-full mt-2'
        />
      </CardHeader>

      {currentQuestion && (
        <>
          <CardContent className='space-y-6 p-4 sm:p-8'>
            <p className='text-xl text-center font-medium font-body h-24 flex items-center justify-center'>
              {currentQuestion.question}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant='outline'
                  className={cn(
                    'h-auto justify-start p-4 text-left whitespace-normal transition-all duration-300 border-2',
                    getOptionStyling(option)
                  )}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showExplanation}
                >
                  <span className='font-bold mr-4'>
                    {getOptionLetter(option)}.
                  </span>
                  <span>{option.substring(3)}</span>
                </Button>
              ))}
            </div>

            {showExplanation && (
              <Alert
                className={cn(
                  'transition-opacity duration-500',
                  isCorrect ? 'border-primary' : 'border-destructive'
                )}
              >
                <AlertTitle
                  className={cn(
                    'font-bold',
                    isCorrect ? 'text-primary' : 'text-destructive'
                  )}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect.'}
                </AlertTitle>
                <AlertDescription className='pt-1'>
                  {currentQuestion.explanation}
                </AlertDescription>
              </Alert>
            )}

            <div className='flex justify-center pt-2'>
              <Button
                onClick={handleGetHint}
                disabled={isHintLoading || showExplanation}
                variant='ghost'
                size='sm'
              >
                {isHintLoading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Lightbulb className='mr-2 h-4 w-4 text-primary' />
                )}
                Get a Hint
              </Button>
            </div>

            {hint && (
              <Alert variant='default' className='mt-4 border-accent/50'>
                <Lightbulb className='h-4 w-4 text-accent' />
                <AlertTitle>Hint</AlertTitle>
                <AlertDescription>{hint}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className='flex justify-between p-4 sm:p-6 bg-muted/50 border-t'>
            <Button
              onClick={() => handleNavigation('back')}
              disabled={currentQuestionIndex === 0 || isAnimating}
              variant='outline'
            >
              <ArrowLeft className='mr-2 h-4 w-4' /> Back
            </Button>
            <Button
              onClick={() => handleNavigation('next')}
              disabled={isAnimating}
            >
              {currentQuestionIndex === questions.length - 1
                ? 'Finish'
                : 'Next'}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
