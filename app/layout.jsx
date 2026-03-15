import Navbar from '@/components/Navbar'
export const metadata = { title: 'BarberPro — Sistema de Fidelización' }
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#080706', color: '#e8dfc8', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px' }}>
          {children}
        </main>
        <style>{`* { box-sizing: border-box; } a { text-decoration: none; } input::placeholder { color: #3a3020; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #080706; } ::-webkit-scrollbar-thumb { background: #2a2010; border-radius: 3px; }`}</style>
      </body>
    </html>
  )
}
