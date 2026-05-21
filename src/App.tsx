import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import NuevoReporte from './pages/NuevoReporte'
import MisReportes from './pages/MisReportes'
import Admin from './pages/Admin'
import Mapa from './pages/Mapa'

type Page = 'home' | 'nuevo-reporte' | 'mis-reportes' | 'admin'

function App() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  if (!session) return <Login />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="pb-20">
        {page === 'home' && <Mapa />}
        {page === 'nuevo-reporte' && <NuevoReporte />}
        {page === 'mis-reportes' && <MisReportes />}
        {page === 'admin' && <Admin />}
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
        {profile?.role === 'admin' && (
          <button
            onClick={() => setPage('admin')}
            className={`flex-1 py-4 text-sm font-medium transition ${page === 'admin' ? 'text-orange-500' : 'text-gray-400'}`}
          >
            ⚙️ Admin
          </button>
        )}
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