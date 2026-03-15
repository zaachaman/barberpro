'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/recompensas', label: 'Recompensas' },
    { href: '/registro', label: '+ Nuevo' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav style={{
      background: '#0c0a06', borderBottom: '1px solid #1e1a10',
      padding: '0 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 60,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, fontSize: 16, background: 'linear-gradient(135deg,#c9a84c,#8b6914)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✂</div>
        <div>
          <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', fontFamily: 'Georgia, serif' }}>BARBERPRO</span>
          <span style={{ color: '#5a4f35', fontSize: 10, marginLeft: 8, letterSpacing: '0.15em' }}>FIDELIZACIÓN</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding: '9px 16px', borderRadius: 6, textDecoration: 'none',
            fontFamily: 'Georgia, serif', fontSize: 13,
            background: path === l.href ? '#c9a84c18' : 'transparent',
            color: path === l.href ? '#c9a84c' : '#5a4f35',
            borderBottom: `2px solid ${path === l.href ? '#c9a84c' : 'transparent'}`,
          }}>{l.label}</Link>
        ))}
        <button onClick={handleLogout} style={{
          marginLeft: 8, padding: '7px 14px', borderRadius: 6,
          background: 'transparent', border: '1px solid #2a2010',
          color: '#5a4f35', cursor: 'pointer', fontSize: 12,
          fontFamily: 'Georgia, serif',
        }}>Salir</button>
      </div>
    </nav>
  )
}
