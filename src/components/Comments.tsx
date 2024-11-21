import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit2, Trash2, Reply } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  author: string;
  replies: Comment[];
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
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
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const editComment = (commentId: string) => {
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, text: editText };
      }
      return c;
    });
    setComments(updatedComments);
    setEditingId(null);
    setEditText('');
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const addReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const updatedComments = comments.map(c => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...c.replies, {
            id: Date.now().toString(),
            text: replyText,
            author: 'User',
            replies: [],
          }],
        };
      }
      return c;
    });
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="mt-8 space-y-4 font-['Quicksand']">
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={`flex-1 p-2 rounded border-2 ${inputColor} focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300`}
        />
        <Button onClick={addComment} className="hover:scale-105 transition-transform">
          <MessageSquare className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            {editingId === comment.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 p-2 rounded border"
                />
                <Button onClick={() => editComment(comment.id)}>Save</Button>
              </div>
            ) : (
              <>
                <p>{comment.text}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditText(comment.text);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </>
            )}

            {replyingTo === comment.id && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 p-2 rounded border"
                />
                <Button onClick={() => addReply(comment.id)}>Reply</Button>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="p-3 rounded-lg bg-white/30 backdrop-blur-sm">
                    <p>{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
