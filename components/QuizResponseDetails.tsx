
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Star, User } from 'lucide-react';
import { Quiz, QuizResponse } from '@/types/quiz';

interface QuizResponseDetailsProps {
  quiz: Quiz;
  response: QuizResponse;
  onBack: () => void;
}

const QuizResponseDetails: React.FC<QuizResponseDetailsProps> = ({ quiz, response, onBack }) => {
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
      default:
        return 'Unknown answer type';
    }
  };

  const checkAnswer = (field: any, userAnswer: any) => {
    if (field.type === 'short_text') {
      if (!userAnswer || !userAnswer.toString().trim()) return false;
      if (!field.correctAnswer) return true;
      return userAnswer.toString().toLowerCase().trim() === field.correctAnswer.toString().toLowerCase().trim();
    } else if (field.type === 'multiple_choice' || field.type === 'true_false') {
      return userAnswer === field.correctAnswer;
    } else if (field.type === 'rating' || field.type === 'number') {
      return userAnswer === field.correctAnswer;
    }
    return false;
  };

  // Filter out user information fields from quiz questions
  const quizFields = quiz.fields?.filter(field => 
    field.type !== 'user_name' && 
    field.type !== 'user_email' && 
    field.type !== 'user_phone'
  ) || [];

  // Get user information fields
  const userInfoFields = quiz.fields?.filter(field => 
    field.type === 'user_name' || 
    field.type === 'user_email' || 
    field.type === 'user_phone'
  ) || [];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Responses
          </Button>
          <h1 className="text-2xl font-bold">Response Details: {quiz.title}</h1>
          <p className="text-muted-foreground">
            Submitted: {new Date(response.created_at).toLocaleString()}
          </p>
          {response.score_earned !== undefined && response.score !== undefined && (
            <p className="text-muted-foreground">
              Score: {response.score_earned}/{response.score} ({response.score > 0 ? Math.round((response.score_earned / response.score) * 100) : 0}%)
            </p>
          )}
        </div>

        {/* User Information Section */}
        {userInfoFields.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>User Information</CardTitle>
              </div>
              <CardDescription>
                Contact details provided by the quiz taker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userInfoFields.map((field) => {
                  const userAnswer = response.data[field.id];
                  const fieldLabel = field.type === 'user_name' ? 'Name' :
                                    field.type === 'user_email' ? 'Email' :
                                    field.type === 'user_phone' ? 'Phone' : field.question;
                  
                  return (
                    <div key={field.id}>
                      <label className="text-sm font-medium text-muted-foreground">{fieldLabel}:</label>
                      <p className="font-medium">{userAnswer || 'Not provided'}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {quizFields.map((field, index) => {
            const userAnswer = response.data[field.id];
            const isCorrect = checkAnswer(field, userAnswer);

            return (
              <Card key={field.id} className="border-l-4" style={{ 
                borderLeftColor: isCorrect ? '#22c55e' : '#ef4444' 
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{index + 1}. {field.question}</span>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {field.points || 1} point{(field.points || 1) !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Badge variant={isCorrect ? 'default' : 'destructive'}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">User Answer:</h4>
                      <div className="p-3 bg-muted rounded-md">
                        {renderUserAnswer(field, userAnswer)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Correct Answer:</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        {renderCorrectAnswer(field)}
                      </div>
                    </div>
                  </div>
                  
                  {field.explanation && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Explanation:</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm">{field.explanation}</p>
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
            Back to Responses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResponseDetails;
