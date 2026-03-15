import { createClient } from '@supabase/supabase-js'
import { calcularNivel } from './puntos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getClientes() {
  const { data, error } = await supabase
    .from('clientes_con_stats')
    .select('*')
    .order('puntos', { ascending: false })
  if (error) throw error
  return data
}

export async function registrarCliente({ nombre, email, telefono, codigoReferido }) {
  const codigo = nombre.split(' ')[0].toUpperCase().slice(0, 6) + '-' + Math.random().toString(36).substring(2, 5).toUpperCase()
  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert({ nombre, email, telefono, codigo_referido: codigo, referido_por: codigoReferido || null })
    .select().single()
  if (error) throw error
  await supabase.from('visitas').insert({ cliente_id: cliente.id })
  if (codigoReferido) {
    const { data: referidor } = await supabase
      .from('clientes').select('id, puntos, descuento')
      .eq('codigo_referido', codigoReferido.toUpperCase()).single()
    if (referidor) {
      const nuevosPuntos = (referidor.puntos || 0) + 100
      await supabase.from('clientes')
        .update({ puntos: nuevosPuntos, nivel: calcularNivel(nuevosPuntos), descuento: (referidor.descuento || 0) + 15 })
        .eq('id', referidor.id)
    }
  }
  return cliente
}

export async function registrarCorte(clienteId, puntosActuales, descuentoActual) {
  const nuevosPuntos = (puntosActuales || 0) + 100
  const nuevoNivel = calcularNivel(nuevosPuntos)
  await supabase.from('visitas').insert({ cliente_id: clienteId, descuento_aplicado: descuentoActual || 0 })
  await supabase.from('clientes')
    .update({ puntos: nuevosPuntos, puntos_totales: nuevosPuntos, nivel: nuevoNivel, descuento: 0 })
    .eq('id', clienteId)
  return { nuevosPuntos, nuevoNivel }
}

export async function getHistorial(clienteId) {
  const { data } = await supabase
    .from('visitas').select('*')
    .eq('cliente_id', clienteId)
    .order('fecha', { ascending: false })
  return data
}

export async function getRecompensas(clienteId) {
  const { data } = await supabase
    .from('recompensas').select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
  return data
}

export async function canjearRecompensa(clienteId, tipo, puntosCosto, puntosActuales) {
  if (puntosActuales < puntosCosto) throw new Error('Puntos insuficientes')
  const descripciones = {
    descuento10: '10% de descuento en tu próximo corte',
    corte_gratis: '1 corte completamente gratis',
    descuento20: '20% de descuento permanente',
  }
  await supabase.from('recompensas').insert({
    cliente_id: clienteId, tipo, descripcion: descripciones[tipo],
    puntos_costo: puntosCosto, canjeada: false,
  })
  const nuevosPuntos = puntosActuales - puntosCosto
  const descuento = tipo === 'descuento20' ? 20 : tipo === 'descuento10' ? 10 : 0
  await supabase.from('clientes')
    .update({ puntos: nuevosPuntos, nivel: calcularNivel(nuevosPuntos), descuento })
    .eq('id', clienteId)
}
