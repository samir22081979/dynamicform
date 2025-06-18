
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  List, 
  CheckSquare, 
  Type, 
  Star, 
  Hash,
  HelpCircle,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { QuizField } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';

interface QuizFieldPaletteProps {
  onAddField: (field: QuizField) => void;
}

const QuizFieldPalette: React.FC<QuizFieldPaletteProps> = ({ onAddField }) => {
  const questionTypes = [
    {
      type: 'multiple_choice' as const,
      icon: <List className="h-4 w-4" />,
      label: 'Multiple Choice',
      description: 'Choose one option from a list',
      category: 'question'
    },
    {
      type: 'true_false' as const,
      icon: <CheckSquare className="h-4 w-4" />,
      label: 'True/False',
      description: 'Simple true or false question',
      category: 'question'
    },
    {
      type: 'short_text' as const,
      icon: <Type className="h-4 w-4" />,
      label: 'Short Text',
      description: 'Brief text response',
      category: 'question'
    },
    {
      type: 'rating' as const,
      icon: <Star className="h-4 w-4" />,
      label: 'Rating',
      description: 'Rate from 1 to 5 or 1 to 10',
      category: 'question'
    },
    {
      type: 'number' as const,
      icon: <Hash className="h-4 w-4" />,
      label: 'Number',
      description: 'Numeric answer',
      category: 'question'
    }
  ];

  const userInfoTypes = [
    {
      type: 'user_name' as const,
      icon: <User className="h-4 w-4" />,
      label: 'Full Name',
      description: 'Collect user\'s full name',
      category: 'user_info'
    },
    {
      type: 'user_email' as const,
      icon: <Mail className="h-4 w-4" />,
      label: 'Email Address',
      description: 'Collect user\'s email',
      category: 'user_info'
    },
    {
      type: 'user_phone' as const,
      icon: <Phone className="h-4 w-4" />,
      label: 'Phone Number',
      description: 'Collect user\'s phone number',
      category: 'user_info'
    }
  ];

  const handleAddField = (type: QuizField['type']) => {
    const baseField: QuizField = {
      id: uuidv4(),
      type,
      question: getDefaultQuestion(type),
      required: type.startsWith('user_') ? true : false,
      points: type.startsWith('user_') ? 0 : 1
    };

    if (type === 'multiple_choice') {
      baseField.options = ['Option 1', 'Option 2', 'Option 3'];
      baseField.correctAnswer = 'Option 1';
    } else if (type === 'true_false') {
      baseField.options = ['True', 'False'];
      baseField.correctAnswer = 'True';
    } else if (type === 'rating') {
      baseField.correctAnswer = 5;
    } else if (type === 'number') {
      baseField.correctAnswer = 0;
    } else if (type === 'user_name') {
      baseField.placeholder = 'Enter your full name';
    } else if (type === 'user_email') {
      baseField.placeholder = 'Enter your email address';
    } else if (type === 'user_phone') {
      baseField.placeholder = 'Enter your phone number';
    } else {
      baseField.correctAnswer = '';
    }

    onAddField(baseField);
  };

  const getDefaultQuestion = (type: QuizField['type']): string => {
    switch (type) {
      case 'user_name': return 'What is your full name?';
      case 'user_email': return 'What is your email address?';
      case 'user_phone': return 'What is your phone number?';
      default: return `New ${type.replace('_', ' ')} question`;
    }
  };

  return (
    <div className="w-80 bg-background border-r p-4 overflow-y-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Question Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {questionTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => handleAddField(fieldType.type)}
            >
              <div className="flex items-start gap-3">
                {fieldType.icon}
                <div className="text-left">
                  <div className="font-medium">{fieldType.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {fieldType.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {userInfoTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => handleAddField(fieldType.type)}
            >
              <div className="flex items-start gap-3">
                {fieldType.icon}
                <div className="text-left">
                  <div className="font-medium">{fieldType.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {fieldType.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizFieldPalette;
