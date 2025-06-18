
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Quiz } from '@/types/quiz';

interface QuizSettingsPanelProps {
  quiz: Partial<Quiz>;
  onUpdate: (updates: Partial<Quiz>) => void;
}

const QuizSettingsPanel: React.FC<QuizSettingsPanelProps> = ({ quiz, onUpdate }) => {
  const updateField = (field: keyof Quiz, value: any) => {
    onUpdate({ [field]: value });
  };

  const updateSettings = (field: string, value: any) => {
    onUpdate({
      settings: {
        ...quiz.settings,
        [field]: value
      }
    });
  };

  const calculateTotalPoints = () => {
    return quiz.fields?.reduce((total, field) => {
      // Only count points for question fields, not user info fields
      if (field.type.startsWith('user_')) return total;
      return total + (field.points || 1);
    }, 0) || 0;
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription>Basic information about your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={quiz.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={quiz.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>Control who can access your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="require-access-code"
              checked={quiz.settings?.requireAccessCode || false}
              onCheckedChange={(checked) => updateSettings('requireAccessCode', checked)}
            />
            <Label htmlFor="require-access-code">Require access code</Label>
          </div>
          
          {quiz.settings?.requireAccessCode && (
            <div>
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="text"
                value={quiz.settings?.accessCode || ''}
                onChange={(e) => updateSettings('accessCode', e.target.value)}
                placeholder="Enter access code"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Users will need to enter this code to access the quiz
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring & Grading</CardTitle>
          <CardDescription>Configure how your quiz is scored and graded</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total-points">Total Points</Label>
              <Input
                id="total-points"
                type="number"
                value={calculateTotalPoints()}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Calculated from individual question points
              </p>
            </div>
            <div>
              <Label htmlFor="passing-score">Passing Score (%)</Label>
              <Input
                id="passing-score"
                type="number"
                min="0"
                max="100"
                value={quiz.passing_score_percent || 70}
                onChange={(e) => updateField('passing_score_percent', parseInt(e.target.value) || 70)}
                placeholder="70"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="pass-message">Pass Message</Label>
            <Textarea
              id="pass-message"
              value={quiz.pass_message || 'Congratulations! You passed!'}
              onChange={(e) => updateField('pass_message', e.target.value)}
              placeholder="Message shown when user passes"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="fail-message">Fail Message</Label>
            <Textarea
              id="fail-message"
              value={quiz.fail_message || 'Sorry, please try again.'}
              onChange={(e) => updateField('fail_message', e.target.value)}
              placeholder="Message shown when user fails"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Limit</CardTitle>
          <CardDescription>Set an optional time limit for your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-timer"
              checked={!!quiz.time_limit_minutes}
              onCheckedChange={(checked) => 
                updateField('time_limit_minutes', checked ? 30 : null)
              }
            />
            <Label htmlFor="enable-timer">Enable time limit</Label>
          </div>
          
          {quiz.time_limit_minutes !== null && quiz.time_limit_minutes !== undefined && (
            <div>
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input
                id="time-limit"
                type="number"
                min="1"
                max="180"
                value={quiz.time_limit_minutes || 30}
                onChange={(e) => updateField('time_limit_minutes', parseInt(e.target.value) || 30)}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Quiz will auto-submit when time expires
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizSettingsPanel;
