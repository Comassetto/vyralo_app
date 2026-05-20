'use client'

import { useRef, useState } from 'react'
import { SlidePreview } from './SlidePreview'
import type { SlideData } from '@/lib/claude'

interface CarrosselViewerProps {
  slides: SlideData[]
  estilo: string
  formato: 'quadrado' | 'retrato'
  legenda: string
}

export function CarrosselViewer({ slides, estilo, formato, legenda }: CarrosselViewerProps) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState<number | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)

  async function exportSlide(element: HTMLDivElement): Promise<Blob> {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    })
    return new Promise(resolve => canvas.toBlob(resolve as BlobCallback, 'image/png'))
  }

  async function downloadSlide(index: number) {
    const element = slideRefs.current[index]
    if (!element) return
    setDownloading(index)
    try {
      const blob = await exportSlide(element)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vyralo-slide-${index + 1}.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  async function downloadAll() {
    setDownloadingAll(true)
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      for (let i = 0; i < slides.length; i++) {
        const element = slideRefs.current[i]
        if (!element) continue
        const blob = await exportSlide(element)
        zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vyralo-carrossel.zip`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingAll(false)
    }
  }

  async function copiarLegenda() {
    await navigator.clipboard.writeText(legenda)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Botões de ação */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={downloadAll}
          disabled={downloadingAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {downloadingAll ? 'Preparando ZIP...' : 'Baixar todos (ZIP)'}
        </button>

        <button
          onClick={copiarLegenda}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all"
          style={{
            borderColor: copied ? '#10B981' : '#E8EAF0',
            color: copied ? '#10B981' : '#1A1F36',
            backgroundColor: copied ? '#ECFDF5' : 'white',
          }}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copiar legenda
            </>
          )}
        </button>
      </div>

      {/* Grid de slides */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {slides.map((slide, index) => (
          <div key={index} className="group relative">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#E8EAF0' }}>
              <SlidePreview
                ref={el => { slideRefs.current[index] = el }}
                slide={slide}
                estilo={estilo}
                formato={formato}
                numero={index + 1}
                total={slides.length}
                scale={0.27}
              />
            </div>

            <button
              onClick={() => downloadSlide(index)}
              disabled={downloading === index}
              className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-all hover:border-transparent"
              style={{
                borderColor: '#E8EAF0',
                color: '#6B7280',
                backgroundColor: 'white',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloading === index ? 'Baixando...' : `Slide ${index + 1}`}
            </button>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: '#1A1F36' }}>Legenda para publicação</h3>
          <button
            onClick={copiarLegenda}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: copied ? '#ECFDF5' : '#F7F8FC',
              color: copied ? '#10B981' : '#6B7280',
              border: `1px solid ${copied ? '#10B981' : '#E8EAF0'}`,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {copied ? <path d="M20 6L9 17l-5-5"/> : <rect x="9" y="9" width="13" height="13" rx="2"/>}
            </svg>
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4A5568' }}>
          {legenda}
        </p>
      </div>
    </div>
  )
}
