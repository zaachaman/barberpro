'use client'
import { useState } from 'react'
import { EstadoBadge, NivelBadge } from './Badges'
import { registrarCorte, getHistorial } from '@/lib/supabase'
import { enviarRecordatorio30, enviarRecordatorio60 } from '@/lib/emails'
import { progresoPorcentaje, puntosParaSiguienteNivel, RECOMPENSAS_CATALOGO } from '@/lib/puntos'

const gold = '#c9a84c'
const border = '#1e1a10'
const muted = '#5a4f35'

export default function ClienteCard({ cliente, onUpdate, onToast }) {
  const [open, setOpen] = useState(false)
  const [historial, setHistorial] = useState(null)
  const [confirmar, setConfirmar] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const dias = cliente.dias_sin_visita || 0
  const colorNivel = { bronce: '#cd7f32', plata: '#c0c0c0', oro: '#c9a84c', platino: '#e5e4e2' }[cliente.nivel] || gold
  const progreso = progresoPorcentaje(cliente.puntos)
  const faltanPts = puntosParaSiguienteNivel(cliente.puntos)
  const proximaRecompensa = RECOMPENSAS_CATALOGO.find(r => r.puntos > cliente.puntos)

  const handleCorte = async () => {
    try {
      const { nuevoNivel } = await registrarCorte(cliente.id, cliente.puntos, cliente.descuento)
      const subioNivel = nuevoNivel !== cliente.nivel
      const msg = subioNivel
        ? `🎉 ¡${cliente.nombre} subió a nivel ${nuevoNivel}!`
        : `✂️ Corte registrado · +100 puntos para ${cliente.nombre}`
      onToast(msg)
      setConfirmar(false)
      setOpen(false)
      await onUpdate()
    } catch (e) {
      onToast('Error al registrar corte', 'err')
    }
  }

  const handleRecordatorio = async () => {
    setEnviando(true)
    try {
      if (dias > 50) {
        await enviarRecordatorio60(cliente)
      } else {
        await enviarRecordatorio30(cliente)
      }
      onToast(`📧 Email enviado a ${cliente.email}`)
    } catch (e) {
      onToast('Error enviando email', 'err')
    }
    setEnviando(false)
  }

  const handleHistorial = async () => {
    if (historial) { setHistorial(null); return }
    const data = await getHistorial(cliente.id)
    setHistorial(data)
  }

  return (
    <>
      <div style={{
        background: '#111009',
        border: `1px solid ${open ? gold + '44' : border}`,
        borderLeft: `3px solid ${dias <= 25 ? '#4ade80' : dias <= 50 ? '#fbbf24' : '#f87171'}`,
        borderRadius: 10, marginBottom: 8, overflow: 'hidden',
        fontFamily: 'Georgia, serif',
      }}>
        <div onClick={() => setOpen(!open)} style={{
          padding: '14px 18px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
              background: `${colorNivel}18`, border: `1px solid ${colorNivel}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colorNivel, fontWeight: 700, fontSize: 16,
            }}>{cliente.nombre[0]}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#e8dfc8' }}>{cliente.nombre}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                {cliente.email} · {cliente.total_visitas || 0} cortes · <span style={{ color: gold }}>{cliente.codigo_referido}</span>
              </div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 4, background: '#1e1a10', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${progreso}%`, height: '100%', background: colorNivel, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 10, color: muted }}>{cliente.puntos} pts{faltanPts ? ` · faltan ${faltanPts}` : ''}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {cliente.descuento > 0 && (
              <span style={{ background: '#052e16', border: '1px solid #166534', color: '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>
                🎁 {cliente.descuento}% OFF
              </span>
            )}
            <NivelBadge nivel={cliente.nivel} />
            <div style={{ textAlign: 'right', marginLeft: 4 }}>
              <div style={{ marginBottom: 3 }}><EstadoBadge dias={dias} /></div>
              <div style={{ fontSize: 11, color: muted }}>hace {dias} días</div>
            </div>
          </div>
        </div>

        {open && (
          <div style={{ padding: '14px 18px', background: '#0e0c08', borderTop: `1px solid ${border}` }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <button onClick={() => setConfirmar(true)} style={{
                flex: 1, padding: 11, borderRadius: 7,
                background: 'linear-gradient(135deg,#c9a84c,#8b6914)',
                border: 'none', color: '#0a0a0a', fontWeight: 700,
                cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              }}>✂ Registrar corte hoy</button>
              <button onClick={handleRecordatorio} disabled={enviando} style={{
                flex: 1, padding: 11, borderRadius: 7, background: '#1a1408',
                border: `1px solid ${gold}44`, color: gold,
                cursor: enviando ? 'not-allowed' : 'pointer',
                fontSize: 13, fontFamily: 'inherit',
              }}>{enviando ? 'Enviando...' : '📧 Enviar recordatorio'}</button>
              <button onClick={handleHistorial} style={{
                padding: '11px 14px', borderRadius: 7, background: '#1a1408',
                border: `1px solid ${border}`, color: muted,
                cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              }}>📋 Historial</button>
            </div>

            {proximaRecompensa && (
              <div style={{ background: '#1a1408', border: `1px solid ${gold}22`, borderRadius: 8, padding: '10px 14px', fontSize: 12, color: muted }}>
                Próxima recompensa: <span style={{ color: gold }}>{proximaRecompensa.icono} {proximaRecompensa.titulo}</span> · faltan <span style={{ color: gold }}>{proximaRecompensa.puntos - cliente.puntos} pts</span>
              </div>
            )}

            {historial && (
              <div style={{ marginTop: 12, background: '#111009', border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, color: gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Historial de visitas</div>
                {historial.map((v, i) => (
                  <div key={v.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${border}` }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? gold : muted, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: '#e8dfc8', flex: 1 }}>
                      {new Date(v.fecha).toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 11, color: '#4ade80' }}>+{v.puntos_ganados} pts</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {confirmar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#111009', border: `1px solid ${gold}44`, borderRadius: 16, padding: 32, maxWidth: 340, width: '90%', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✂</div>
            <h3 style={{ color: gold, fontWeight: 400, marginBottom: 8 }}>¿Confirmar corte?</h3>
            <p style={{ color: muted, fontSize: 14, marginBottom: 4 }}>
              Registrar visita de hoy para <span style={{ color: '#e8dfc8' }}>{cliente.nombre}</span>
            </p>
            <p style={{ color: '#4ade80', fontSize: 13, marginBottom: 4 }}>+100 puntos · Total: {cliente.puntos + 100} pts</p>
            {cliente.descuento > 0 && <p style={{ color: '#4ade80', fontSize: 13 }}>🎁 Aplicar {cliente.descuento}% de descuento</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setConfirmar(false)} style={{ flex: 1, padding: 11, borderRadius: 7, background: '#1a1408', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
              <button onClick={handleCorte} style={{ flex: 1, padding: 11, borderRadius: 7, background: `linear-gradient(135deg,${gold},#8b6914)`, border: 'none', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
