
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { toast } from 'sonner';

interface ShareQuizDialogProps {
  quiz: Quiz;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareQuizDialog: React.FC<ShareQuizDialogProps> = ({ quiz, open, onOpenChange }) => {
  const quizUrl = `${window.location.origin}/quiz/${quiz.shareable_link}`;
  const embedCode = `<iframe src="${quizUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const openQuiz = () => {
    window.open(quizUrl, '_blank', 'noopener,noreferrer');
  };

  if (!quiz.published) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Quiz</DialogTitle>
            <DialogDescription>
              This quiz must be published before it can be shared.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Publish your quiz from the quiz editor to generate a shareable link.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
          <DialogDescription>
            Share your quiz with others using the link or embed code below.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Direct Link</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div>
              <Label htmlFor="quiz-url">Quiz URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="quiz-url"
                  value={quizUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(quizUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openQuiz}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label htmlFor="embed-code">Embed Code</Label>
              <div className="flex gap-2 mt-1">
                <Textarea
                  id="embed-code"
                  value={embedCode}
                  readOnly
                  className="flex-1 h-20 resize-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Copy this code and paste it into your website or blog.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareQuizDialog;
