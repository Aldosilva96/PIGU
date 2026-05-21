import { supabase } from '../lib/supabase'

type Props = {
  profile: any
  session: any
  onAdmin: () => void
  onMisReportes: () => void
}

export default function Perfil({ profile, session, onAdmin, onMisReportes }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Perfil</h2>

      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
            {(profile?.full_name || session?.user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium text-lg">{profile?.full_name || 'Sin nombre'}</p>
            <p className="text-gray-400 text-sm">{session?.user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${profile?.verified ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {profile?.verified ? '✓ Verificado' : 'Sin verificar'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onMisReportes}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg text-left px-4 transition"
          >
            📋 Mis reportes
          </button>

          {profile?.role === 'admin' && (
            <button
              onClick={onAdmin}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg text-left px-4 transition"
            >
              ⚙️ Panel Admin
            </button>
          )}

          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full bg-red-900 hover:bg-red-800 text-red-300 py-3 rounded-lg text-left px-4 transition"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}