'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        isAdmin: 'false',
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha incorretos. Verifique suas credenciais.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.08) 0%, rgba(0, 229, 255, 0.08) 100%)',
    }}>
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
            background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" fill="white" fillOpacity="0.9"/>
              <path d="M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>
            Vyralo
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Carrosséis profissionais com IA</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl border p-8 shadow-sm" style={{ borderColor: '#E8EAF0' }}>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#1A1F36' }}>Entrar na sua conta</h2>
          <p className="text-gray-500 text-sm mb-6">Bem-vindo de volta!</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Administrador?{' '}
            <Link href="/admin/login" className="underline hover:text-gray-600">
              Acessar painel admin
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 Vyralo. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
