import { useRef, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function NuevoReporte() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    startCamera()
    getLocation()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setCameraError('No se pudo acceder a la cámara. Verificá los permisos.')
    }
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setMessage('No se pudo obtener la ubicación.')
    )
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    setPhoto(canvas.toDataURL('image/jpeg'))
  }

  const retakePhoto = () => {
    setPhoto(null)
    startCamera()
  }

  const handleSubmit = async () => {
    if (!photo || !location) {
      setMessage('Necesitás foto y ubicación para enviar el reporte.')
      return
    }

    setLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', user.id)
      .single()

    if (!profile?.verified) {
      setMessage('Tu cuenta está pendiente de verificación. Un administrador habilitará tu acceso pronto.')
      setLoading(false)
      return
    }

    const blob = await fetch(photo).then(r => r.blob())
    const filename = `${user.id}/${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(filename, blob, { contentType: 'image/jpeg' })

    if (uploadError) {
      setMessage('Error al subir la foto.')
      setLoading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(filename)

    const { error } = await supabase.from('reports').insert({
      user_id: user.id,
      photo_url: publicUrl,
      latitude: location.lat,
      longitude: location.lng,
      description,
      status: 'pending'
    })

    if (error) {
      setMessage('Error al enviar el reporte.')
    } else {
      setMessage('¡Reporte enviado correctamente!')
      setPhoto(null)
      setDescription('')
      startCamera()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Nuevo Reporte</h2>

      {cameraError && (
        <p className="text-red-400 mb-4">{cameraError}</p>
      )}

      {!photo ? (
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-sm rounded-xl max-h-72 object-cover"
          />
          <button
            onClick={capturePhoto}
            className="mt-4 w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
          >
            📸 Capturar foto
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img src={photo} className="w-full max-w-sm rounded-xl mb-3" />
          <button
            onClick={retakePhoto}
            className="w-full max-w-sm bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg mb-3 transition"
          >
            🔄 Sacar otra foto
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 max-w-sm mx-auto">
        {location ? (
          <p className="text-green-400 text-sm mb-3">
            📍 Ubicación obtenida: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>
        ) : (
          <p className="text-yellow-400 text-sm mb-3">📍 Obteniendo ubicación...</p>
        )}

        <textarea
          className="w-full bg-gray-800 text-white rounded-lg p-3 outline-none resize-none"
          placeholder="Descripción opcional..."
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {message && <p className="text-orange-400 text-sm mt-3">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !photo}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </div>
    </div>
  )
}