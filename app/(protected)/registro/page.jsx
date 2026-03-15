'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registrarCliente } from '@/lib/supabase'
import Toast from '@/components/Toast'

const gold = '#c9a84c'
const border = '#1e1a10'
const muted = '#5a4f35'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', refCode: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.email.trim()) return setToast({ msg: 'Nombre y email son requeridos', type: 'err' })
    setLoading(true)
    try {
      await registrarCliente({ nombre: form.nombre, email: form.email, telefono: form.telefono, codigoReferido: form.refCode || null })
      setToast({ msg: `✅ ${form.nombre} registrado · +100 puntos`, type: 'ok' })
      setTimeout(() => router.push('/clientes'), 1400)
    } catch (e) {
      setToast({ msg: e.message.includes('referido') ? 'Código de referido inválido' : 'Error al registrar cliente', type: 'err' })
    }
    setLoading(false)
  }

  const Field = ({ label, field, placeholder, type = 'text', hint }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11, color: gold, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', background: '#0a0907', border: `1px solid ${border}`, borderRadius: 7, color: '#e8dfc8', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border}
      />
      {hint && <div style={{ fontSize: 11, color: muted, marginTop: 5 }}>{hint}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'Georgia, serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <h1 style={{ fontSize: 24, fontWeight: 400, color: gold, marginBottom: 6 }}>Registrar nuevo cliente</h1>
      <p style={{ color: muted, fontSize: 13, marginBottom: 28 }}>Se registra el corte de hoy y comienza a acumular puntos automáticamente.</p>

      <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <Field label="Nombre completo" field="nombre" placeholder="Ej: Carlos Méndez" />
        <Field label="Email" field="email" type="email" placeholder="Ej: carlos@email.com" />
        <Field label="Teléfono (opcional)" field="telefono" placeholder="Ej: 502-5555-1234" />
        <Field label="Código de referido (opcional)" field="refCode" placeholder="Ej: CARLOS-A3X"
          hint="Si fue referido por otro cliente, ingresar su código" />

        {form.refCode.trim() && (
          <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '11px 14px', marginBottom: 18, fontSize: 13, color: '#4ade80' }}>
            🎁 Si el código es válido: el referidor gana <strong>15% OFF</strong> y este cliente inicia con <strong>10% OFF</strong>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: 14, borderRadius: 8,
          background: loading ? muted : `linear-gradient(135deg,${gold},#8b6914)`,
          border: 'none', color: '#0a0a0a', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontFamily: 'inherit',
        }}>
          {loading ? 'Registrando...' : '✂ Registrar primer corte · +100 pts'}
        </button>
      </div>

      {/* Info recompensas */}
      <div style={{ background: '#111009', border: `1px solid ${border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>✦ Sistema de puntos y recompensas</div>
        {[
          { pts: '100 pts', desc: 'por cada corte registrado' },
          { pts: '500 pts', desc: '→ 10% de descuento' },
          { pts: '1,000 pts', desc: '→ 1 corte gratis (~10 visitas)' },
          { pts: '2,000 pts', desc: '→ 20% permanente (~20 visitas)' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
            <div style={{ minWidth: 60, fontSize: 12, color: gold, fontWeight: 700 }}>{r.pts}</div>
            <div style={{ fontSize: 13, color: muted }}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
