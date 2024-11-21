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
        className={`
          ${isRecording 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-gradient-to-r from-primary to-purple-600 hover:opacity-90'
          } 
          text-white font-['Quicksand'] font-semibold py-2 px-6 
          rounded-full transition-all duration-300 
          animate-scale-in hover:scale-105 
          shadow-lg hover:shadow-xl
        `}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};

export default RecordingControls;