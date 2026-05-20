'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingProgress } from '@/components/LoadingProgress'

const redesOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'pinterest', label: 'Pinterest' },
]

const estilosOptions = [
  { value: 'moderno', label: 'Moderno', desc: 'Tons escuros com detalhes neon', color: '#1A1F36', accent: '#00E5FF' },
  { value: 'clean', label: 'Clean', desc: 'Branco e cinza, tipografia elegante', color: '#FFFFFF', accent: '#7B2FFF' },
  { value: 'dark', label: 'Dark', desc: 'Fundo preto total, textos brancos', color: '#000000', accent: '#00E5FF' },
  { value: 'premium', label: 'Premium', desc: 'Dourado e off-white, sofisticado', color: '#1C1C1C', accent: '#D4AF37' },
  { value: 'colorido', label: 'Colorido', desc: 'Cores vibrantes e alegres', color: '#FF6B6B', accent: '#FFE66D' },
  { value: 'minimalista', label: 'Minimalista', desc: 'Espaços em branco, radical', color: '#FAFAFA', accent: '#111111' },
]

const tomsOptions = [
  { value: 'educativo', label: 'Educativo', icon: '📚' },
  { value: 'profissional', label: 'Profissional', icon: '💼' },
  { value: 'provocativo', label: 'Provocativo', icon: '🔥' },
  { value: 'emocional', label: 'Emocional', icon: '❤️' },
  { value: 'descontraido', label: 'Descontraído', icon: '😄' },
]

const idiomasOptions = [
  { value: 'portugues', label: 'Português' },
  { value: 'ingles', label: 'Inglês' },
  { value: 'espanhol', label: 'Espanhol' },
  { value: 'frances', label: 'Francês' },
  { value: 'italiano', label: 'Italiano' },
  { value: 'alemao', label: 'Alemão' },
]

function calcularCreditos(numSlides: number): number {
  if (numSlides <= 5) return 1
  if (numSlides <= 8) return 2
  return 3
}

function GerarPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const regenerarId = searchParams.get('regenerar')

  const [tema, setTema] = useState('')
  const [descricao, setDescricao] = useState('')
  const [rede, setRede] = useState('instagram')
  const [estilo, setEstilo] = useState('moderno')
  const [tom, setTom] = useState('educativo')
  const [idioma, setIdioma] = useState('portugues')
  const [numSlides, setNumSlides] = useState(6)
  const [formato, setFormato] = useState<'quadrado' | 'retrato'>('quadrado')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (regenerarId) {
      fetch(`/api/geracoes/${regenerarId}`)
        .then(r => r.json())
        .then(data => {
          if (data) {
            setTema(data.tema || '')
            setDescricao(data.descricao || '')
            setRede(data.rede || 'instagram')
            setEstilo(data.estilo || 'moderno')
            setTom(data.tom || 'educativo')
            setIdioma(data.idioma || 'portugues')
            setNumSlides(data.numSlides || 6)
            setFormato(data.formato || 'quadrado')
          }
        })
        .catch(() => {})
    }
  }, [regenerarId])

  const creditos = calcularCreditos(numSlides)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tema.trim() || !descricao.trim()) {
      setError('Preencha o tema e a descrição do conteúdo.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, descricao, rede, estilo, tom, idioma, numSlides, formato }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro. Tente novamente.')
        setLoading(false)
        return
      }

      router.push(`/gerar/resultado/${data.id}`)
    } catch {
      setError('Falha na conexão. Verifique sua internet e tente novamente.')
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingProgress isVisible={loading} />

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>
            Criar Carrossel
          </h1>
          <p className="text-gray-500 mt-1">Preencha as informações abaixo e deixe a IA fazer o trabalho pesado.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1 */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#1A1F36' }}>
              <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}>1</span>
              Sobre o conteúdo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>
                  Tema do carrossel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={e => setTema(e.target.value)}
                  required
                  placeholder="Ex: 5 hábitos que vão mudar sua saúde em 30 dias"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                  onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                  onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>
                  Descrição e contexto <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  required
                  rows={4}
                  placeholder="Ex: Sou nutricionista e quero falar sobre os benefícios do magnésio para mulheres acima de 40 anos. Meu público é de mulheres que querem melhorar a saúde de forma natural."
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                  onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                  onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>
                  Rede social
                </label>
                <select
                  value={rede}
                  onChange={e => setRede(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                >
                  {redesOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2 */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#1A1F36' }}>
              <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}>2</span>
              Estilo e formato
            </h2>

            <div className="space-y-6">
              {/* Estilo visual */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#1A1F36' }}>Estilo visual</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {estilosOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEstilo(opt.value)}
                      className="relative p-3 rounded-xl border-2 text-left transition-all"
                      style={{
                        borderColor: estilo === opt.value ? '#7B2FFF' : '#E8EAF0',
                        backgroundColor: estilo === opt.value ? 'rgba(123,47,255,0.04)' : 'white',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-md flex-shrink-0" style={{
                          backgroundColor: opt.color,
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: `inset -4px 0 0 ${opt.accent}`,
                        }} />
                        <span className="text-sm font-semibold" style={{ color: '#1A1F36' }}>{opt.label}</span>
                      </div>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                      {estilo === opt.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B2FFF' }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tom de voz */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#1A1F36' }}>Tom de voz</label>
                <div className="flex flex-wrap gap-2">
                  {tomsOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTom(opt.value)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                      style={{
                        borderColor: tom === opt.value ? '#7B2FFF' : '#E8EAF0',
                        backgroundColor: tom === opt.value ? 'rgba(123,47,255,0.08)' : 'white',
                        color: tom === opt.value ? '#7B2FFF' : '#6B7280',
                      }}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idioma */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>Idioma</label>
                <select
                  value={idioma}
                  onChange={e => setIdioma(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                >
                  {idiomasOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3 */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#1A1F36' }}>
              <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}>3</span>
              Estrutura
            </h2>

            <div className="space-y-6">
              {/* Número de slides */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium" style={{ color: '#1A1F36' }}>Número de slides</label>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{
                    background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
                    color: 'white',
                  }}>
                    {creditos} crédito{creditos > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNumSlides(n)}
                      className="w-10 h-10 rounded-lg border text-sm font-semibold transition-all"
                      style={{
                        borderColor: numSlides === n ? '#7B2FFF' : '#E8EAF0',
                        backgroundColor: numSlides === n ? '#7B2FFF' : 'white',
                        color: numSlides === n ? 'white' : '#6B7280',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  3–5 slides = 1 crédito · 6–8 slides = 2 créditos · 9–12 slides = 3 créditos
                </p>
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#1A1F36' }}>Formato</label>
                <div className="flex gap-3">
                  {[
                    { value: 'quadrado', label: 'Quadrado', dim: '1080 × 1080', icon: '⬛' },
                    { value: 'retrato', label: 'Retrato', dim: '1080 × 1350', icon: '📱' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormato(opt.value as 'quadrado' | 'retrato')}
                      className="flex-1 p-4 rounded-xl border-2 text-center transition-all"
                      style={{
                        borderColor: formato === opt.value ? '#7B2FFF' : '#E8EAF0',
                        backgroundColor: formato === opt.value ? 'rgba(123,47,255,0.04)' : 'white',
                      }}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <p className="text-sm font-semibold" style={{ color: '#1A1F36' }}>{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.dim}px</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-4 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
          >
            {loading ? 'Gerando...' : `Gerar Carrossel — ${creditos} crédito${creditos > 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </>
  )
}

export default function GerarPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="text-gray-400">Carregando...</div></div>}>
      <GerarPageInner />
    </Suspense>
  )
}
