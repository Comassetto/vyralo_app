'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const planCredits: Record<string, number> = { STARTER: 60, PRO: 200, AGENCIA: 700 }

export function NovoClienteModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', plan: 'STARTER', credits: 60,
  })
  const router = useRouter()

  function handlePlanChange(plan: string) {
    setForm(f => ({ ...f, plan, credits: planCredits[plan] || 60 }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao criar cliente.'); return }
      setOpen(false)
      setForm({ name: '', email: '', password: '', plan: 'STARTER', credits: 60 })
      router.refresh()
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Novo Cliente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(26,31,54,0.6)' }}>
          <div className="bg-white rounded-2xl border shadow-xl w-full max-w-md mx-4 p-6" style={{ borderColor: '#E8EAF0' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: '#1A1F36' }}>Novo Cliente</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Nome completo', key: 'name', type: 'text', placeholder: 'João Silva' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'joao@email.com' },
                { label: 'Senha inicial', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    required
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                    onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                    onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>Plano</label>
                <select
                  value={form.plan}
                  onChange={e => handlePlanChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                >
                  <option value="STARTER">Starter — 60 créditos/mês</option>
                  <option value="PRO">Pro — 200 créditos/mês</option>
                  <option value="AGENCIA">Agência — 700 créditos/mês</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1F36' }}>Créditos iniciais</label>
                <input
                  type="number"
                  value={form.credits}
                  onChange={e => setForm(f => ({ ...f, credits: parseInt(e.target.value) || 0 }))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
                  onFocus={e => (e.target.style.borderColor = '#7B2FFF')}
                  onBlur={e => (e.target.style.borderColor = '#E8EAF0')}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: '#E8EAF0', color: '#6B7280' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}
                >
                  {loading ? 'Criando...' : 'Criar cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
