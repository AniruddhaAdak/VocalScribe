import { useState } from 'react';
import TranscriptEditor from './TranscriptEditor';
import TranscriptItem from './TranscriptItem';

interface TranscriptLine {
  timestamp: string;
  text: string;
}

interface TranscriptDisplayProps {
  lines: TranscriptLine[];
  onUpdate?: (newLines: TranscriptLine[]) => void;
}

const TranscriptDisplay = ({ lines, onUpdate }: TranscriptDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newTranscript: TranscriptLine[]) => {
    if (onUpdate) {
      onUpdate(newTranscript);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TranscriptEditor
        transcript={lines}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-4 transition-all duration-300 hover:shadow-xl animate-scale-in">
      {lines.map((line, index) => (
        <TranscriptItem
          key={index}
          timestamp={line.timestamp}
          text={line.text}
        />
      ))}
    </div>
  );
};

export default TranscriptDisplay;