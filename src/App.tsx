import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import NuevoReporte from './pages/NuevoReporte'
import MisReportes from './pages/MisReportes'
import Admin from './pages/Admin'
import Mapa from './pages/Mapa'
import Perfil from './pages/Perfil'

type Page = 'home' | 'nuevo-reporte' | 'mis-reportes' | 'admin' | 'perfil'

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
        {page === 'perfil' && (
          <Perfil
            profile={profile}
            session={session}
          onAdmin={() => setPage('admin')}
          onMisReportes={() => setPage('mis-reportes')}  
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex">
        <button
          onClick={() => setPage('home')}
          className={`flex-1 py-4 text-sm font-medium transition flex flex-col items-center gap-1 ${page === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🗺️</span>
          <span className="text-xs">Mapa</span>
        </button>
        <button
          onClick={() => setPage('nuevo-reporte')}
          className="flex-1 py-2 flex flex-col items-center justify-center"
        >
          <div className="bg-orange-500 hover:bg-orange-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg transition">
            📸
          </div>
        </button>
        <button
          onClick={() => setPage('perfil')}
          className={`flex-1 py-4 text-sm font-medium transition flex flex-col items-center gap-1 ${page === 'perfil' || page === 'admin' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">👤</span>
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  )
}

export default App