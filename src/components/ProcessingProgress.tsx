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
    <div className="w-full max-w-md mx-auto space-y-2">
      <Progress value={progress} className={`h-2 ${getProgressColor(progress)}`} />
      <p className="text-sm text-center text-muted-foreground">{progress}% Complete</p>
    </div>
  );
};

export default ProcessingProgress;