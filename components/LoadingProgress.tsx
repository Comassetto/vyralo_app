'use client'

import { useEffect, useState } from 'react'

const messages = [
  'Estruturando seu carrossel...',
  'Criando a copy de cada slide...',
  'Aplicando estilo visual...',
  'Gerando sua legenda...',
  'Finalizando...',
]

interface LoadingProgressProps {
  isVisible: boolean
}

export function LoadingProgress({ isVisible }: LoadingProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0)
      setProgress(0)
      return
    }

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev < messages.length - 1 ? prev + 1 : prev))
    }, 2500)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 8
      })
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
      backgroundColor: 'rgba(26, 31, 54, 0.85)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="text-center px-8 max-w-sm w-full">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{
          background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)',
        }}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" fill="white" fillOpacity="0.9"/>
            <path d="M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" fill="white"/>
          </svg>
        </div>

        <h3 className="text-white text-lg font-semibold mb-2">Gerando seu carrossel</h3>

        {/* Mensagem rotativa */}
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {messages[messageIndex]}
        </p>

        {/* Barra de progresso */}
        <div className="relative h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progress, 90)}%`,
              background: 'linear-gradient(90deg, #7B2FFF, #00E5FF)',
            }}
          />
        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Isso pode levar alguns segundos...
        </p>
      </div>
    </div>
  )
}
