import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FormField as IFormField } from '@/types/form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Grip, Trash, Settings } from 'lucide-react';

interface FormFieldProps {
  field: IFormField;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, index, moveField, onDelete, onEdit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_FIELD',
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'FORM_FIELD',
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  // Initialize drag and drop refs
  drag(dragRef);
  drop(ref);

  // Field renderer based on type
  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return <input type="text" className="w-full px-3 py-2 border rounded-md bg-background" placeholder={field.placeholder || field.label} disabled />;
      case 'textarea':
        return <textarea className="w-full px-3 py-2 border rounded-md bg-background" placeholder={field.placeholder || field.label} rows={3} disabled />;
      case 'email':
        return <input type="email" className="w-full px-3 py-2 border rounded-md bg-background" placeholder={field.placeholder || 'Email'} disabled />;
      case 'date':
        return <input type="date" className="w-full px-3 py-2 border rounded-md bg-background" disabled />;
      case 'phone':
        return <input type="tel" className="w-full px-3 py-2 border rounded-md bg-background" placeholder={field.placeholder || 'Phone number'} disabled />;
      case 'dropdown':
        return (
          <select className="w-full px-3 py-2 border rounded-md bg-background" disabled>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input type="checkbox" id={`${field.id}-${i}`} disabled className="mr-2" />
                <label htmlFor={`${field.id}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input type="radio" name={field.id} id={`${field.id}-${i}`} disabled className="mr-2" />
                <label htmlFor={`${field.id}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'fileUpload':
        return (
          <div className="w-full px-3 py-6 border border-dashed rounded-md bg-background flex flex-col items-center justify-center text-muted-foreground">
            <span className="text-sm">Upload a file</span>
            <input type="file" disabled className="hidden" />
          </div>
        );
      case 'imageUpload':
        return (
          <div className="w-full px-3 py-6 border border-dashed rounded-md bg-background flex flex-col items-center justify-center text-muted-foreground">
            <span className="text-sm">Upload an image</span>
            <input type="file" accept="image/*" disabled className="hidden" />
          </div>
        );
      case 'url':
        return <input type="url" className="w-full px-3 py-2 border rounded-md bg-background" placeholder={field.placeholder || 'Website URL'} disabled />;
      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" disabled className="text-gray-300 hover:text-yellow-400">
                ★
              </button>
            ))}
          </div>
        );
      case 'calculation':
        return (
          <div className="w-full px-3 py-2 border rounded-md bg-muted">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {field.formula ? `Formula: ${field.formula}` : 'No formula set'}
              </span>
              <span className="font-mono text-sm">
                {field.formatting?.type === 'currency' ? '$0.00' : 
                 field.formatting?.type === 'percentage' ? '0%' : '0.00'}
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "border rounded-md p-4 mb-4 bg-card transition-all shadow-sm",
        isDragging && "opacity-50 border-dashed",
        isOver && "border-primary"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div ref={dragRef} className="cursor-move p-1 mr-2 hover:bg-muted rounded">
            <Grip size={16} />
          </div>
          <div className="font-medium flex items-center">
            {field.required && <span className="text-destructive mr-1">*</span>}
            {field.label}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(field.id)}
            className="h-8 w-8"
          >
            <Settings size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(field.id)}
            className="h-8 w-8 text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        {renderFieldPreview()}
      </div>
    </div>
  );
};

export default FormField;
