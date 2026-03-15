const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function enviarEmail({ to, subject, html }) {
  await fetch(`${SUPABASE_URL}/functions/v1/enviar-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ to, subject, html }),
  })
}

export async function enviarBienvenida(cliente) {
  await enviarEmail({
    to: cliente.email,
    subject: '✂️ Bienvenido a BarberPro',
    html: `<div style="font-family:Georgia,serif;padding:40px;background:#080706;color:#e8dfc8;border-radius:12px"><h1 style="color:#c9a84c;font-weight:400">✂ BarberPro</h1><h2 style="font-weight:400">Bienvenido, ${cliente.nombre}!</h2><p style="color:#8a7a5a;line-height:1.7">Ya eres parte del programa. Cada corte suma 100 puntos.</p><div style="background:#1a1408;border:1px solid #c9a84c44;border-radius:8px;padding:20px;margin:24px 0"><p style="color:#c9a84c;margin:0 0 8px">Tus recompensas:</p><p style="color:#8a7a5a;line-height:2;margin:0">🏷️ 500 pts → 10% descuento<br/>✂️ 1,000 pts → corte gratis<br/>⭐ 2,000 pts → 20% permanente</p></div><p style="color:#8a7a5a">Tu código de referido: <strong style="color:#c9a84c">${cliente.codigo_referido}</strong></p></div>`,
  })
}

export async function enviarRecordatorio30(cliente) {
  await enviarEmail({
    to: cliente.email,
    subject: '✂️ Ya es hora de tu próximo corte',
    html: `<div style="font-family:Georgia,serif;padding:40px;background:#080706;color:#e8dfc8;border-radius:12px"><h1 style="color:#c9a84c;font-weight:400">✂ BarberPro</h1><h2 style="font-weight:400">Hola ${cliente.nombre},</h2><p style="color:#8a7a5a;line-height:1.7">Ya pasó un mes desde tu último corte. Tu imagen te está esperando.</p><p style="color:#8a7a5a">Tienes <strong style="color:#c9a84c">${cliente.puntos} puntos</strong> acumulados · Nivel ${cliente.nivel}</p></div>`,
  })
}

export async function enviarRecordatorio60(cliente) {
  await enviarEmail({
    to: cliente.email,
    subject: '💈 Te extrañamos — 15% OFF esta semana',
    html: `<div style="font-family:Georgia,serif;padding:40px;background:#080706;color:#e8dfc8;border-radius:12px"><h1 style="color:#c9a84c;font-weight:400">✂ BarberPro</h1><h2 style="font-weight:400">${cliente.nombre}, te extrañamos.</h2><p style="color:#8a7a5a;line-height:1.7">Hace 2 meses que no te vemos. Esta semana tienes <strong style="color:#4ade80">15% OFF</strong> por volver.</p><p style="color:#8a7a5a">Tienes <strong style="color:#c9a84c">${cliente.puntos} puntos</strong> esperándote.</p></div>`,
  })
}

export async function enviarSubidaNivel(cliente, nivelNuevo) {
  const emojis = { plata: '🥈', oro: '🥇', platino: '💎' }
  await enviarEmail({
    to: cliente.email,
    subject: `${emojis[nivelNuevo]} ¡Subiste al nivel ${nivelNuevo}!`,
    html: `<div style="font-family:Georgia,serif;padding:40px;background:#080706;color:#e8dfc8;border-radius:12px;text-align:center"><div style="font-size:64px">${emojis[nivelNuevo]}</div><h2 style="color:#c9a84c;font-weight:400;text-transform:capitalize">¡Nivel ${nivelNuevo}!</h2><p style="color:#8a7a5a">Felicidades ${cliente.nombre}, tu lealtad tiene recompensa.</p></div>`,
  })
}
