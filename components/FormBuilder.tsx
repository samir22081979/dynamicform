import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import { Form, FormField, FieldType } from '@/types/form';
import FormCanvas from '@/components/FormCanvas';
import FieldPalette from '@/components/FieldPalette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { ArrowLeft, Settings, Share, Eye, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormBuilder: React.FC<{ initialForm?: Form; onSave: (form: Form) => void }> = ({ initialForm, onSave }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const Backend = isMobile ? TouchBackend : HTML5Backend;

  const [form, setForm] = useState<Form>(
    initialForm || {
      id: `form_${Math.random().toString(36).substring(2, 9)}`,
      userId: 'current-user',
      title: 'Untitled Form',
      description: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      shareableLink: `form_${Math.random().toString(36).substring(2, 9)}`,
      responseCount: 0,
    }
  );

  const [activeTab, setActiveTab] = useState("builder");

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Math.random().toString(36).substring(2, 9)}`,
      type,
      label: getDefaultLabelForType(type),
      required: false,
      placeholder: getDefaultPlaceholderForType(type),
      options: ['Option 1', 'Option 2', 'Option 3'],
      // Add calculation-specific defaults
      ...(type === 'calculation' && {
        formula: '',
        dependsOn: [],
        readOnly: true,
        formatting: {
          type: 'decimal',
          precision: 2,
        },
      }),
    };

    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
      updatedAt: new Date().toISOString(),
    }));

    toast.success(`Added new ${type} field`);
  };

  const handleUpdateField = (updatedField: FormField) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.filter((field) => field.id !== fieldId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleMoveField = (dragIndex: number, hoverIndex: number) => {
    const dragField = form.fields[dragIndex];
    const newFields = [...form.fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    setForm((prevForm) => ({
      ...prevForm,
      fields: newFields,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleFormPropertyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSaveForm = () => {
    if (!form.title.trim()) {
      toast.error('Please add a title to your form');
      return;
    }
    onSave(form);
    toast.success('Form saved successfully');
  };

  const handleShare = () => {
    if (!form.published) {
      toast.error('Please publish your form before sharing');
      return;
    }
    navigator.clipboard.writeText(`${window.location.origin}/form/${form.shareableLink}`);
    toast.success('Share link copied to clipboard');
  };

  const handlePreview = () => {
    setActiveTab(activeTab === "builder" ? "preview" : "builder");
  };

  const handleSettings = () => {
    toast.info('Settings panel will be implemented in a future update');
  };

  const renderPreview = () => (
    <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
      {form.description && <p className="text-muted-foreground mb-6">{form.description}</p>}
      {form.fields.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No fields added yet</p>
      ) : (
        <div className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="font-medium flex items-center">
                {field.required && <span className="text-red-500 mr-1">*</span>}
                {field.label}
              </label>
              {renderPreviewField(field)}
            </div>
          ))}
          <Button className="w-full">Submit</Button>
        </div>
      )}
    </div>
  );

  const renderPreviewField = (field: FormField) => {
    switch (field.type) {
      case 'text': return <Input placeholder={field.placeholder || field.label} />;
      case 'textarea': return <Textarea placeholder={field.placeholder || field.label} rows={3} />;
      case 'email': return <Input type="email" placeholder={field.placeholder || 'Email'} />;
      case 'dropdown': return (
        <select className="w-full px-3 py-2 border rounded-md bg-background">
          <option value="">{field.placeholder || 'Select an option'}</option>
          {field.options?.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      );
      case 'checkbox': return (
        <div className="space-y-2">
          {field.options?.map((option, i) => (
            <div key={i} className="flex items-center">
              <input type="checkbox" id={`${field.id}-${i}`} className="mr-2" />
              <label htmlFor={`${field.id}-${i}`}>{option}</label>
            </div>
          ))}
        </div>
      );
      case 'calculation':
        return (
          <div className="w-full px-3 py-2 border rounded-md bg-muted">
            <span className="text-sm text-muted-foreground">Calculated value will appear here</span>
          </div>
        );
      default: return <Input placeholder={`${field.type} field`} />;
    }
  };

  return (
    <DndProvider backend={Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/forms')} className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Form Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSettings}><Settings className="h-4 w-4 mr-2" />Settings</Button>
            <Button variant="outline" size="sm" onClick={handleShare}><Share className="h-4 w-4 mr-2" />Share</Button>
            <Button variant="outline" size="sm" onClick={handlePreview}><Eye className="h-4 w-4 mr-2" />Preview</Button>
            <Button variant="default" size="sm" onClick={handleSaveForm}><Save className="h-4 w-4 mr-2" />Save</Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="space-y-6">
            <Card className="p-6 shadow-sm">
              <div className="space-y-4">
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleFormPropertyChange}
                  placeholder="Enter form title"
                  className="text-xl font-medium border-none px-0 shadow-none focus-visible:ring-0"
                />
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormPropertyChange}
                  placeholder="Form Description (optional)"
                  rows={1}
                  className="resize-none border-none px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </Card>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-3/4">
                <FormCanvas
                  fields={form.fields}
                  onFieldUpdate={handleUpdateField}
                  onFieldRemove={handleRemoveField}
                  onFieldMove={handleMoveField}
                  onFieldAdd={handleAddField}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <div className="lg:sticky lg:top-4">
                  <FieldPalette onAddField={handleAddField} />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
};

function getDefaultLabelForType(type: FieldType): string {
  switch (type) {
    case 'text': return 'Text Question';
    case 'textarea': return 'Text Area Question';
    case 'email': return 'Email Address';
    case 'dropdown': return 'Dropdown Question';
    case 'checkbox': return 'Checkbox Question';
    case 'radio': return 'Multiple Choice';
    case 'fileUpload': return 'File Upload';
    case 'imageUpload': return 'Image Upload';
    case 'url': return 'Website URL';
    case 'phone': return 'Phone Number';
    case 'date': return 'Date';
    case 'rating': return 'Rating';
    case 'calculation': return 'Calculated Result';
    default: return 'New Question';
  }
}

function getDefaultPlaceholderForType(type: FieldType): string {
  switch (type) {
    case 'text': return 'Enter your answer';
    case 'textarea': return 'Enter your detailed answer';
    case 'email': return 'name@example.com';
    case 'dropdown': return 'Select an option';
    case 'url': return 'https://example.com';
    case 'phone': return '+1 (555) 000-0000';
    default: return '';
  }
}

export default FormBuilder;
