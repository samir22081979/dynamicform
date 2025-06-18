import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Props {
  shareUrl: string;
  formId: string;
  children: React.ReactElement;
}

const ShareFormDialog: React.FC<Props> = ({ shareUrl, formId, children }) => {
  const directLink = `${shareUrl}/submit/${formId}`;
  const iframeEmbed = `<iframe src="${directLink}" width="100%" height="1600" frameborder="0"></iframe>`;
  const scriptEmbed = `<div id="form-${formId}"></div>
<script>
(function() {
  var formContainer = document.getElementById("form-${formId}");
  var iframe = document.createElement("iframe");
  iframe.src = "${directLink}";
  iframe.width = "100%";
  iframe.height = "600";
  iframe.frameBorder = "0";
  formContainer.appendChild(iframe);
})();
</script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Form</DialogTitle>
          <p className="text-sm text-muted-foreground">Use these options to share your form</p>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="link">Direct Link</TabsTrigger>
            <TabsTrigger value="iframe">Embed (iframe)</TabsTrigger>
            <TabsTrigger value="script">Embed (script)</TabsTrigger>
          </TabsList>

          <TabsContent value="link">
            <Input value={directLink} readOnly />
            <Button onClick={() => copyToClipboard(directLink)} className="mt-2 w-full">
              Copy Link
            </Button>
          </TabsContent>

          <TabsContent value="iframe">
            <textarea
              readOnly
              className="w-full h-28 text-sm rounded-md border p-2"
              value={iframeEmbed}
            />
            <Button onClick={() => copyToClipboard(iframeEmbed)} className="mt-2 w-full">
              Copy Embed Code
            </Button>
          </TabsContent>

          <TabsContent value="script">
            <textarea
              readOnly
              className="w-full h-36 text-sm rounded-md border p-2"
              value={scriptEmbed}
            />
            <Button onClick={() => copyToClipboard(scriptEmbed)} className="mt-2 w-full">
              Copy Script
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFormDialog;
