import { useState } from 'react';
import { Heart } from 'lucide-react';

interface TranscriptItemProps {
  timestamp: string;
  text: string;
}

const TranscriptItem = ({ timestamp, text }: TranscriptItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [textColor] = useState(() => {
    const colors = [
      'text-blue-600',
      'text-purple-600',
      'text-green-600',
      'text-pink-600',
      'text-indigo-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  return (
    <div className="flex gap-4 hover:bg-primary/5 p-2 rounded-lg transition-all duration-200 group cursor-text">
      <span className="text-sm text-primary min-w-[60px] font-mono">{timestamp}</span>
      <p className={`${textColor} dark:text-opacity-90 flex-grow`}>{text}</p>
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>
    </div>
  );
};

export default TranscriptItem;