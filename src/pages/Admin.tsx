import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Report = {
  id: string
  photo_url: string
  description: string
  status: string
  latitude: number
  longitude: number
  created_at: string
  user_id: string
}

type Profile = {
  id: string
  full_name: string
  email: string
  verified: boolean
  role: string
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500',
  validated: 'bg-blue-500',
  resolved: 'bg-green-500'
}

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  validated: 'Validado',
  resolved: 'Resuelto'
}

export default function Admin() {
  const [reports, setReports] = useState<Report[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tab, setTab] = useState<'reports' | 'users'>('reports')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
    fetchProfiles()
  }, [])

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setReports(data)
    setLoading(false)
  }

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProfiles(data)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', id)
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const toggleVerified = async (id: string, verified: boolean) => {
    await supabase.from('profiles').update({ verified: !verified }).eq('id', id)
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, verified: !verified } : p))
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Cargando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Panel Admin</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('reports')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'reports' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Reportes ({reports.length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'users' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Usuarios ({profiles.length})
        </button>
      </div>

      {tab === 'reports' && (
        <div className="flex flex-col gap-4">
          {reports.map(report => (
            <div key={report.id} className="bg-gray-900 rounded-xl overflow-hidden">
              <img src={report.photo_url} className="w-full h-48 object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs text-white px-2 py-1 rounded-full ${statusColor[report.status]}`}>
                    {statusLabel[report.status]}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(report.created_at).toLocaleDateString('es-UY')}
                  </span>
                </div>
                {report.description && (
                  <p className="text-gray-300 text-sm mb-3">{report.description}</p>
                )}
                <p className="text-gray-600 text-xs mb-3">
                  📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(report.id, 'validated')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg transition"
                  >
                    Validar
                  </button>
                  <button
                    onClick={() => updateStatus(report.id, 'resolved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition"
                  >
                    Resolver
                  </button>
                  <button
                    onClick={() => updateStatus(report.id, 'pending')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition"
                  >
                    Pendiente
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="flex flex-col gap-3">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{profile.full_name || 'Sin nombre'}</p>
                <p className="text-gray-500 text-xs">{profile.role}</p>
              </div>
              <button
                onClick={() => toggleVerified(profile.id, profile.verified)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${profile.verified ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {profile.verified ? '✓ Verificado' : 'Sin verificar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}