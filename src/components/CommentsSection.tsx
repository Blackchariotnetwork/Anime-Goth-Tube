import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { CommentItem } from '../types';
import { USER_LOGO_PATH } from '../data/videoData';

interface CommentsSectionProps {
  comments: CommentItem[];
  onAddComment: (content: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const [inputText, setInputText] = useState('');
  const [commentList, setCommentList] = useState<CommentItem[]>(comments);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newC: CommentItem = {
      id: `c-${Date.now()}`,
      author: 'root@visitor',
      handle: '@visitor_node',
      avatar: USER_LOGO_PATH,
      content: inputText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setCommentList([newC, ...commentList]);
    onAddComment(inputText.trim());
    setInputText('');
  };

  const handleToggleLike = (id: string) => {
    const isCurrentlyLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setCommentList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likes: isCurrentlyLiked ? c.likes - 1 : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 font-mono pt-4 border-t border-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-black" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            Terminal Comments ({commentList.length})
          </h2>
        </div>
        <span className="text-xs text-neutral-500">SORT: NEWEST_FIRST</span>
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-9 h-9 border border-black bg-white overflow-hidden shrink-0">
          <img
            src={USER_LOGO_PATH}
            alt="Current User"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Input terminal message / feedback to author..."
            rows={2}
            className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:outline-hidden transition-colors resize-none placeholder:text-neutral-400 font-mono"
          />

          <div className="flex justify-end gap-2">
            {inputText.trim() && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="px-3 py-1 text-xs text-neutral-600 hover:text-black"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-black hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-black"
            >
              <Send className="w-3 h-3" />
              <span>Broadcast</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-4">
        {commentList.map((c) => {
          const isLiked = likedMap[c.id];

          return (
            <div key={c.id} className="flex gap-3 text-xs group">
              <div className="w-8 h-8 border border-neutral-300 bg-white overflow-hidden shrink-0">
                <img
                  src={c.avatar}
                  alt={c.author}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">{c.author}</span>
                  {c.isAuthor && (
                    <span className="flex items-center gap-1 text-[10px] text-black font-semibold">
                      <ShieldCheck className="w-3 h-3 inline" />
                      <span>AUTHOR</span>
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-500">{c.handle}</span>
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span className="text-[11px] text-neutral-400">{c.timestamp}</span>
                </div>

                <p className="text-neutral-800 leading-relaxed font-sans text-[13px]">
                  {c.content}
                </p>

                <div className="flex items-center gap-4 mt-1 text-neutral-500 text-[11px]">
                  <button
                    onClick={() => handleToggleLike(c.id)}
                    className={`flex items-center gap-1 hover:text-black transition-colors ${
                      isLiked ? 'text-black font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-black' : ''}`} />
                    <span className="tabular-nums">{c.likes}</span>
                  </button>
                  <button className="hover:text-black transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
