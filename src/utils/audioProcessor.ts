export const processAudioFile = async (file: File, apiKey: string): Promise<string> => {
  const formData = new FormData();
  formData.append('audio', file);

  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
    },
    body: file,
  });

  const uploadData = await uploadResponse.json();
  const audioUrl = uploadData.upload_url;

  const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
    }),
  });

  const transcriptData = await transcriptResponse.json();
  return transcriptData.id;
};

export const checkTranscriptionStatus = async (
  transcriptId: string, 
  apiKey: string
): Promise<{ status: string; text?: string }> => {
  const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: {
      'Authorization': apiKey,
    },
  });
  
  return response.json();
};