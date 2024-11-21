import { Button } from "@/components/ui/button";

interface RecordingControlsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

const RecordingControls = ({ isRecording, onToggleRecording }: RecordingControlsProps) => {
  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={onToggleRecording}
        className={`${
          isRecording
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        } text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 animate-scale-in`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};

export default RecordingControls;