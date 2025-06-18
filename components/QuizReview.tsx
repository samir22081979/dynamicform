
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Star, User } from 'lucide-react';
import { Quiz, QuizResult } from '@/types/quiz';

interface QuizReviewProps {
  quiz: Quiz;
  result: QuizResult;
  responses: Record<string, any>;
  onBack: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ quiz, result, responses, onBack }) => {
  const renderUserAnswer = (field: any, userAnswer: any) => {
    switch (field.type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer || 'No answer selected';
      case 'short_text':
        return userAnswer || 'No answer provided';
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {userAnswer ? (
              <>
                {Array.from({ length: userAnswer }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                ))}
                <span className="ml-2">{userAnswer}/5</span>
              </>
            ) : (
              'No rating given'
            )}
          </div>
        );
      case 'number':
        return userAnswer?.toString() || 'No answer provided';
      case 'user_name':
      case 'user_email':
      case 'user_phone':
        return userAnswer || 'No information provided';
      default:
        return 'Unknown answer type';
    }
  };

  const renderCorrectAnswer = (field: any) => {
    switch (field.type) {
      case 'multiple_choice':
      case 'true_false':
        return field.correctAnswer || 'No correct answer set';
      case 'short_text':
        return field.correctAnswer || 'Any valid answer accepted';
      case 'rating':
        return field.correctAnswer ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: field.correctAnswer }, (_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
            ))}
            <span className="ml-2">{field.correctAnswer}/5</span>
          </div>
        ) : 'Any rating accepted';
      case 'number':
        return field.correctAnswer?.toString() || 'Any number accepted';
      case 'user_name':
      case 'user_email':
      case 'user_phone':
        return 'User information field';
      default:
        return 'Unknown answer type';
    }
  };

  // Separate user information fields from quiz questions
  const userInfoFields = quiz.fields?.filter(field => 
    field.type === 'user_name' || field.type === 'user_email' || field.type === 'user_phone'
  ) || [];

  const quizFields = quiz.fields?.filter(field => 
    field.type !== 'user_name' && field.type !== 'user_email' && field.type !== 'user_phone'
  ) || [];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <h1 className="text-2xl font-bold">Quiz Review: {quiz.title}</h1>
          <p className="text-muted-foreground">
            Your score: {result.scoreEarned}/{result.totalPoints} ({result.percentage.toFixed(1)}%)
          </p>
        </div>

        {/* User Information Section */}
        {userInfoFields.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                User Information
              </CardTitle>
              <CardDescription>
                Information provided by the quiz taker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userInfoFields.map((field) => (
                  <div key={field.id}>
                    <h4 className="font-semibold text-sm mb-2">{field.question}:</h4>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      {renderUserAnswer(field, responses[field.id])}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz Questions Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quiz Questions</h2>
          {quizFields.map((field, index) => {
            const questionResult = result.questionResults?.find(qr => qr.questionId === field.id);
            if (!questionResult) return null;

            return (
              <Card key={field.id} className="border-l-4" style={{ 
                borderLeftColor: questionResult.isCorrect ? '#22c55e' : '#ef4444' 
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{index + 1}. {field.question}</span>
                        {questionResult.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {questionResult.points} point{questionResult.points !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Badge variant={questionResult.isCorrect ? 'default' : 'destructive'}>
                      {questionResult.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Your Answer:</h4>
                      <div className="p-3 bg-muted rounded-md">
                        {renderUserAnswer(field, questionResult.userAnswer)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Correct Answer:</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        {renderCorrectAnswer(field)}
                      </div>
                    </div>
                  </div>
                  
                  {questionResult.explanation && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Explanation:</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm">{questionResult.explanation}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={onBack}>
            Back to Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
