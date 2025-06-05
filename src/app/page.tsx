'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import useSoundPlayer from '@/hooks/useSoundPlayer'
import { title } from 'process'


const TYPING_TEXTS = [
  'A Developer',
  'A Creator',
  'A Problem Solver'
]

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const { playPageChange } = useSoundPlayer(); 

  useEffect(() => {
  playPageChange();  
}, [playPageChange]);
  // Typing animation logic
  useEffect(() => {
    const currentText = TYPING_TEXTS[currentTextIndex]
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.substring(0, displayedText.length + 1))
        }, 100)
      } else {
        timeout = setTimeout(() => setIsTyping(false), 1000)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1))
        }, 50)
      } else {
        setCurrentTextIndex((currentTextIndex + 1) % TYPING_TEXTS.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentTextIndex, displayedText, isTyping])

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Floating emojis */}
      <div className="absolute max-md:hidden top-20 left-10 text-4xl animate-float">🚀</div>
      <div className="absolute max-md:hidden bottom-1/4 right-20 text-3xl animate-float-delay">🎨</div>
      <div className="absolute max-md:hidden top-1/7 right-1/4 text-5xl animate-float-delay-2">💻</div>
      <div className="absolute max-md:hidden top-5/7 left-20 text-5xl animate-float-delay-2">🤖</div>
      <div className="absolute max-md:hidden top-1/5 right-2/4 text-5xl animate-float-delay">🛡️</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
          Hi, I&apos;m Abhishek <span className='inline-block animate-wiggle text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500'>👋</span>
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300 mb-8 h-12">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h2>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center space-x-6 mt-12"
        >
          {[
            { icon: <FiGithub size={24} />, url: 'https://github.com/Abhi-218'  },
            { icon: <FiLinkedin size={24} />, url: 'https://www.linkedin.com/in/abhishek-vekariya-7913132ba/' },
            { icon: <FiTwitter size={24} />, url: 'https://twitter.com' },
            { icon: <FiMail size={24} />, url: 'mailto:abhishekportfolio@gmail.com' }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              {item.icon}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
