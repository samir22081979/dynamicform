
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Edit, Trash2, Star } from 'lucide-react';
import { QuizField } from '@/types/quiz';
import QuizFieldEditor from '@/components/QuizFieldEditor';
import { useTranslation } from 'react-i18next';
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

interface QuizCanvasProps {
  fields: QuizField[];
  onUpdateField: (index: number, updatedField: QuizField) => void;
  onRemoveField: (index: number) => void;
  onMoveField: (fromIndex: number, toIndex: number) => void;
}

const QuizCanvas: React.FC<QuizCanvasProps> = ({ fields, onUpdateField, onRemoveField, onMoveField }) => {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState<QuizField | null>(null);

  const handleFieldEdit = (field: QuizField) => {
    setEditingField(field);
  };

  const handleFieldUpdate = (updatedField: QuizField) => {
    const fieldIndex = fields.findIndex(f => f.id === updatedField.id);
    if (fieldIndex !== -1) {
      onUpdateField(fieldIndex, updatedField);
    }
    setEditingField(null);
  };

  const renderFieldPreview = (field: QuizField) => {
    if (field.type === 'user_name') {
      return (
        <div className="space-y-2">
          <Input 
            placeholder={field.placeholder || t('common.enterYourFullName')} 
            disabled 
            className="bg-muted"
          />
        </div>
      );
    }

    if (field.type === 'user_email') {
      return (
        <div className="space-y-2">
          <Input 
            type="email"
            placeholder={field.placeholder || t('common.enterYourEmail')} 
            disabled 
            className="bg-muted"
          />
        </div>
      );
    }

    if (field.type === 'user_phone') {
      return (
        <div className="space-y-2">
          <Input 
            type="tel"
            placeholder={field.placeholder || 'Enter your phone number'} 
            disabled 
            className="bg-muted"
          />
        </div>
      );
    }

    if (field.type === 'multiple_choice' && field.options) {
      return (
        <div className="space-y-2">
          {field.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 border rounded-full bg-muted" />
              <span className="text-muted-foreground">{option}</span>
            </div>
          ))}
        </div>
      );
    }

    if (field.type === 'true_false') {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border rounded-full bg-muted" />
            <span className="text-muted-foreground">True</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border rounded-full bg-muted" />
            <span className="text-muted-foreground">False</span>
          </div>
        </div>
      );
    }

    if (field.type === 'short_text') {
      return <Textarea placeholder="Enter your answer" disabled className="bg-muted" />;
    }

    if (field.type === 'rating') {
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Star key={rating} className="h-5 w-5 text-muted-foreground" />
          ))}
        </div>
      );
    }

    if (field.type === 'number') {
      return <Input type="number" placeholder="Enter a number" disabled className="bg-muted" />;
    }

    return null;
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {fields.length === 0 ? (
        <div className="h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{t('common.startBuildingYourQuiz')}</p>
            <p className="text-sm">{t('common.addQuestionsAndUserInformationFields')}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {field.type === 'user_name' ? t('common.userName') :
                         field.type === 'user_email' ? t('common.userEmail') :
                         field.type === 'user_phone' ? 'User Phone' :
                         `${t('common.question')} ${index + 1}`}
                      </Badge>
                      {field.required && <Badge variant="destructive" className="text-xs">{t('common.required')}</Badge>}
                      {field.points && field.points > 0 && (
                        <Badge variant="secondary">{field.points} {t('common.pts')}</Badge>
                      )}
                    </div>
                    <h3 className="font-medium">{field.question}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleFieldEdit(field)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveField(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderFieldPreview(field)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingField && (
        <QuizFieldEditor
          field={editingField}
          onSave={handleFieldUpdate}
          onCancel={() => setEditingField(null)}
        />
      )}
    </div>
  );
};

export default QuizCanvas;
