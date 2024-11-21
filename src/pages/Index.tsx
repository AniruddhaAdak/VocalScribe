import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AudioWaveform from "@/components/AudioWaveform";
import TranscriptDisplay from "@/components/TranscriptDisplay";

const ASSEMBLY_AI_API_KEY = "5b1fd20849da4dd3b981ca0f1a175209";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState([
    { timestamp: "0:00", text: "Click the button to start recording..." },
  ]);
  
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
      // First, upload the audio file to AssemblyAI
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
        },
        body: audioBlob,
      });

      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;

      // Then, submit the transcription request
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

      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;

      // Poll for the transcription result
      let result = await checkTranscriptionStatus(transcriptId);
      
      if (result.status === 'completed') {
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
        toast({
          variant: "destructive",
          title: "Transcription failed",
          description: "Failed to transcribe the audio. Please try again.",
        });
      }
    } catch (error) {
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