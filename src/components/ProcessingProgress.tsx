import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  progress: number;
}

const ProcessingProgress = ({ progress }: ProcessingProgressProps) => {
  const getProgressColor = (value: number) => {
    if (value <= 25) return "bg-red-500";
    if (value <= 50) return "bg-yellow-500";
    if (value <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 p-4 sm:p-6 animate-fade-in bg-white/50 backdrop-blur-sm rounded-lg">
      <Progress 
        value={progress} 
        className={`h-3 sm:h-4 transition-all duration-500 ${getProgressColor(progress)}`} 
      />
      <div className="flex justify-between items-center animate-scale-in">
        <p className="text-base sm:text-lg font-['Poppins'] text-foreground dark:text-foreground/90">
          Processing Audio
        </p>
        <span className="text-lg sm:text-xl font-bold text-primary font-['Space_Grotesk']">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProcessingProgress;