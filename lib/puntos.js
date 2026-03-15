// ─── NIVELES ─────────────────────────────────────────────────────

export const NIVELES = {
  bronce:  { min: 0,    max: 499,  color: '#cd7f32', label: 'Bronce',  siguiente: 'Plata' },
  plata:   { min: 500,  max: 999,  color: '#c0c0c0', label: 'Plata',   siguiente: 'Oro' },
  oro:     { min: 1000, max: 1999, color: '#c9a84c', label: 'Oro',     siguiente: 'Platino' },
  platino: { min: 2000, max: null, color: '#e5e4e2', label: 'Platino', siguiente: null },
}

export function calcularNivel(puntos) {
  if (puntos >= 2000) return 'platino'
  if (puntos >= 1000) return 'oro'
  if (puntos >= 500)  return 'plata'
  return 'bronce'
}

export function puntosParaSiguienteNivel(puntos) {
  if (puntos >= 2000) return null
  if (puntos >= 1000) return 2000 - puntos
  if (puntos >= 500)  return 1000 - puntos
  return 500 - puntos
}

export function progresoPorcentaje(puntos) {
  if (puntos >= 2000) return 100
  if (puntos >= 1000) return ((puntos - 1000) / 1000) * 100
  if (puntos >= 500)  return ((puntos - 500) / 500) * 100
  return (puntos / 500) * 100
}

// ─── RECOMPENSAS DISPONIBLES ──────────────────────────────────────

export const RECOMPENSAS_CATALOGO = [
  {
    id: 'descuento10',
    puntos: 500,
    titulo: '10% de descuento',
    descripcion: 'En tu próximo corte',
    icono: '🏷️',
  },
  {
    id: 'corte_gratis',
    puntos: 1000,
    titulo: 'Corte gratis',
    descripcion: '1 corte completamente gratis',
    icono: '✂️',
  },
  {
    id: 'descuento20',
    puntos: 2000,
    titulo: '20% permanente',
    descripcion: 'Descuento fijo en todos tus cortes',
    icono: '⭐',
  },
]

// ─── RACHA ───────────────────────────────────────────────────────

export function calcularRacha(visitas) {
  if (!visitas || visitas.length === 0) return 0
  let racha = 1
  for (let i = 0; i < visitas.length - 1; i++) {
    const actual = new Date(visitas[i].fecha)
    const anterior = new Date(visitas[i + 1].fecha)
    const diff = (actual - anterior) / (1000 * 60 * 60 * 24)
    if (diff <= 45) racha++
    else break
  }
  return racha
}
