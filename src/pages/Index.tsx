import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { processAudioFile, checkTranscriptionStatus } from "@/utils/audioProcessor";
import RecordingInterface from "@/components/RecordingInterface";
import TranscriptActions from "@/components/TranscriptActions";
import Comments from "@/components/Comments";

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
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch((err) => {
        setHasPermission(false);
        console.error("Initial permission check failed:", err);
      });
  }, []);

  const handleEdit = () => {
    // Add edit functionality here
    toast({
      title: "Edit mode",
      description: "Editing functionality coming soon!",
    });
  };

  const handleDelete = () => {
    setTranscript([{ timestamp: "0:00", text: "Click the button to start recording..." }]);
    toast({
      title: "Transcript deleted",
      description: "The transcript has been cleared.",
    });
  };

  const uploadAudioToAssemblyAI = async (audioBlob: Blob) => {
    try {
      setProcessingProgress(25);
      const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
      const transcriptId = await processAudioFile(file, ASSEMBLY_AI_API_KEY);
      
      setProcessingProgress(50);
      let result = await checkTranscriptionStatus(transcriptId, ASSEMBLY_AI_API_KEY);
      
      while (result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = await checkTranscriptionStatus(transcriptId, ASSEMBLY_AI_API_KEY);
      }
      
      if (result.status === 'completed' && result.text) {
        setProcessingProgress(100);
        const currentTime = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        setTranscript(prev => [...prev, {
          timestamp: currentTime,
          text: result.text,
        }]);

        toast({
          title: "Transcription complete",
          description: "Your audio has been successfully transcribed.",
        });
      }
    } catch (error) {
      setProcessingProgress(0);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the audio. Please try again.",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setProcessingProgress(25);
      const transcriptId = await processAudioFile(file, ASSEMBLY_AI_API_KEY);
      
      setProcessingProgress(50);
      let result = await checkTranscriptionStatus(transcriptId, ASSEMBLY_AI_API_KEY);
      
      while (result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = await checkTranscriptionStatus(transcriptId, ASSEMBLY_AI_API_KEY);
      }
      
      if (result.status === 'completed' && result.text) {
        setProcessingProgress(100);
        const currentTime = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        setTranscript(prev => [...prev, {
          timestamp: currentTime,
          text: result.text,
        }]);

        toast({
          title: "Transcription complete",
          description: "Your audio file has been successfully transcribed.",
        });
      }
    } catch (error) {
      setProcessingProgress(0);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the audio file. Please try again.",
      });
    }
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

        mediaRecorder.start(1000);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-gradient" />
      
      <ThemeToggle />
      <div className="max-w-4xl mx-auto relative z-10 min-h-screen flex flex-col">
        <div className="text-center mb-8 animate-slide-in-right">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text mb-2 font-['Righteous']">
            LiveTranscript+
          </h1>
          <p className="text-lg text-muted-foreground font-['Quicksand']">
            Real-time audio transcription made beautiful
          </p>
        </div>

        <RecordingInterface 
          isRecording={isRecording}
          processingProgress={processingProgress}
          onToggleRecording={toggleRecording}
          onFileSelected={handleFileUpload}
          hasPermission={hasPermission}
        />

        <div className="flex-grow animate-fade-in mb-8">
          <TranscriptDisplay lines={transcript} />
          <TranscriptActions 
            transcript={transcript}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Comments />
        </div>

        <footer className="w-full py-4 text-center text-sm text-gray-600 dark:text-gray-400 font-['Space_Grotesk'] animate-fade-in mt-auto">
          <p>© {new Date().getFullYear()} LiveTranscript+. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
