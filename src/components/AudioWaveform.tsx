const AudioWaveform = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-16 my-4">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full animate-wave"
          style={{
            height: "100%",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;