import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { NovoClienteModal } from '@/components/NovoClienteModal'

interface SearchParams {
  busca?: string
  status?: string
  plano?: string
}

export default async function ClientesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { busca, status, plano } = params

  const where: any = { role: 'CLIENT' }
  if (busca) {
    where.OR = [
      { name: { contains: busca, mode: 'insensitive' } },
      { email: { contains: busca, mode: 'insensitive' } },
    ]
  }
  if (status === 'ativos') where.active = true
  if (status === 'pausados') where.active = false
  if (plano && ['STARTER', 'PRO', 'AGENCIA'].includes(plano.toUpperCase())) {
    where.plan = plano.toUpperCase()
  }

  const clientes = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { generations: true } } },
  })

  const planLabels: Record<string, string> = { STARTER: 'Starter', PRO: 'Pro', AGENCIA: 'Agência' }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>Clientes</h1>
          <p className="text-gray-500 mt-1">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} encontrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <NovoClienteModal />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-3 items-center" style={{ borderColor: '#E8EAF0' }}>
        <form className="flex flex-wrap gap-3 flex-1">
          <input
            name="busca"
            defaultValue={busca}
            placeholder="Buscar por nome ou email..."
            className="flex-1 min-w-48 px-4 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}
          />
          <select name="status" defaultValue={status || ''} className="px-4 py-2 rounded-lg border text-sm bg-white outline-none" style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}>
            <option value="">Todos os status</option>
            <option value="ativos">Ativos</option>
            <option value="pausados">Pausados</option>
          </select>
          <select name="plano" defaultValue={plano || ''} className="px-4 py-2 rounded-lg border text-sm bg-white outline-none" style={{ borderColor: '#E8EAF0', color: '#1A1F36' }}>
            <option value="">Todos os planos</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="AGENCIA">Agência</option>
          </select>
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)' }}>
            Filtrar
          </button>
        </form>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E8EAF0' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: '#E8EAF0', backgroundColor: '#F7F8FC' }}>
              {['Cliente', 'Plano', 'Créditos', 'Gerações', 'Status', 'Ações'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#E8EAF0' }}>
            {clientes.map(cliente => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{
                      background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
                    }}>
                      {cliente.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1A1F36' }}>{cliente.name}</p>
                      <p className="text-xs text-gray-400">{cliente.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-white" style={{
                    background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
                  }}>
                    {planLabels[cliente.plan] || cliente.plan}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-semibold ${cliente.credits < 10 ? 'text-amber-500' : ''}`} style={cliente.credits >= 10 ? { color: '#1A1F36' } : {}}>
                    {cliente.credits}
                  </span>
                  {cliente.credits < 10 && <span className="ml-1 text-xs text-amber-400">baixo</span>}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{cliente._count.generations}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cliente.active ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>
                    {cliente.active ? 'Ativo' : 'Pausado'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/clientes/${cliente.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-purple-300"
                    style={{ borderColor: '#E8EAF0', color: '#7B2FFF' }}
                  >
                    Gerenciar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
