"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CommentBox from "./CommentBox";
import { useRouter } from "next/navigation";
import {ISuggestionCardProps } from "@/Models/interfaces";

export default function SuggestionCard({
  suggestion,
  onUpdate,
  currentUser,
}:ISuggestionCardProps) {
  const router = useRouter();

  const { _id, message, likes, dislikes, comments, user } = suggestion;
  const [showComments, setShowComments] = useState(false);

  const isAdmin = currentUser?.role === "admin";
  const hasLiked = likes.includes(currentUser?.email || '');
  const hasDisliked = dislikes.includes(currentUser?.email || '');

  const vote = async (action: "like" | "dislike") => {
    if (!currentUser) {
      router.push("/login");
    }

    const res = await fetch("/api/suggestions", {
      method: "PATCH",
      body: JSON.stringify({ id: _id, action }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="max-w-2xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
>
  {/* Header */}
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center gap-4">
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md flex-shrink-0">
      <Image
        src={user.profileImage || "/default-profile.png"}
        alt="Profile picture"
        fill
        className="object-cover"
      />
    </div>
    <h2 className="text-xl font-semibold break-words">{user.name}</h2>
  </div>

  {/* Body */}
  <div className="p-6">
    <p className="text-gray-700 dark:text-gray-200 mb-4 break-words whitespace-pre-wrap overflow-wrap-anywhere">
      {message}
    </p>

    {/* Buttons */}
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => vote("like")}
        disabled={hasLiked}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          hasLiked
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
        }`}
      >
        👍 {likes.length}
      </button>
      <button
        onClick={() => vote("dislike")}
        disabled={hasDisliked}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          hasDisliked
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
        }`}
      >
        👎 {dislikes.length}
      </button>
      <button
        onClick={() => {
          if (!currentUser) {
            router.push("/login");
          } else {
            setShowComments((prev) => !prev);
          }
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 transition-all"
      >
        💬 {showComments ? "Hide" : "Show"} Comments ({comments.length})
      </button>
    </div>

    {/* Admin Stats */}
    {isAdmin && (
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        <p className="break-words">Likes: {likes.join(", ") || "None"}</p>
        <p className="break-words">Dislikes: {dislikes.join(", ") || "None"}</p>
      </div>
    )}

    {/* Comments Section */}
    <AnimatePresence>
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mt-6"
        >
          <CommentBox id={_id} comments={comments} onUpdate={onUpdate} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</motion.div>
  );
}
