import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { supabase } from '../lib/supabase'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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

export default function Mapa() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setReports(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="p-4 bg-gray-950">
        <h2 className="text-2xl font-bold text-orange-500">Mapa de reportes</h2>
        <p className="text-gray-400 text-sm">{reports.length} reporte(s) activos</p>
      </div>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[-34.9011, -56.1645]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map(report => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <div className="text-sm">
                  <img src={report.photo_url} className="w-40 h-28 object-cover rounded mb-2" />
                  <span className={`text-xs text-white px-2 py-1 rounded-full ${statusColor[report.status]}`}>
                    {statusLabel[report.status]}
                  </span>
                  {report.description && (
                    <p className="mt-2 text-gray-700">{report.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(report.created_at).toLocaleDateString('es-UY')}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}