import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } }
      })
      if (error) setError(error.message)
      else setError('Revisá tu email para confirmar tu cuenta.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Logo size={70} />
          <h1 className="text-3xl font-bold text-orange-500 mt-3">Pigu</h1>
          <p className="text-gray-400 text-sm">Plataforma de reportes urbanos</p>
        </div>

        {isRegister && (
          <>
            <input
              className="w-full bg-gray-800 text-white rounded-lg p-3 mb-3 outline-none"
              placeholder="Nombre completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input
              className="w-full bg-gray-800 text-white rounded-lg p-3 mb-3 outline-none"
              placeholder="Teléfono"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </>
        )}

        <input
          className="w-full bg-gray-800 text-white rounded-lg p-3 mb-3 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-gray-800 text-white rounded-lg p-3 mb-4 outline-none"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-orange-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar sesión'}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-gray-400 hover:text-white mt-4 text-sm transition"
        >
          {isRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
        </button>
      </div>
    </div>
  )
}