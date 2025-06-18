
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Eye, Trash, Upload, EyeOff, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Form } from '@/types/form';
import { formatDistanceToNow } from 'date-fns';
import { FormService } from '@/services/FormService';
import ShareFormDialog from '@/components/ShareFormDialog';

interface FormCardProps {
  form: Form;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, onDelete, onStatusChange }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const fullLink = window.location.origin;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(form.id);
  };

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      await FormService.updateForm({
        ...form,
        published: !form.published,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Form ${form.published ? 'unpublished' : 'published'} successfully`);
      onStatusChange?.();
    } catch (error) {
      toast.error('Failed to update publish status');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatCreatedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown creation date';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{form.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {form.description || 'No description'}
            </CardDescription>
          </div>
          <Badge variant={form.published ? 'default' : 'outline'}>
            {form.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span>Created {formatCreatedDate(form.createdAt)}</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Responses</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {form.responseCount}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/forms/${form.id}`}>
            <Edit size={14} className="mr-1" />
            Edit
          </Link>
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link to={`/forms/${form.id}/responses`}>
            <Eye size={14} className="mr-1" />
            View Responses
          </Link>
        </Button>

        {form.published ? (
          <ShareFormDialog shareUrl={fullLink} formId={form.shareableLink}>
            <Button variant="outline" size="sm">
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
          </ShareFormDialog>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <Share2 size={14} className="mr-1" />
            Share
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleTogglePublish}
          disabled={isPublishing}
        >
          {form.published ? (
            <>
              <EyeOff size={14} className="mr-1" />
              Unpublish
            </>
          ) : (
            <>
              <Upload size={14} className="mr-1" />
              Publish
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="ml-auto text-destructive hover:bg-destructive/10"
        >
          <Trash size={14} className="mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormCard;
