import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AudioWaveform from "@/components/AudioWaveform";
import TranscriptDisplay from "@/components/TranscriptDisplay";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState([
    { timestamp: "0:00", text: "Click the button to start recording..." },
  ]);

  useEffect(() => {
    // Check for existing permissions when component mounts
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch((err) => {
        setHasPermission(false);
        console.error("Initial permission check failed:", err);
      });
  }, []);

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        setIsRecording(true);
        toast({
          title: "Recording started",
          description: "Your audio is now being transcribed in real-time.",
        });
      } else {
        setIsRecording(false);
        toast({
          title: "Recording stopped",
          description: "Your transcript is ready.",
        });
      }
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setHasPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please enable microphone access in your browser settings and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LiveTranscript+</h1>
          <p className="text-lg text-gray-600">Real-time audio transcription made beautiful</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {isRecording && <AudioWaveform />}
          
          <div className="flex justify-center mt-4">
            <Button
              onClick={toggleRecording}
              className={`${
                isRecording
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              } text-white font-semibold py-2 px-6 rounded-full transition-all duration-200`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>

          {hasPermission === false && (
            <div className="mt-4 text-center text-red-500">
              Please enable microphone access in your browser settings to use this feature.
            </div>
          )}
        </div>

        <TranscriptDisplay lines={transcript} />
      </div>
    </div>
  );
};

export default Index;