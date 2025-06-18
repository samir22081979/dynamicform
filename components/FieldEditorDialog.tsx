
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/types/form';
import CalculationFieldEditor from '@/components/CalculationFieldEditor';

interface FieldEditorDialogProps {
  field: FormField | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  allFields?: FormField[];
}

const FieldEditorDialog: React.FC<FieldEditorDialogProps> = ({
  field,
  isOpen,
  onClose,
  onSave,
  allFields = [],
}) => {
  const [editedField, setEditedField] = useState<FormField | null>(null);
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (field) {
      const fieldCopy = { ...field };
      setEditedField(fieldCopy);
      setOptionsText((fieldCopy.options || []).join('\n'));
    }
  }, [field]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedField((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleRequiredChange = (checked: boolean) => {
    setEditedField((prev) => prev ? { ...prev, required: checked } : null);
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const options = e.target.value
      .split('\n')
      .map((option) => option.trim())
      .filter((option) => option !== '');
    setOptionsText(e.target.value);
    setEditedField((prev) => prev ? { ...prev, options } : null);
  };

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : undefined;
    setEditedField((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        validation: {
          ...prev.validation,
          [name]: numValue,
        },
      };
    });
  };

  const handleCalculationUpdate = (updatedField: FormField) => {
    setEditedField(updatedField);
  };

  const handleSave = () => {
    if (editedField) {
      onSave({ ...editedField });
    }
    onClose();
  };

  if (!editedField) return null;

  const needsOptions = ['dropdown', 'checkbox', 'radio'].includes(editedField.type);
  const needsValidation = ['text', 'textarea', 'email', 'url', 'phone'].includes(editedField.type);
  const isCalculationField = editedField.type === 'calculation';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {getFieldTypeName(editedField.type)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Field Label</Label>
            <Input
              id="label"
              name="label"
              value={editedField.label}
              onChange={handleInputChange}
              placeholder="Enter field label"
            />
          </div>

          {isCalculationField ? (
            <CalculationFieldEditor
              field={editedField}
              availableFields={allFields}
              onUpdate={handleCalculationUpdate}
            />
          ) : (
            <>
              {(editedField.type !== 'checkbox' && editedField.type !== 'radio') && (
                <div className="grid gap-2">
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    name="placeholder"
                    value={editedField.placeholder || ''}
                    onChange={handleInputChange}
                    placeholder="Enter placeholder text"
                  />
                </div>
              )}

              {needsOptions && (
                <div className="grid gap-2">
                  <Label htmlFor="options">Options (one per line)</Label>
                  <Textarea
                    id="options"
                    value={optionsText}
                    onChange={handleOptionsChange}
                    placeholder="Enter each option on a new line"
                    rows={5}
                  />
                </div>
              )}

              {needsValidation && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      name="minLength"
                      type="number"
                      min={0}
                      value={editedField.validation?.minLength || ''}
                      onChange={handleValidationChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxLength">Maximum Length</Label>
                    <Input
                      id="maxLength"
                      name="maxLength"
                      type="number"
                      min={1}
                      value={editedField.validation?.maxLength || ''}
                      onChange={handleValidationChange}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={editedField.required}
                  onCheckedChange={handleRequiredChange}
                />
                <Label htmlFor="required">Required field</Label>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function getFieldTypeName(type: string): string {
  switch (type) {
    case 'text': return 'Text Field';
    case 'textarea': return 'Text Area';
    case 'email': return 'Email Field';
    case 'dropdown': return 'Dropdown';
    case 'checkbox': return 'Checkbox Group';
    case 'radio': return 'Radio Buttons';
    case 'fileUpload': return 'File Upload';
    case 'imageUpload': return 'Image Upload';
    case 'url': return 'URL Field';
    case 'phone': return 'Phone Field';
    case 'date': return 'Date Field';
    case 'rating': return 'Rating Field';
    case 'calculation': return 'Calculation Field';
    default: return 'Field';
  }
}

export default FieldEditorDialog;
