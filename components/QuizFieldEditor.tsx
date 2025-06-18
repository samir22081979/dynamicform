
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { QuizField } from '@/types/quiz';
import { Plus, Trash2 } from 'lucide-react';

interface QuizFieldEditorProps {
  field: QuizField;
  onSave: (field: QuizField) => void;
  onCancel: () => void;
}

const QuizFieldEditor: React.FC<QuizFieldEditorProps> = ({ field, onSave, onCancel }) => {
  const [editedField, setEditedField] = useState<QuizField>({ ...field });

  const handleSave = () => {
    onSave(editedField);
  };

  const addOption = () => {
    if (editedField.options) {
      setEditedField({
        ...editedField,
        options: [...editedField.options, 'New Option']
      });
    }
  };

  const removeOption = (index: number) => {
    if (editedField.options) {
      const newOptions = editedField.options.filter((_, i) => i !== index);
      setEditedField({
        ...editedField,
        options: newOptions,
        correctAnswer: editedField.correctAnswer === editedField.options[index] ? '' : editedField.correctAnswer
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (editedField.options) {
      const newOptions = [...editedField.options];
      const oldValue = newOptions[index];
      newOptions[index] = value;
      
      setEditedField({
        ...editedField,
        options: newOptions,
        correctAnswer: editedField.correctAnswer === oldValue ? value : editedField.correctAnswer
      });
    }
  };

  const isUserInfoField = editedField.type.startsWith('user_');

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {isUserInfoField ? 'User Information Field' : 'Question'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="question">
              {isUserInfoField ? 'Field Label' : 'Question'}
            </Label>
            <Input
              id="question"
              value={editedField.question}
              onChange={(e) => setEditedField({ ...editedField, question: e.target.value })}
              placeholder={isUserInfoField ? 'Enter field label' : 'Enter your question'}
            />
          </div>

          {isUserInfoField && (
            <div>
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={editedField.placeholder || ''}
                onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={editedField.required}
              onCheckedChange={(checked) => setEditedField({ ...editedField, required: checked })}
            />
            <Label htmlFor="required">Required field</Label>
          </div>

          {!isUserInfoField && (
            <>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  max="100"
                  value={editedField.points || 1}
                  onChange={(e) => setEditedField({ ...editedField, points: parseInt(e.target.value) || 1 })}
                />
              </div>

              {(editedField.type === 'multiple_choice' || editedField.type === 'true_false') && editedField.options && (
                <div>
                  <Label>Answer Options</Label>
                  <div className="space-y-2 mt-2">
                    {editedField.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={editedField.correctAnswer === option}
                          onChange={() => setEditedField({ ...editedField, correctAnswer: option })}
                        />
                        <Label className="text-sm">Correct</Label>
                        {editedField.type === 'multiple_choice' && editedField.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {editedField.type === 'multiple_choice' && (
                      <Button variant="outline" onClick={addOption} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {(editedField.type === 'short_text' || editedField.type === 'number' || editedField.type === 'rating') && (
                <div>
                  <Label htmlFor="correctAnswer">Correct Answer (Optional)</Label>
                  {editedField.type === 'rating' ? (
                    <Input
                      id="correctAnswer"
                      type="number"
                      min="1"
                      max="5"
                      value={editedField.correctAnswer || ''}
                      onChange={(e) => setEditedField({ ...editedField, correctAnswer: parseInt(e.target.value) || 0 })}
                      placeholder="Expected rating (1-5)"
                    />
                  ) : editedField.type === 'number' ? (
                    <Input
                      id="correctAnswer"
                      type="number"
                      value={editedField.correctAnswer || ''}
                      onChange={(e) => setEditedField({ ...editedField, correctAnswer: parseInt(e.target.value) || 0 })}
                      placeholder="Expected number"
                    />
                  ) : (
                    <Input
                      id="correctAnswer"
                      value={editedField.correctAnswer || ''}
                      onChange={(e) => setEditedField({ ...editedField, correctAnswer: e.target.value })}
                      placeholder="Expected text answer"
                    />
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={editedField.explanation || ''}
                  onChange={(e) => setEditedField({ ...editedField, explanation: e.target.value })}
                  placeholder="Explain the correct answer (shown after submission)"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizFieldEditor;
