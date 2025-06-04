"use client";

import { MotionConfig } from "framer-motion";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingEmoji from "@/components/ok";
import { useState } from "react";
import useSoundPlayer from "@/hooks/useSoundPlayer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showGame, setShowGame] = useState(true);
  const { playClick,playShowGame} = useSoundPlayer()
  const handleShowGame = () => {
    playClick();
    playShowGame();
    setShowGame(!showGame);

  };
  return (
    <html lang="en" className="scroll-smooth">
      <MotionConfig reducedMotion="user">
        <body
          className={`${inter.className} bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800`}
        >
          {children}
          {showGame ? <FloatingEmoji /> : ""}
          <Navbar />
          <ThemeToggle />
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
        </body>
      </MotionConfig>
    </html>
  );
}
