'use client'

interface CreditCounterProps {
  credits: number
  plan: string
}

const planMaxCredits: Record<string, number> = {
  STARTER: 60,
  PRO: 200,
  AGENCIA: 700,
}

const planLabels: Record<string, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  AGENCIA: 'Agência',
}

export function CreditCounter({ credits, plan }: CreditCounterProps) {
  const max = planMaxCredits[plan] || 60
  const percentage = Math.min((credits / max) * 100, 100)
  const isLow = credits < 10

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Créditos disponíveis</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold" style={{ color: '#1A1F36' }}>{credits}</span>
            <span className="text-gray-400 text-sm">/ {max}</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{
          background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)',
        }}>
          {planLabels[plan] || plan}
        </div>
      </div>

      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0F0F5' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isLow
              ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
              : 'linear-gradient(90deg, #7B2FFF, #00E5FF)',
          }}
        />
      </div>

      {isLow && (
        <div className="mt-3 p-2.5 rounded-lg text-xs font-medium" style={{
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FDE68A',
        }}>
          Atenção: seus créditos estão acabando. Entre em contato para recarregar.
        </div>
      )}
    </div>
  )
}
