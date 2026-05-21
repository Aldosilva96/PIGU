import Logo from './Logo'

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <Logo size={100} />
      <h1 className="text-4xl font-bold text-orange-500 tracking-widest">PIGU</h1>
      <p className="text-gray-500 text-sm">Plataforma de reportes urbanos</p>
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}