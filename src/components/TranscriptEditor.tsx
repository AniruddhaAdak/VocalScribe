import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface TranscriptEditorProps {
  transcript: { timestamp: string; text: string }[];
  onSave: (newTranscript: { timestamp: string; text: string }[]) => void;
  onCancel: () => void;
}

const TranscriptEditor = ({ transcript, onSave, onCancel }: TranscriptEditorProps) => {
  const [editedTranscript, setEditedTranscript] = useState([...transcript]);

  const handleTextChange = (index: number, newText: string) => {
    const newTranscript = [...editedTranscript];
    newTranscript[index] = { ...newTranscript[index], text: newText };
    setEditedTranscript(newTranscript);
  };

  const handleSave = () => {
    onSave(editedTranscript);
    toast({
      title: "Changes saved",
      description: "Your transcript has been updated successfully.",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
      {editedTranscript.map((line, index) => (
        <div key={index} className="flex gap-4 items-start">
          <span className="text-sm text-primary min-w-[60px] font-mono mt-2">
            {line.timestamp}
          </span>
          <textarea
            value={line.text}
            onChange={(e) => handleTextChange(index, e.target.value)}
            className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
          />
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TranscriptEditor;