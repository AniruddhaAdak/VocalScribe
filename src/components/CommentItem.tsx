import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Reply, Heart } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  author: string;
  replies: Comment[];
  likes: number;
  isLiked: boolean;
  level?: number;
}

interface CommentItemProps {
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  allComments: Comment[];
}

const COLORS = [
  'bg-purple-100 dark:bg-purple-900/30',
  'bg-blue-100 dark:bg-blue-900/30',
  'bg-green-100 dark:bg-green-900/30',
  'bg-pink-100 dark:bg-pink-900/30',
  'bg-yellow-100 dark:bg-yellow-900/30',
  'bg-indigo-100 dark:bg-indigo-900/30',
  'bg-orange-100 dark:bg-orange-900/30',
  'bg-red-100 dark:bg-red-900/30'
];

export const CommentItem = ({ comment, setComments, allComments }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const level = comment.level || 0;
  const backgroundColor = COLORS[level % COLORS.length];

  const updateComment = (commentId: string, newData: Partial<Comment>, comments: Comment[]): Comment[] => {
    return comments.map(c => {
      if (c.id === commentId) {
        return { ...c, ...newData };
      }
      if (c.replies.length > 0) {
        return { ...c, replies: updateComment(commentId, newData, c.replies) };
      }
      return c;
    });
  };

  const addReply = (parentId: string, replyText: string, comments: Comment[]): Comment[] => {
    return comments.map(c => {
      if (c.id === parentId) {
        const newReply: Comment = {
          id: Date.now().toString(),
          text: replyText,
          author: 'User',
          replies: [],
          likes: 0,
          isLiked: false,
          level: (c.level || 0) + 1
        };
        return { ...c, replies: [...c.replies, newReply] };
      }
      if (c.replies.length > 0) {
        return { ...c, replies: addReply(parentId, replyText, c.replies) };
      }
      return c;
    });
  };

  const deleteComment = (commentId: string, comments: Comment[]): Comment[] => {
    return comments.filter(c => {
      if (c.id === commentId) {
        return false;
      }
      if (c.replies.length > 0) {
        c.replies = deleteComment(commentId, c.replies);
      }
      return true;
    });
  };

  const handleEdit = () => {
    if (!editText.trim()) return;
    setComments(prevComments => updateComment(comment.id, { text: editText }, prevComments));
    setIsEditing(false);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setComments(prevComments => addReply(comment.id, replyText, prevComments));
    setIsReplying(false);
    setReplyText('');
  };

  const handleDelete = () => {
    setComments(prevComments => deleteComment(comment.id, prevComments));
  };

  const handleLike = () => {
    setComments(prevComments => 
      updateComment(comment.id, { 
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked 
      }, prevComments)
    );
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${backgroundColor} shadow-sm transition-colors duration-300`}>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 p-2 rounded border bg-white/90 dark:bg-gray-800/90 text-foreground dark:text-white"
            />
            <Button onClick={handleEdit}>Save</Button>
          </div>
        ) : (
          <>
            <p className="text-foreground dark:text-white">{comment.text}</p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={comment.isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                {comment.likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(true);
                  setEditText(comment.text);
                }}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </>
        )}

        {isReplying && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 p-2 rounded border bg-white/90 dark:bg-gray-800/90 text-foreground dark:text-white"
            />
            <Button onClick={handleReply}>Reply</Button>
          </div>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              setComments={setComments}
              allComments={allComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};