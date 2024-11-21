import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import AudioWaveform from "@/components/AudioWaveform";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import ProcessingProgress from "@/components/ProcessingProgress";
import { ThemeToggle } from "@/components/ThemeToggle";

const ASSEMBLY_AI_API_KEY = "5b1fd20849da4dd3b981ca0f1a175209";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState([
    { timestamp: "0:00", text: "Click the button to start recording..." },
  ]);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const uploadAudioToAssemblyAI = async (audioBlob: Blob) => {
    try {
      setProcessingProgress(25);
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
        },
        body: audioBlob,
      });

      setProcessingProgress(50);
      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;

      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: audioUrl,
        }),
      });

      setProcessingProgress(75);
      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;

      let result = await checkTranscriptionStatus(transcriptId);
      
      if (result.status === 'completed') {
        setProcessingProgress(100);
        const currentTime = new Date();
        const timestamp = currentTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        setTranscript(prev => [...prev, {
          timestamp,
          text: result.text,
        }]);
      } else {
        setProcessingProgress(0);
        toast({
          variant: "destructive",
          title: "Transcription failed",
          description: "Failed to transcribe the audio. Please try again.",
        });
      }
    } catch (error) {
      setProcessingProgress(0);
      console.error('Error during transcription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the audio. Please try again.",
      });
    }
  };

  const checkTranscriptionStatus = async (transcriptId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of polling attempts
    
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
        },
      });
      
      const result = await response.json();
      
      if (result.status === 'completed' || result.status === 'error') {
        return result;
      }
      
      // Wait for 1 second before next polling attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    throw new Error('Transcription timed out');
  };

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        let chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          chunks = [];
          
          toast({
            title: "Processing audio",
            description: "Your audio is being transcribed...",
          });
          
          await uploadAudioToAssemblyAI(blob);
        };

        mediaRecorder.start(1000); // Collect data every second
        setHasPermission(true);
        setIsRecording(true);
        toast({
          title: "Recording started",
          description: "Your audio is now being recorded.",
        });
      } else {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
        setIsRecording(false);
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
    <div className="min-h-screen bg-background transition-colors duration-300 animate-fade-in">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-slide-in-right">
          <h1 className="text-4xl font-bold text-foreground mb-2">LiveTranscript+</h1>
          <p className="text-lg text-muted-foreground">Real-time audio transcription made beautiful</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 mb-8 animate-scale-in">
          {isRecording && <AudioWaveform />}
          
          {processingProgress > 0 && processingProgress < 100 && (
            <div className="my-4 animate-fade-in">
              <ProcessingProgress progress={processingProgress} />
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            <button
              onClick={toggleRecording}
              className={`${
                isRecording
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              } text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 animate-scale-in`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          {hasPermission === false && (
            <div className="mt-4 text-center text-destructive animate-fade-in">
              Please enable microphone access in your browser settings to use this feature.
            </div>
          )}
        </div>

        <div className="animate-fade-in">
          <TranscriptDisplay lines={transcript} />
        </div>
      </div>
    </div>
  );
};

export default Index;