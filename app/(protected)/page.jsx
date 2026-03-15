'use client'
import { useEffect, useState } from 'react'
import { getClientes } from '@/lib/supabase'
import Leaderboard from '@/components/Leaderboard'
import Toast from '@/components/Toast'

const gold = '#c9a84c'
const border = '#1e1a10'
const muted = '#5a4f35'

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => { getClientes().then(setClientes) }, [])

  const recordar = clientes.filter(c => { const d = c.dias_sin_visita; return d > 25 && d <= 50 })
  const perdidos = clientes.filter(c => c.dias_sin_visita > 50)
  const activos  = clientes.filter(c => c.dias_sin_visita <= 25)
  const conDescuento = clientes.filter(c => c.descuento > 0)

  const Stat = ({ label, value, color }) => (
    <div style={{ background: '#111009', border: `1px solid ${border}`, borderTop: `2px solid ${color}`, borderRadius: 10, padding: '18px 22px' }}>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: 'Georgia, serif' }}>{value}</div>
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <h1 style={{ fontSize: 26, fontWeight: 400, color: gold, marginBottom: 4 }}>Panel Principal</h1>
      <p style={{ color: muted, fontSize: 13, marginBottom: 28 }}>
        {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        <Stat label="Total clientes" value={clientes.length} color={gold} />
        <Stat label="Activos" value={activos.length} color="#4ade80" />
        <Stat label="Necesitan recordatorio" value={recordar.length} color="#fbbf24" />
        <Stat label="Clientes perdidos" value={perdidos.length} color="#f87171" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>🔔 Enviar recordatorio hoy</div>
          {recordar.length === 0
            ? <div style={{ color: muted, fontSize: 13 }}>Sin recordatorios pendientes ✓</div>
            : recordar.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ fontSize: 14, color: '#e8dfc8' }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: muted }}>{c.dias_sin_visita} días · {c.puntos} pts</div>
                </div>
                <button onClick={() => setToast({ msg: `📧 Email enviado a ${c.email}`, type: 'ok' })}
                  style={{ background: '#1c1400', border: '1px solid #854d0e', color: '#fbbf24', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  Enviar
                </button>
              </div>
            ))
          }
        </div>

        <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>⚠ Clientes perdidos (+50 días)</div>
          {perdidos.length === 0
            ? <div style={{ color: muted, fontSize: 13 }}>¡Sin clientes perdidos! 🎉</div>
            : perdidos.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ fontSize: 14, color: '#e8dfc8' }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: muted }}>{c.dias_sin_visita} días · {c.total_visitas} cortes</div>
                </div>
                <button onClick={() => setToast({ msg: `📧 Email de rescate enviado a ${c.email}`, type: 'ok' })}
                  style={{ background: '#1c0000', border: '1px solid #991b1b', color: '#f87171', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  Rescatar
                </button>
              </div>
            ))
          }
        </div>
      </div>

      {conDescuento.length > 0 && (
        <div style={{ background: '#111009', border: '1px solid #166534', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>🎁 Descuentos activos — aplicar en próxima visita</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {conDescuento.map(c => (
              <div key={c.id} style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '10px 16px' }}>
                <div style={{ fontSize: 13, color: '#e8dfc8' }}>{c.nombre}</div>
                <div style={{ fontSize: 12, color: '#4ade80', marginTop: 2 }}>{c.descuento}% OFF · {c.puntos} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Leaderboard clientes={clientes} />
    </div>
  )
}
