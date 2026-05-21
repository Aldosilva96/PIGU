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

export default function MisReportes() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setReports(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Cargando reportes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Mis Reportes</h2>

      {reports.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">No tenés reportes todavía.</p>
      ) : (
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          {reports.map(report => (
            <div key={report.id} className="bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={report.photo_url}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs text-white px-2 py-1 rounded-full ${statusColor[report.status]}`}>
                    {statusLabel[report.status]}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(report.created_at).toLocaleDateString('es-UY')}
                  </span>
                </div>
                {report.description && (
                  <p className="text-gray-300 text-sm">{report.description}</p>
                )}
                <p className="text-gray-600 text-xs mt-1">
                  📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}