
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star, User } from 'lucide-react';
import { Quiz, QuizResult } from '@/types/quiz';

interface QuizResultsProps {
  quiz: Quiz;
  result: QuizResult;
  responses: Record<string, any>;
  onReview: () => void;
  onRetakeQuiz?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, result, responses, onReview, onRetakeQuiz }) => {
  const resultIcon = result.passed ? (
    <CheckCircle className="h-8 w-8 text-green-600" />
  ) : (
    <XCircle className="h-8 w-8 text-red-600" />
  );

  const resultColor = result.passed ? 'text-green-600' : 'text-red-600';
  const bgColor = result.passed ? 'bg-green-100' : 'bg-red-100';

  // Get user information fields
  const userInfoFields = quiz.fields?.filter(field => 
    field.type === 'user_name' || field.type === 'user_email' || field.type === 'user_phone'
  ) || [];

  const renderUserInfo = (field: any, userAnswer: any) => {
    return userAnswer || 'Not provided';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}>
            {resultIcon}
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <CardDescription>
            {result.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <div className="text-3xl font-bold mb-2">
              {result.scoreEarned}/{result.totalPoints}
            </div>
            <div className={`text-lg ${resultColor} font-semibold`}>
              {result.percentage.toFixed(1)}% Score
            </div>
            <div className={`text-sm mt-2 ${resultColor}`}>
              {result.passed ? '✅ Passed' : '❌ Failed'}
            </div>
          </div>

          {/* User Information Section */}
          {userInfoFields.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-left">
                  {userInfoFields.map((field) => (
                    <div key={field.id} className="flex justify-between items-center">
                      <span className="font-medium text-sm">{field.question}:</span>
                      <span className="text-sm text-muted-foreground">
                        {renderUserInfo(field, responses[field.id])}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={onReview} variant="outline">
              Review Answers
            </Button>
            {onRetakeQuiz && (
              <Button onClick={onRetakeQuiz}>
                Retake Quiz
              </Button>
            )}
          </div>

          <p className="text-muted-foreground">
            Your responses have been recorded successfully.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
