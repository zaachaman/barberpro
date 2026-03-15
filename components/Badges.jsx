// EstadoBadge.jsx
export function EstadoBadge({ dias }) {
  const st =
    dias <= 25
      ? { label: 'Activo', color: '#4ade80', bg: '#052e16', border: '#166534' }
      : dias <= 50
      ? { label: 'Recordar', color: '#fbbf24', bg: '#1c1400', border: '#854d0e' }
      : { label: 'Perdido', color: '#f87171', bg: '#1c0000', border: '#991b1b' }
  return (
    <span style={{
      background: st.bg, color: st.color, border: `1px solid ${st.border}`,
      padding: '3px 11px', borderRadius: 20, fontSize: 11,
      fontFamily: 'Georgia, serif',
    }}>{st.label}</span>
  )
}

// NivelBadge.jsx
export function NivelBadge({ nivel }) {
  const colores = {
    bronce:  '#cd7f32',
    plata:   '#c0c0c0',
    oro:     '#c9a84c',
    platino: '#e5e4e2',
  }
  const color = colores[nivel] || '#c9a84c'
  return (
    <span style={{
      color, border: `1px solid ${color}44`,
      background: `${color}12`,
      padding: '3px 11px', borderRadius: 20, fontSize: 11,
      fontFamily: 'Georgia, serif', textTransform: 'capitalize',
    }}>{nivel}</span>
  )
}
