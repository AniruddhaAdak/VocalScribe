import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit2, Trash2, Reply, Heart } from "lucide-react";
import { CommentItem } from './CommentItem';

interface Comment {
  id: string;
  text: string;
  author: string;
  replies: Comment[];
  likes: number;
  isLiked: boolean;
  level?: number;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [inputColor, setInputColor] = useState('border-blue-500');

  useEffect(() => {
    const colors = [
      'border-blue-500',
      'border-green-500',
      'border-purple-500',
      'border-pink-500',
      'border-yellow-500',
      'border-red-500',
      'border-indigo-500',
      'border-orange-500'
    ];
    let colorIndex = 0;

    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setInputColor(colors[colorIndex]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'User',
      replies: [],
      likes: 0,
      isLiked: false,
      level: 0,
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="mt-8 space-y-4 font-['Quicksand']">
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={`flex-1 p-2 rounded border-2 ${inputColor} focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300 bg-white/90 dark:bg-gray-800/90 text-foreground dark:text-white`}
        />
        <Button onClick={addComment} className="hover:scale-105 transition-transform cursor-action">
          <MessageSquare className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            setComments={setComments}
            allComments={comments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;