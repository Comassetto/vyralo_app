'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClienteActionsProps {
  cliente: {
    id: string
    name: string
    email: string
    plan: string
    credits: number
    active: boolean
  }
}

export function ClienteActions({ cliente }: ClienteActionsProps) {
  const router = useRouter()
  const [credits, setCredits] = useState(cliente.credits)
  const [addCredits, setAddCredits] = useState(0)
  const [plan, setPlan] = useState(cliente.plan)
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [message, setMessage] = useState('')

  async function updateCredits(action: 'add' | 'zero') {
    setLoading('credits')
    try {
      const res = await fetch('/api/admin/creditos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cliente.id, action, amount: addCredits }),
      })
      const data = await res.json()
      if (res.ok) {
        setCredits(data.credits)
        setAddCredits(0)
        setMessage('Créditos atualizados com sucesso!')
        setTimeout(() => setMessage(''), 3000)
        router.refresh()
      }
    } finally {
      setLoading(null)
    }
  }

  async function toggleActive() {
    setLoading('active')
    try {
      const res = await fetch(`/api/admin/clientes/${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !cliente.active }),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(null)
    }
  }

  async function updatePlan() {
    setLoading('plan')
    try {
      const res = await fetch(`/api/admin/clientes/${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (res.ok) {
        setMessage('Plano atualizado!')
        setTimeout(() => setMessage(''), 3000)
        router.refresh()
      }
    } finally {
      setLoading(null)
    }
  }

  async function deleteCliente() {
    if (deleteConfirm !== cliente.email) return
    setLoading('delete')
    try {
      const res = await fetch(`/api/admin/clientes/${cliente.id}`, { method: 'DELETE' })
      if (res.ok) router.push('/admin/clientes')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 rounded-lg text-sm text-green-700 bg-green-50 border border-green-200">{message}</div>
      )}

      {/* Alterar plano */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8EAF0' }}>
        <h4 className="font-semibold text-sm mb-3" style={{ color: '#1A1F36' }}>Alterar plano</h4>
        <select
          value={plan}
          onChange={e => setPlan(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border text-sm bg-white outline-none mb-2"
          style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
        >
          <option value="STARTER">Starter</option>
          <option value="PRO">Pro</option>
          <option value="AGENCIA">Agência</option>
        </select>
        <button
          onClick={updatePlan}
          disabled={loading === 'plan'}
          className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}
        >
          {loading === 'plan' ? 'Salvando...' : 'Atualizar plano'}
        </button>
      </div>

      {/* Gerenciar créditos */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8EAF0' }}>
        <h4 className="font-semibold text-sm mb-3" style={{ color: '#1A1F36' }}>Gerenciar créditos</h4>
        <p className="text-xs text-gray-400 mb-3">Saldo atual: <span className="font-bold" style={{ color: '#1A1F36' }}>{credits}</span></p>
        <input
          type="number"
          value={addCredits}
          onChange={e => setAddCredits(parseInt(e.target.value) || 0)}
          placeholder="Quantidade a adicionar"
          min={0}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-2"
          style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => updateCredits('add')}
            disabled={loading === 'credits' || addCredits <= 0}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}
          >
            {loading === 'credits' ? 'Salvando...' : 'Adicionar'}
          </button>
          <button
            onClick={() => updateCredits('zero')}
            disabled={loading === 'credits'}
            className="py-2 px-3 rounded-lg text-sm font-medium border text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            Zerar
          </button>
        </div>
      </div>

      {/* Pausar/Ativar conta */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8EAF0' }}>
        <h4 className="font-semibold text-sm mb-3" style={{ color: '#1A1F36' }}>Status da conta</h4>
        <button
          onClick={toggleActive}
          disabled={loading === 'active'}
          className="w-full py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-60"
          style={{
            borderColor: cliente.active ? '#FCA5A5' : '#86EFAC',
            color: cliente.active ? '#DC2626' : '#16A34A',
            backgroundColor: cliente.active ? '#FEF2F2' : '#F0FDF4',
          }}
        >
          {loading === 'active' ? 'Atualizando...' : (cliente.active ? 'Pausar conta' : 'Reativar conta')}
        </button>
      </div>

      {/* Excluir conta */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#FCA5A5' }}>
        <h4 className="font-semibold text-sm mb-3 text-red-600">Zona de perigo</h4>
        <p className="text-xs text-gray-400 mb-2">Para excluir, digite o email do cliente:</p>
        <p className="text-xs font-mono mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#F7F8FC', color: '#1A1F36' }}>{cliente.email}</p>
        <input
          type="email"
          value={deleteConfirm}
          onChange={e => setDeleteConfirm(e.target.value)}
          placeholder="Digite o email para confirmar"
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-2"
          style={{ borderColor: '#FCA5A5', color: '#1A1F36' }}
        />
        <button
          onClick={deleteCliente}
          disabled={loading === 'delete' || deleteConfirm !== cliente.email}
          className="w-full py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 transition-colors"
        >
          {loading === 'delete' ? 'Excluindo...' : 'Excluir conta permanentemente'}
        </button>
      </div>
    </div>
  )
}
