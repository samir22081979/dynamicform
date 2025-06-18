
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Quiz, QuizField } from '@/types/quiz';
import { Star } from 'lucide-react';

interface QuizPreviewProps {
  quiz: Quiz;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const updateResponse = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderField = (field: QuizField, index: number) => {
    const fieldId = field.id;

    switch (field.type) {
      case 'multiple_choice':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base font-medium">
              {index + 1}. {field.question}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={responses[fieldId] || ''}
              onValueChange={(value) => updateResponse(fieldId, value)}
            >
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldId}-${optionIndex}`} />
                  <Label htmlFor={`${fieldId}-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'true_false':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base font-medium">
              {index + 1}. {field.question}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={responses[fieldId] || ''}
              onValueChange={(value) => updateResponse(fieldId, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id={`${fieldId}-true`} />
                <Label htmlFor={`${fieldId}-true`}>True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id={`${fieldId}-false`} />
                <Label htmlFor={`${fieldId}-false`}>False</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'short_text':
        return (
          <div key={fieldId} className="space-y-3">
            <Label htmlFor={fieldId} className="text-base font-medium">
              {index + 1}. {field.question}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={responses[fieldId] || ''}
              onChange={(e) => updateResponse(fieldId, e.target.value)}
              placeholder="Enter your answer here..."
              rows={3}
            />
          </div>
        );

      case 'rating':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base font-medium">
              {index + 1}. {field.question}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={responses[fieldId] === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateResponse(fieldId, rating)}
                  className="w-10 h-10 p-0"
                >
                  <Star 
                    className={`h-4 w-4 ${
                      responses[fieldId] >= rating ? 'fill-current' : ''
                    }`} 
                  />
                </Button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {responses[fieldId] || 0}/5
              </span>
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={fieldId} className="space-y-3">
            <Label htmlFor={fieldId} className="text-base font-medium">
              {index + 1}. {field.question}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="number"
              value={responses[fieldId] || ''}
              onChange={(e) => updateResponse(fieldId, parseInt(e.target.value) || 0)}
              placeholder="Enter a number..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.description && (
            <CardDescription>{quiz.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.fields?.length > 0 ? (
            <>
              {quiz.fields.map((field, index) => renderField(field, index))}
              <div className="pt-4 border-t">
                <Button className="w-full" disabled>
                  Submit Quiz (Preview Mode)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No questions added yet. Use the Build tab to add questions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;
