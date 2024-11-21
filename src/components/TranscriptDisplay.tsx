interface TranscriptLine {
  timestamp: string;
  text: string;
}

interface TranscriptDisplayProps {
  lines: TranscriptLine[];
}

const TranscriptDisplay = ({ lines }: TranscriptDisplayProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-4 transition-all duration-300 hover:shadow-xl animate-scale-in">
      {lines.map((line, index) => (
        <div 
          key={index} 
          className="flex gap-4 hover:bg-primary/5 p-2 rounded-lg transition-all duration-200 animate-fade-in font-['Space_Grotesk']"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="text-sm text-primary min-w-[60px] font-mono">{line.timestamp}</span>
          <p className="text-foreground dark:text-foreground/90">{line.text}</p>
        </div>
      ))}
    </div>
  );
};

export default TranscriptDisplay;