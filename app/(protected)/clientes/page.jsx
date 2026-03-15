'use client'
import { useEffect, useState, useCallback } from 'react'
import { getClientes } from '@/lib/supabase'
import ClienteCard from '@/components/ClienteCard'
import Toast from '@/components/Toast'

const gold = '#c9a84c'
const border = '#1e1a10'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [toast, setToast] = useState(null)

  const cargar = useCallback(() => getClientes().then(setClientes), [])
  useEffect(() => { cargar() }, [cargar])

  const filtrados = clientes.filter(c => {
    const coincide = c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.includes(search)
    if (!coincide) return false
    if (filtro === 'activos') return c.dias_sin_visita <= 25
    if (filtro === 'recordar') return c.dias_sin_visita > 25 && c.dias_sin_visita <= 50
    if (filtro === 'perdidos') return c.dias_sin_visita > 50
    return true
  })

  const FiltroBtn = ({ id, label, count }) => (
    <button onClick={() => setFiltro(id)} style={{
      padding: '7px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
      fontFamily: 'Georgia, serif', fontSize: 12,
      background: filtro === id ? '#c9a84c18' : 'transparent',
      color: filtro === id ? gold : '#5a4f35',
      borderBottom: `2px solid ${filtro === id ? gold : 'transparent'}`,
    }}>{label} {count !== undefined && <span style={{ opacity: 0.6 }}>({count})</span>}</button>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 400, color: gold, margin: 0 }}>Clientes ({clientes.length})</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
          style={{ background: '#111009', border: `1px solid ${border}`, color: '#e8dfc8', padding: '9px 14px', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 220 }}
          onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border}
        />
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <FiltroBtn id="todos" label="Todos" count={clientes.length} />
        <FiltroBtn id="activos" label="Activos" count={clientes.filter(c => c.dias_sin_visita <= 25).length} />
        <FiltroBtn id="recordar" label="Recordar" count={clientes.filter(c => c.dias_sin_visita > 25 && c.dias_sin_visita <= 50).length} />
        <FiltroBtn id="perdidos" label="Perdidos" count={clientes.filter(c => c.dias_sin_visita > 50).length} />
      </div>

      {filtrados.map(c => (
        <ClienteCard key={c.id} cliente={c} onUpdate={cargar} onToast={msg => setToast({ msg, type: 'ok' })} />
      ))}

      {filtrados.length === 0 && (
        <div style={{ textAlign: 'center', color: '#5a4f35', padding: '60px 0', fontSize: 14 }}>
          No se encontraron clientes
        </div>
      )}
    </div>
  )
}
