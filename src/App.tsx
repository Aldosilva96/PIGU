import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import NuevoReporte from './pages/NuevoReporte'
import MisReportes from './pages/MisReportes'

type Page = 'home' | 'nuevo-reporte' | 'mis-reportes'

function App() {
  const [session, setSession] = useState<any>(null)
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) return <Login />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="pb-20">
        {page === 'home' && (
          <div className="p-4">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">Pigu</h1>
            <p className="text-gray-400">Bienvenido, {session.user.email}</p>
            <p className="text-gray-600 mt-8 text-center">Mapa próximamente...</p>
          </div>
        )}
        {page === 'nuevo-reporte' && <NuevoReporte />}
        {page === 'mis-reportes' && <MisReportes />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex">
        <button
          onClick={() => setPage('home')}
          className={`flex-1 py-4 text-sm font-medium transition ${page === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          🗺️ Mapa
        </button>
        <button
          onClick={() => setPage('nuevo-reporte')}
          className={`flex-1 py-4 text-sm font-medium transition ${page === 'nuevo-reporte' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          📸 Reportar
        </button>
        <button
          onClick={() => setPage('mis-reportes')}
          className={`flex-1 py-4 text-sm font-medium transition ${page === 'mis-reportes' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          📋 Mis reportes
        </button>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex-1 py-4 text-sm font-medium text-gray-400"
        >
          🚪 Salir
        </button>
      </div>
    </div>
  )
}

export default App