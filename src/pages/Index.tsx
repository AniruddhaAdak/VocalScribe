import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AudioWaveform from "@/components/AudioWaveform";
import TranscriptDisplay from "@/components/TranscriptDisplay";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([
    { timestamp: "0:00", text: "Click the button to start recording..." },
  ]);

  const toggleRecording = () => {
    if (!isRecording) {
      // Request microphone access
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setIsRecording(true);
          toast({
            title: "Recording started",
            description: "Your audio is now being transcribed in real-time.",
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error accessing microphone",
            description: "Please ensure you have granted microphone permissions.",
          });
        });
    } else {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your transcript is ready.",
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
        </div>

        <TranscriptDisplay lines={transcript} />
      </div>
    </div>
  );
};

export default Index;