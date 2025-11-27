import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import { Metadata } from "next";
import GameToggleButton from "@/components/GameToggleButton";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abhishek Portfolio",
  icons: "/Icon.png",
  description:
    "Designed and developed a modern, responsive portfolio showcasing projects and skills. Implemented smooth animations and interactive UI elements for enhanced user experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800`}
      >
        <MotionProvider>
          {children}
          <Navbar />
          <ThemeToggle />
          <GameToggleButton />
        </MotionProvider>
      </body>
    </html>
  );
}
