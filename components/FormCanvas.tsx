import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { FormField as IFormField, FieldType } from '@/types/form';
import FormField from '@/components/FormField';
import FieldEditorDialog from '@/components/FieldEditorDialog';
import { cn } from '@/lib/utils';

interface FormCanvasProps {
  fields: IFormField[];
  onFieldUpdate: (field: IFormField) => void;
  onFieldRemove: (fieldId: string) => void;
  onFieldMove: (dragIndex: number, hoverIndex: number) => void;
  onFieldAdd: (type: FieldType) => void; // Add this prop to handle field addition
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  onFieldUpdate,
  onFieldRemove,
  onFieldMove,
  onFieldAdd,
}) => {
  const [editingField, setEditingField] = useState<IFormField | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['FIELD_TYPE', 'FORM_FIELD'],
    drop: (item: { type: FieldType }) => {
      if (item.type) {
        // Call the onFieldAdd function when a field is dropped
        onFieldAdd(item.type);
      }
      return { name: 'FormCanvas' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleFieldEdit = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      setEditingField(field);
      setIsEditorOpen(true);
    }
  };

  const handleFieldUpdate = (updatedField: IFormField) => {
    onFieldUpdate(updatedField);
    setEditingField(null);
    setIsEditorOpen(false);
  };

  return (
    <>
      <Card
        ref={drop}
        className={cn(
          "min-h-[400px] border rounded-md transition-colors",
          isOver && canDrop ? "border-dashed border-primary bg-primary/5" : "",
          !fields.length ? "flex items-center justify-center border-dashed" : ""
        )}
      >
        <CardContent className={cn("p-6", !fields.length ? "flex flex-col items-center" : "")}>
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">Drag and drop form elements here</p>
              <p className="text-xs text-muted-foreground">or select from the toolbox</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <FormField
                key={field.id}
                field={field}
                index={index}
                moveField={onFieldMove}
                onDelete={onFieldRemove}
                onEdit={handleFieldEdit}
              />
            ))
          )}
        </CardContent>
      </Card>

      <FieldEditorDialog
        field={editingField}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleFieldUpdate}
        allFields={fields}
      />
    </>
  );
};

export default FormCanvas;
