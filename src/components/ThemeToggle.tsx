'use client'

import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import useSoundPlayer from '@/hooks/useSoundPlayer'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)
  const { playModeChange, playClick } = useSoundPlayer()

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    playClick()
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    document.documentElement.classList.toggle('dark', newMode)
    playModeChange()
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 left-6 p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
    </button>
  )
}