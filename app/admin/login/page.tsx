'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        isAdmin: 'true',
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais de administrador inválidas.')
      } else {
        window.location.href = '/admin/dashboard'
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, rgba(26,31,54,0.05) 0%, rgba(123,47,255,0.08) 100%)',
    }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
            background: 'linear-gradient(135deg, #1A1F36 0%, #7B2FFF 100%)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>
            Painel Admin
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Vyralo — Área restrita</p>
        </div>

        <div className="bg-white rounded-2xl border p-8 shadow-sm" style={{ borderColor: '#E8EAF0' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#1A1F36' }}>Acesso administrativo</h2>
          <p className="text-gray-500 text-sm mb-6">Use suas credenciais de administrador.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@vyralo.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #1A1F36 0%, #7B2FFF 100%)' }}
            >
              {loading ? 'Entrando...' : 'Entrar como Admin'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            <Link href="/login" className="underline hover:text-gray-600">← Voltar ao login de cliente</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
