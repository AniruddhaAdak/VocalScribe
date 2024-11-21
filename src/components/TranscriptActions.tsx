import { Copy, Download, Share2, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TranscriptActionsProps {
  transcript: { timestamp: string; text: string }[];
  onEdit: () => void;
  onDelete: () => void;
}

const TranscriptActions = ({ transcript, onEdit, onDelete }: TranscriptActionsProps) => {
  const copyToClipboard = async () => {
    const text = transcript.map(line => `${line.timestamp}: ${line.text}`).join('\n');
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transcript copied to clipboard",
    });
  };

  const downloadTranscript = () => {
    const text = transcript.map(line => `${line.timestamp}: ${line.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent("Check out my transcript from LiveTranscript+!");
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="flex gap-2 mt-4 animate-fade-in">
      <Button
        onClick={copyToClipboard}
        className="hover:scale-105 transition-transform font-['Space_Grotesk'] hover:animate-[shake_0.5s_ease-in-out] bg-blue-500 hover:bg-blue-600"
        variant="outline"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      
      <Button
        onClick={downloadTranscript}
        className="hover:scale-105 transition-transform font-['Quicksand'] hover:animate-[shake_0.5s_ease-in-out] bg-green-500 hover:bg-green-600"
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="hover:scale-105 transition-transform font-['Poppins'] hover:animate-[shake_0.5s_ease-in-out] bg-purple-500 hover:bg-purple-600"
            variant="outline"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
            Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={onEdit}
        className="hover:scale-105 transition-transform font-['Righteous'] hover:animate-[shake_0.5s_ease-in-out] bg-amber-500 hover:bg-amber-600"
        variant="outline"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        Edit
      </Button>

      <Button
        onClick={onDelete}
        className="hover:scale-105 transition-transform font-['Space_Grotesk'] hover:animate-[shake_0.5s_ease-in-out] bg-red-500 hover:bg-red-600"
        variant="destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default TranscriptActions;