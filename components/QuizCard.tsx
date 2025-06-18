
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Eye, Edit, Trash2, Share, BarChart3, ExternalLink } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { QuizService } from '@/services/QuizService';
import { toast } from 'sonner';
import ShareQuizDialog from '@/components/ShareQuizDialog';

interface QuizCardProps {
  quiz: Quiz;
  onDelete: () => void;
  onStatusChange: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onDelete, onStatusChange }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleTogglePublished = async () => {
    try {
      await QuizService.togglePublished(quiz.id, !quiz.published);
      toast.success(`Quiz ${quiz.published ? 'unpublished' : 'published'} successfully`);
      onStatusChange();
    } catch (error) {
      toast.error('Failed to update quiz status');
      console.error('Error toggling quiz status:', error);
    }
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
              {quiz.description && (
                <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/quizzes/${quiz.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/quizzes/${quiz.id}/responses`}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Responses ({quiz.response_count})
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublished}>
                  <Eye className="mr-2 h-4 w-4" />
                  {quiz.published ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Badge variant={quiz.published ? 'default' : 'secondary'}>
                {quiz.published ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">
                {quiz.fields?.length || 0} questions
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            <p>{quiz.response_count} responses</p>
            <p>Updated {new Date(quiz.updated_at).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/quizzes/${quiz.id}`}>
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </Link>
            </Button>
            {quiz.published && (
              <Button asChild size="sm" variant="ghost">
                <Link 
                  to={`/quiz/${quiz.shareable_link}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ShareQuizDialog
        quiz={quiz}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </>
  );
};

export default QuizCard;
