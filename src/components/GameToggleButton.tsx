"use client";

import { useState } from "react";
import FloatingEmoji from "@/components/ok";
import useSoundPlayer from "@/hooks/useSoundPlayer";

export default function GameToggleButton() {
  const [showGame, setShowGame] = useState(false);
  const { playClick, playShowGame } = useSoundPlayer();

  const handleShowGame = () => {
    playClick();
    playShowGame();
    setShowGame((prev) => !prev);
  };

  return (
    <>
      {showGame && <FloatingEmoji />}

      <button
        onClick={handleShowGame}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg z-50"
      >
        {showGame ? (
          <span className="text-xl">😎</span>
        ) : (
          <span className="text-xl">😒</span>
        )}
      </button>
    </>
  );
}
