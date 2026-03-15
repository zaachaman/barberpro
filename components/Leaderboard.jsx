'use client'

const coloresNivel = {
  bronce:  '#cd7f32',
  plata:   '#c0c0c0',
  oro:     '#c9a84c',
  platino: '#e5e4e2',
}

export default function Leaderboard({ clientes }) {
  const top = [...clientes].sort((a, b) => b.puntos - a.puntos).slice(0, 10)

  return (
    <div style={{ background: '#111009', border: '1px solid #1e1a10', borderRadius: 12, padding: 20, fontFamily: 'Georgia, serif' }}>
      <div style={{ fontSize: 12, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        🏆 Top Clientes por Puntos
      </div>
      {top.map((c, i) => {
        const color = coloresNivel[c.nivel] || '#c9a84c'
        return (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: '1px solid #1e1a10',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < 3 ? `${color}22` : '#1a1408',
              border: `1px solid ${i < 3 ? color : '#2a2010'}`,
              color: i < 3 ? color : '#5a4f35',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#e8dfc8' }}>{c.nombre}</div>
              <div style={{ fontSize: 11, color: '#5a4f35', marginTop: 2, textTransform: 'capitalize' }}>{c.nivel} · {c.total_visitas || 0} cortes</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color }}>{c.puntos}</div>
              <div style={{ fontSize: 10, color: '#5a4f35' }}>pts</div>
            </div>
          </div>
        )
      })}
      {top.length === 0 && (
        <div style={{ color: '#5a4f35', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Sin clientes aún
        </div>
      )}
    </div>
  )
}
