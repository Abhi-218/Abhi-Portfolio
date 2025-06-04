'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'

export default function ConfettiExplosion({ trigger }: { trigger: boolean }) {
  const [windowWidth, windowHeight] = useWindowSize()
  const [recycle, setRecycle] = useState(true)

  useEffect(() => {
    if (trigger) {
      setRecycle(true)
      const timer = setTimeout(() => setRecycle(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  if (!trigger || !recycle) return null

  return (
    <Confetti
      width={windowWidth}
      height={windowHeight}
      numberOfPieces={200}
      recycle={recycle}
      gravity={0.2}
      colors={['#FFC700', '#FF0000', '#2E3191', '#41BBC7']}
    />
  )
}