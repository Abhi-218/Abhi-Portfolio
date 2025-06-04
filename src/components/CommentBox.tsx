'use client';

import { IComment, ICommentBoxProps } from '@/Models/interfaces';
import { useState } from 'react';


export default function CommentBox({ id, comments, onUpdate }: ICommentBoxProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch('/api/suggestions/comments', {
      method: 'POST',
      body: JSON.stringify({ id, text }),
      headers: { 'Content-Type': 'application/json' }
    });
    const updated = await res.json();
    onUpdate(updated);
    console.log("id ", id );
    console.log("com ", comments );
    console.log("onup ", onUpdate );
    setText('');
    setLoading(false);
  };

  return (
    <div className="mt-6">
      {/* Input Area */}
      <div className="flex flex-col gap-2">
        <textarea
          className="w-full-[20px] rounded-lg border border-gray-300 dark:border-gray-700 p-3 resize-none min-h-[80px] focus:outline-none focus:border-2 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={submitComment}
          disabled={loading || !text.trim()}
          className="self-end px-4 py-2 rounded-md text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Comment List */}
      <ul className="mt-4 space-y-3">
        {comments.map((c: IComment, i: number) => (
          <li
            key={i}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200"
          >
            <span className="font-medium text-blue-600 dark:text-blue-400">{c.email}:</span>{' '}
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
