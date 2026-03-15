'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/')
    })
  }, [router])

  const handleLogin = async () => {
    if (!email || !password) return setError('Completa todos los campos')
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48 }}>✂</div>
          <h1 style={{ color: '#c9a84c', fontWeight: 400, fontSize: 24, margin: '8px 0 0' }}>BARBERPRO</h1>
          <p style={{ color: '#5a4f35', fontSize: 13, marginTop: 6 }}>Sistema de Fidelización</p>
        </div>
        <div style={{ background: '#111009', border: '1px solid #1e1a10', borderRadius: 14, padding: 28 }}>
          {error && <div style={{ background: '#1c0000', border: '1px solid #991b1b', color: '#f87171', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 18 }}>{error}</div>}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#c9a84c', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '11px 14px', background: '#0a0907', border: '1px solid #1e1a10', borderRadius: 7, color: '#e8dfc8', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#c9a84c', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '11px 14px', background: '#0a0907', border: '1px solid #1e1a10', borderRadius: 7, color: '#e8dfc8', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 8, background: loading ? '#5a4f35' : 'linear-gradient(135deg,#c9a84c,#8b6914)', border: 'none', color: '#0a0a0a', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontFamily: 'inherit' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
