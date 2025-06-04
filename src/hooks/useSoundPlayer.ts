"use client"
import { useEffect } from 'react'
import useSound from 'use-sound'

export default function useSoundPlayer() {
  
  // Sound configuration with volume dependent on mute state
  const soundConfig = { 
    volume:0.5,
    // This ensures sounds are still loaded but with 0 volume when muted
    soundEnabled: true 
  }
  
  // Use the same config for all sounds
  const [playClick] = useSound('/sounds/click.mp3', soundConfig)
  const [playModeChange] = useSound('/sounds/mode-change.mp3', soundConfig)
  const [playPageChange] = useSound('/sounds/page-change.mp3', soundConfig)
  const [playAttentionEmojiMove] = useSound('/sounds/attention.mp3', soundConfig)
  const [playEmojiAngry] = useSound('/sounds/angry.mp3', soundConfig)
  const [playShowGame] = useSound('/sounds/showGame.mp3', soundConfig)

    useEffect(() => {
    new Audio('/sounds/click.mp3').load()
    new Audio('/sounds/page-change.mp3').load()
    new Audio('/sounds/mode-change.mp3').load()
    new Audio('/sounds/attention.mp3').load()
    new Audio('/sounds/angry.mp3').load()
    new Audio('/sounds/showGame.mp3').load()
  }, [])
  return {
    playClick,
    playPageChange,
    playModeChange,
    playAttentionEmojiMove,
    playEmojiAngry,
    playShowGame
  }
}