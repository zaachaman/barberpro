'use client'
import { useEffect } from 'react'

export default function Toast({ message, type = 'ok', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', top: 70, right: 20, zIndex: 999,
      background: type === 'err' ? '#1c0000' : '#052e16',
      border: `1px solid ${type === 'err' ? '#f87171' : '#4ade80'}`,
      color: type === 'err' ? '#f87171' : '#4ade80',
      padding: '11px 18px', borderRadius: 8, fontSize: 13,
      boxShadow: '0 8px 30px rgba(0,0,0,0.6)', maxWidth: 320,
      fontFamily: 'Georgia, serif',
    }}>{message}</div>
  )
}
