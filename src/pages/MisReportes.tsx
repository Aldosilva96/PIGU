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

const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
  pending: { color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', label: 'Pendiente', dot: 'bg-yellow-400' },
  validated: { color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', label: 'Validado', dot: 'bg-blue-400' },
  resolved: { color: 'bg-green-500/20 text-green-400 border border-green-500/30', label: 'Resuelto', dot: 'bg-green-400' }
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-500">Mis Reportes</h2>
        <span className="text-gray-500 text-sm">{reports.length} total</span>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <span className="text-6xl">📭</span>
          <p className="text-gray-400 text-center">No tenés reportes todavía.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          {reports.map(report => (
            <div key={report.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <div className="relative">
                <img src={report.photo_url} className="w-full h-44 object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${statusConfig[report.status]?.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[report.status]?.dot}`}></span>
                    {statusConfig[report.status]?.label}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-xs">
                    📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {new Date(report.created_at).toLocaleDateString('es-UY')}
                  </p>
                </div>
                {report.description ? (
                  <p className="text-gray-300 text-sm">{report.description}</p>
                ) : (
                  <p className="text-gray-600 text-sm italic">Sin descripción</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}