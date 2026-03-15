'use client'
import { useEffect, useState } from 'react'
import { getClientes, canjearRecompensa } from '@/lib/supabase'
import { RECOMPENSAS_CATALOGO } from '@/lib/puntos'
import Toast from '@/components/Toast'
import { NivelBadge } from '@/components/Badges'

const gold = '#c9a84c'
const border = '#1e1a10'
const muted = '#5a4f35'

export default function Recompensas() {
  const [clientes, setClientes] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => { getClientes().then(setClientes) }, [])

  const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()))

  const handleCanjear = async (cliente, recompensa) => {
    if (cliente.puntos < recompensa.puntos) return setToast({ msg: `Faltan ${recompensa.puntos - cliente.puntos} puntos`, type: 'err' })
    try {
      await canjearRecompensa(cliente.id, recompensa.id, recompensa.puntos, cliente.puntos)
      setToast({ msg: `${recompensa.icono} Recompensa canjeada para ${cliente.nombre}`, type: 'ok' })
      const updated = await getClientes()
      setClientes(updated)
      setSeleccionado(updated.find(c => c.id === cliente.id))
    } catch (e) {
      setToast({ msg: e.message, type: 'err' })
    }
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <h1 style={{ fontSize: 24, fontWeight: 400, color: gold, marginBottom: 6 }}>Recompensas</h1>
      <p style={{ color: muted, fontSize: 13, marginBottom: 24 }}>Selecciona un cliente para ver y canjear sus recompensas disponibles.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Lista clientes */}
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
            style={{ width: '100%', background: '#111009', border: `1px solid ${border}`, color: '#e8dfc8', padding: '9px 14px', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', outline: 'none', marginBottom: 12 }}
            onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border}
          />
          <div style={{ display: 'grid', gap: 8 }}>
            {filtrados.map(c => (
              <div key={c.id} onClick={() => setSeleccionado(c)} style={{
                background: seleccionado?.id === c.id ? '#1a1408' : '#111009',
                border: `1px solid ${seleccionado?.id === c.id ? gold + '44' : border}`,
                borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 14, color: '#e8dfc8' }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{c.puntos} puntos disponibles</div>
                </div>
                <NivelBadge nivel={c.nivel} />
              </div>
            ))}
          </div>
        </div>

        {/* Panel recompensas */}
        <div>
          {!seleccionado
            ? (
              <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                <div style={{ color: muted, fontSize: 14 }}>Selecciona un cliente para ver sus recompensas</div>
              </div>
            )
            : (
              <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, color: '#e8dfc8' }}>{seleccionado.nombre}</div>
                    <div style={{ fontSize: 12, color: muted }}>Nivel <span style={{ textTransform: 'capitalize' }}>{seleccionado.nivel}</span> · {seleccionado.total_visitas} cortes</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: gold }}>{seleccionado.puntos}</div>
                    <div style={{ fontSize: 11, color: muted }}>puntos disponibles</div>
                  </div>
                </div>

                {/* Barra de puntos */}
                <div style={{ marginBottom: 20 }}>
                  {RECOMPENSAS_CATALOGO.map((r, i) => {
                    const canjeada = seleccionado.puntos >= r.puntos
                    return (
                      <div key={r.id} style={{
                        background: canjeada ? '#052e16' : '#0e0c08',
                        border: `1px solid ${canjeada ? '#166534' : border}`,
                        borderRadius: 10, padding: '14px 16px', marginBottom: 10,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ fontSize: 28 }}>{r.icono}</div>
                          <div>
                            <div style={{ fontSize: 14, color: canjeada ? '#4ade80' : '#e8dfc8' }}>{r.titulo}</div>
                            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{r.descripcion} · {r.puntos} pts</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCanjear(seleccionado, r)}
                          disabled={!canjeada}
                          style={{
                            padding: '8px 14px', borderRadius: 7,
                            background: canjeada ? 'linear-gradient(135deg,#c9a84c,#8b6914)' : '#1a1408',
                            border: `1px solid ${canjeada ? 'transparent' : border}`,
                            color: canjeada ? '#0a0a0a' : muted,
                            cursor: canjeada ? 'pointer' : 'not-allowed',
                            fontWeight: canjeada ? 700 : 400,
                            fontSize: 12, fontFamily: 'inherit',
                          }}>
                          {canjeada ? 'Canjear' : `Faltan ${r.puntos - seleccionado.puntos}`}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
