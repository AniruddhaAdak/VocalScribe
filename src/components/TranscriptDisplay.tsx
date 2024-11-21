interface TranscriptLine {
  timestamp: string;
  text: string;
}

interface TranscriptDisplayProps {
  lines: TranscriptLine[];
}

const TranscriptDisplay = ({ lines }: TranscriptDisplayProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-6 space-y-4 transition-colors duration-300 animate-fade-in">
      {lines.map((line, index) => (
        <div 
          key={index} 
          className="flex gap-4 hover:bg-accent/10 p-2 rounded-lg transition-colors duration-200 animate-scale-in"
        >
          <span className="text-sm text-primary min-w-[60px] font-mono">{line.timestamp}</span>
          <p className="text-foreground dark:text-foreground/90">{line.text}</p>
        </div>
      ))}
    </div>
  );
};

export default TranscriptDisplay;