import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  progress: number;
}

const ProcessingProgress = ({ progress }: ProcessingProgressProps) => {
  const getProgressColor = (value: number) => {
    if (value === 0) return "bg-foreground dark:bg-background";
    if (value <= 25) return "bg-red-500";
    if (value <= 50) return "bg-yellow-500";
    if (value <= 75) return "bg-violet-500";
    return "bg-green-500";
  };

  const getProgressText = (value: number) => {
    if (value === 0) return "Initializing...";
    if (value <= 25) return "Starting audio processing...";
    if (value <= 50) return "Processing audio data...";
    if (value <= 75) return "Analyzing audio content...";
    if (value === 100) return "Processing complete!";
    return "Almost there...";
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 p-4 sm:p-6 animate-fade-in bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
      <Progress 
        value={progress} 
        className={`h-3 sm:h-4 transition-all duration-500 ${getProgressColor(progress)}`} 
      />
      <div className="flex justify-between items-center animate-scale-in">
        <div className="space-y-1">
          <p className="text-base sm:text-lg font-['Poppins'] text-foreground dark:text-foreground/90">
            {getProgressText(progress)}
          </p>
          <p className="text-sm text-muted-foreground">
            Processing your audio file...
          </p>
        </div>
        <span className="text-lg sm:text-xl font-bold text-primary font-['Space_Grotesk']">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProcessingProgress;