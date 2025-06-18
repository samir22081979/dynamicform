
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FieldType } from '@/types/form';
import FieldTypeItem from '@/components/FieldTypeItem';
import { 
  Text, 
  Type, // Using Type icon as TextArea isn't available
  CheckSquare, 
  List, 
  Calendar, 
  Mail, 
  Phone, 
  Link, 
  File, 
  Image, 
  Star,
  Calculator
} from 'lucide-react';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  // Define available field types
  const fieldTypes = [
    { type: 'text' as FieldType, label: 'Text Field', icon: <Text size={18} /> },
    { type: 'textarea' as FieldType, label: 'Text Area', icon: <Type size={18} /> },
    { type: 'checkbox' as FieldType, label: 'Checkbox', icon: <CheckSquare size={18} /> },
    { type: 'dropdown' as FieldType, label: 'Dropdown', icon: <List size={18} /> },
    { type: 'date' as FieldType, label: 'Date', icon: <Calendar size={18} /> },
    { type: 'email' as FieldType, label: 'Email', icon: <Mail size={18} /> },
    { type: 'phone' as FieldType, label: 'Phone', icon: <Phone size={18} /> },
    { type: 'url' as FieldType, label: 'URL', icon: <Link size={18} /> },
    { type: 'fileUpload' as FieldType, label: 'File Upload', icon: <File size={18} /> },
    { type: 'imageUpload' as FieldType, label: 'Image', icon: <Image size={18} /> },
    { type: 'rating' as FieldType, label: 'Rating', icon: <Star size={18} /> },
    { type: 'calculation' as FieldType, label: 'Calculation', icon: <Calculator size={18} /> },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4">
        <h3 className="text-lg font-medium">Form Elements</h3>
        <p className="text-sm text-blue-100">Drag and drop or click to add</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {fieldTypes.map((fieldType) => (
            <div 
              key={fieldType.type}
              className="cursor-pointer hover:bg-accent rounded-md transition-colors"
              onClick={() => onAddField(fieldType.type)}
            >
              <FieldTypeItem
                type={fieldType.type}
                label={fieldType.label}
                icon={fieldType.icon}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldPalette;
