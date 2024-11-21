import { Button } from "@/components/ui/button";

interface RecordingControlsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

const RecordingControls = ({ isRecording, onToggleRecording }: RecordingControlsProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onToggleRecording}
        className={`
          ${isRecording 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-gradient-to-r from-primary to-purple-600'
          } 
          text-white font-['Quicksand'] font-semibold py-4 px-8
          rounded-full transition-all duration-300 
          hover:scale-110 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]
          active:scale-95
          text-lg min-w-[200px]
          dark:shadow-[0_0_15px_rgba(124,58,237,0.3)]
        `}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};

export default RecordingControls;