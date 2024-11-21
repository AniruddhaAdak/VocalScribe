interface TranscriptLine {
  timestamp: string;
  text: string;
}

interface TranscriptDisplayProps {
  lines: TranscriptLine[];
}

const TranscriptDisplay = ({ lines }: TranscriptDisplayProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
      {lines.map((line, index) => (
        <div key={index} className="flex gap-4">
          <span className="text-sm text-gray-500 min-w-[60px]">{line.timestamp}</span>
          <p className="text-gray-800">{line.text}</p>
        </div>
      ))}
    </div>
  );
};

export default TranscriptDisplay;