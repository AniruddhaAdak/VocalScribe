import AudioWaveform from "@/components/AudioWaveform";
import FileUpload from "@/components/FileUpload";
import ProcessingProgress from "@/components/ProcessingProgress";
import RecordingControls from "@/components/RecordingControls";

interface RecordingInterfaceProps {
  isRecording: boolean;
  processingProgress: number;
  onToggleRecording: () => void;
  onFileSelected: (file: File) => void;
  hasPermission: boolean | null;
}

const RecordingInterface = ({
  isRecording,
  processingProgress,
  onToggleRecording,
  onFileSelected,
  hasPermission,
}: RecordingInterfaceProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 animate-scale-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isRecording && <AudioWaveform />}
        <FileUpload onFileSelected={onFileSelected} />
      </div>
      
      {processingProgress > 0 && processingProgress < 100 && (
        <div className="my-4 animate-fade-in">
          <ProcessingProgress progress={processingProgress} />
        </div>
      )}
      
      <RecordingControls 
        isRecording={isRecording} 
        onToggleRecording={onToggleRecording}
      />

      {hasPermission === false && (
        <div className="mt-4 text-center text-destructive animate-fade-in">
          Please enable microphone access in your browser settings to use this feature.
        </div>
      )}
    </div>
  );
};

export default RecordingInterface;