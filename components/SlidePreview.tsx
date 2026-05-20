'use client'

import { forwardRef } from 'react'
import type { SlideData } from '@/lib/claude'

interface StyleConfig {
  background: string
  corTitulo: string
  corTexto: string
  corDestaque: string
  corSubtitulo: string
}

const estilosConfig: Record<string, StyleConfig> = {
  moderno: {
    background: 'linear-gradient(135deg, #1A1F36 0%, #2D3561 100%)',
    corTitulo: '#00E5FF',
    corTexto: '#FFFFFF',
    corDestaque: '#7B2FFF',
    corSubtitulo: 'rgba(255,255,255,0.7)',
  },
  clean: {
    background: '#FFFFFF',
    corTitulo: '#1A1F36',
    corTexto: '#4A5568',
    corDestaque: '#7B2FFF',
    corSubtitulo: '#718096',
  },
  dark: {
    background: '#000000',
    corTitulo: '#FFFFFF',
    corTexto: '#CCCCCC',
    corDestaque: '#00E5FF',
    corSubtitulo: '#999999',
  },
  premium: {
    background: 'linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 100%)',
    corTitulo: '#D4AF37',
    corTexto: '#F5F0E8',
    corDestaque: '#D4AF37',
    corSubtitulo: 'rgba(245,240,232,0.7)',
  },
  colorido: {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    corTitulo: '#FFFFFF',
    corTexto: '#FFFFFF',
    corDestaque: '#FFE66D',
    corSubtitulo: 'rgba(255,255,255,0.85)',
  },
  minimalista: {
    background: '#FAFAFA',
    corTitulo: '#111111',
    corTexto: '#555555',
    corDestaque: '#111111',
    corSubtitulo: '#777777',
  },
}

interface SlidePreviewProps {
  slide: SlideData
  estilo: string
  formato: 'quadrado' | 'retrato'
  numero: number
  total: number
  scale?: number
}

export const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(
  ({ slide, estilo, formato, numero, total, scale = 0.28 }, ref) => {
    const config = estilosConfig[estilo] || estilosConfig.moderno
    const isRetrato = formato === 'retrato'
    const realWidth = 1080
    const realHeight = isRetrato ? 1350 : 1080

    const containerStyle: React.CSSProperties = {
      width: realWidth,
      height: realHeight,
      background: config.background,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px',
      overflow: 'hidden',
      transformOrigin: 'top left',
      transform: `scale(${scale})`,
      flexShrink: 0,
    }

    const wrapperStyle: React.CSSProperties = {
      width: realWidth * scale,
      height: realHeight * scale,
      overflow: 'hidden',
      borderRadius: 12,
      position: 'relative',
      flexShrink: 0,
    }

    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={containerStyle}>
          {/* Número do slide */}
          <div style={{
            position: 'absolute',
            top: 40,
            right: 50,
            fontSize: 22,
            color: config.corSubtitulo,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
          }}>
            {numero}/{total}
          </div>

          {/* Conteúdo baseado no tipo */}
          {slide.tipo === 'capa' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              {slide.destaque && (
                <div style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: 50,
                  backgroundColor: config.corDestaque,
                  color: estilo === 'clean' || estilo === 'minimalista' ? '#fff' : config.corTitulo,
                  fontSize: 22,
                  fontWeight: 600,
                  marginBottom: 32,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {slide.destaque}
                </div>
              )}
              <h1 style={{
                fontSize: 72,
                fontWeight: 800,
                color: config.corTitulo,
                lineHeight: 1.1,
                marginBottom: 24,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-2px',
              }}>
                {slide.titulo}
              </h1>
              {slide.subtitulo && (
                <p style={{
                  fontSize: 32,
                  color: config.corSubtitulo,
                  fontWeight: 400,
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.4,
                }}>
                  {slide.subtitulo}
                </p>
              )}
            </div>
          )}

          {slide.tipo === 'conteudo' && (
            <div style={{ width: '100%' }}>
              <h2 style={{
                fontSize: 52,
                fontWeight: 700,
                color: config.corTitulo,
                lineHeight: 1.2,
                marginBottom: 32,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-1px',
              }}>
                {slide.titulo}
              </h2>
              <p style={{
                fontSize: 30,
                color: config.corTexto,
                lineHeight: 1.6,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
              }}>
                {slide.conteudo}
              </p>
              {slide.destaque && (
                <div style={{
                  marginTop: 40,
                  padding: '20px 28px',
                  borderLeft: `6px solid ${config.corDestaque}`,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '0 8px 8px 0',
                }}>
                  <p style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: config.corDestaque,
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'italic',
                  }}>
                    {slide.destaque}
                  </p>
                </div>
              )}
            </div>
          )}

          {slide.tipo === 'lista' && (
            <div style={{ width: '100%' }}>
              <h2 style={{
                fontSize: 52,
                fontWeight: 700,
                color: config.corTitulo,
                lineHeight: 1.2,
                marginBottom: 40,
                fontFamily: 'Inter, sans-serif',
              }}>
                {slide.titulo}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(slide.itens || slide.conteudo.split('\n').filter(Boolean)).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: config.corDestaque,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: estilo === 'clean' || estilo === 'minimalista' ? '#fff' : '#1A1F36',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {i + 1}
                    </div>
                    <p style={{
                      fontSize: 28,
                      color: config.corTexto,
                      lineHeight: 1.4,
                      fontFamily: 'Inter, sans-serif',
                      paddingTop: 4,
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.tipo === 'citacao' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{
                fontSize: 100,
                color: config.corDestaque,
                lineHeight: 0.5,
                marginBottom: 20,
                fontFamily: 'Georgia, serif',
              }}>"</div>
              <p style={{
                fontSize: 44,
                fontWeight: 600,
                color: config.corTitulo,
                lineHeight: 1.3,
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
                marginBottom: 32,
              }}>
                {slide.conteudo || slide.titulo}
              </p>
              {slide.subtitulo && (
                <p style={{
                  fontSize: 26,
                  color: config.corSubtitulo,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  — {slide.subtitulo}
                </p>
              )}
            </div>
          )}

          {slide.tipo === 'estatistica' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{
                fontSize: 120,
                fontWeight: 900,
                color: config.corDestaque,
                lineHeight: 1,
                marginBottom: 16,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-4px',
              }}>
                {slide.destaque || slide.titulo}
              </div>
              <p style={{
                fontSize: 36,
                fontWeight: 600,
                color: config.corTitulo,
                fontFamily: 'Inter, sans-serif',
                marginBottom: 16,
              }}>
                {slide.destaque ? slide.titulo : ''}
              </p>
              <p style={{
                fontSize: 28,
                color: config.corTexto,
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.5,
              }}>
                {slide.conteudo}
              </p>
            </div>
          )}

          {slide.tipo === 'cta' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h2 style={{
                fontSize: 62,
                fontWeight: 800,
                color: config.corTitulo,
                lineHeight: 1.2,
                marginBottom: 24,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-1.5px',
              }}>
                {slide.titulo}
              </h2>
              <p style={{
                fontSize: 30,
                color: config.corTexto,
                lineHeight: 1.5,
                marginBottom: 48,
                fontFamily: 'Inter, sans-serif',
              }}>
                {slide.conteudo}
              </p>
              {slide.destaque && (
                <div style={{
                  display: 'inline-block',
                  padding: '18px 48px',
                  borderRadius: 50,
                  backgroundColor: config.corDestaque,
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {slide.destaque}
                </div>
              )}
            </div>
          )}

          {/* Logo Vyralo no rodapé */}
          <div style={{
            position: 'absolute',
            bottom: 36,
            left: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
                <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" fill="white"/>
              </svg>
            </div>
            <span style={{
              fontSize: 18,
              fontWeight: 600,
              color: config.corSubtitulo,
              fontFamily: 'Inter, sans-serif',
            }}>
              Vyralo
            </span>
          </div>
        </div>
      </div>
    )
  }
)

SlidePreview.displayName = 'SlidePreview'
