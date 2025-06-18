
import React, { useState, useEffect } from 'react';
import { FormField } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeCalculator } from '@/utils/calculationUtils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface CalculationFieldEditorProps {
  field: FormField;
  availableFields: FormField[];
  onUpdate: (field: FormField) => void;
}

const CalculationFieldEditor: React.FC<CalculationFieldEditorProps> = ({
  field,
  availableFields,
  onUpdate,
}) => {
  const [formula, setFormula] = useState(field.formula || '');
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const [previewResult, setPreviewResult] = useState<string>('');

  // Filter out calculation fields and the current field from available fields
  const numericFields = availableFields.filter(f => 
    f.id !== field.id && 
    ['text', 'email', 'phone', 'rating'].includes(f.type)
  );

  useEffect(() => {
    const validationResult = SafeCalculator.validateFormula(formula);
    setValidation(validationResult);

    if (validationResult.isValid && formula) {
      const dependencies = SafeCalculator.extractDependencies(formula);
      
      // Update field dependencies
      onUpdate({
        ...field,
        formula,
        dependsOn: dependencies,
        readOnly: true,
      });

      // Generate preview with sample values
      const sampleValues: Record<string, any> = {};
      dependencies.forEach(dep => {
        const depField = numericFields.find(f => f.label.toLowerCase().replace(/\s+/g, '') === dep.toLowerCase());
        if (depField) {
          sampleValues[dep] = '100'; // Sample value for preview
        }
      });

      const result = SafeCalculator.calculateValue(formula, sampleValues);
      if (result.result !== null) {
        const formatted = SafeCalculator.formatResult(result.result, field.formatting);
        setPreviewResult(`Preview: ${formatted}`);
      } else {
        setPreviewResult('Preview: Enter field values to see result');
      }
    } else {
      setPreviewResult('');
    }
  }, [formula, field, numericFields, onUpdate]);

  const handleFormulaChange = (value: string) => {
    setFormula(value);
  };

  const handleFormattingChange = (key: string, value: any) => {
    onUpdate({
      ...field,
      formatting: {
        ...field.formatting,
        [key]: value,
      },
    });
  };

  const insertFieldReference = (fieldLabel: string) => {
    const fieldName = fieldLabel.toLowerCase().replace(/\s+/g, '');
    setFormula(prev => prev + `{${fieldName}}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="formula">Formula</Label>
        <Textarea
          id="formula"
          value={formula}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Enter formula, e.g., {loanAmount} * {interestRate} / 100"
          rows={3}
          className={validation.isValid ? '' : 'border-destructive'}
        />
        {!validation.isValid && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle size={16} />
            {validation.error}
          </div>
        )}
        {validation.isValid && previewResult && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} />
            {previewResult}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Available Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {numericFields.map((availableField) => (
              <button
                key={availableField.id}
                type="button"
                onClick={() => insertFieldReference(availableField.label)}
                className="text-left p-2 border rounded hover:bg-accent text-sm"
              >
                {availableField.label}
              </button>
            ))}
            {numericFields.length === 0 && (
              <p className="text-muted-foreground text-sm col-span-2">
                No numeric fields available. Add text, email, phone, or rating fields first.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="formatType">Format Type</Label>
          <Select
            value={field.formatting?.type || 'decimal'}
            onValueChange={(value) => handleFormattingChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decimal">Decimal</SelectItem>
              <SelectItem value="currency">Currency</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="precision">Decimal Places</Label>
          <Input
            id="precision"
            type="number"
            min={0}
            max={10}
            value={field.formatting?.precision || 2}
            onChange={(e) => handleFormattingChange('precision', parseInt(e.target.value) || 2)}
          />
        </div>
      </div>

      {field.formatting?.type === 'currency' && (
        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={field.formatting?.currency || 'USD'}
            onValueChange={(value) => handleFormattingChange('currency', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CNY">CNY (¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CalculationFieldEditor;
