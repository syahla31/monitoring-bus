import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Username dan kata sandi wajib diisi.')
      return
    }

    // Simulasi login untuk preview tampilan.
    // Belum memvalidasi akun melalui backend.
    if (typeof onLogin === 'function') {
      onLogin()
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FB] px-4 py-10 sm:px-8">
      <div className="w-full max-w-[800px]">
        {/* Logo NavBus */}
        <div className="mb-12 flex justify-center sm:mb-14">
          <img
            src="/navbus-logo.png"
            alt="NavBus Admin Monitoring"
            className="h-auto w-[260px] max-w-[85%] object-contain sm:w-[380px]"
          />
        </div>

        {/* Judul halaman */}
        <h1 className="mb-10 text-center text-2xl font-semibold tracking-tight text-black sm:mb-12 sm:text-[30px]">
          Dashboard Monitoring
        </h1>

        {/* Form login */}
        <section className="rounded-[26px] bg-[#F2B600] px-5 pb-12 pt-10 sm:rounded-[28px] sm:px-10 sm:pb-16 sm:pt-12 md:px-16">
          <h2 className="mb-9 text-center text-lg font-medium text-black sm:mb-10 sm:text-[21px]">
            Masuk dengan Akun Anda
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[445px]"
          >
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setError('')
                }}
                placeholder="Username"
                className="h-14 w-full rounded-[10px] border border-transparent bg-white px-3 text-sm text-black outline-none transition placeholder:text-[#B8B8B8] focus:border-amber-700 focus:ring-2 focus:ring-amber-800/15 sm:h-[56px] sm:text-base"
              />
            </div>

            {/* Kata sandi */}
            <div className="relative mb-6">
              <label htmlFor="password" className="sr-only">
                Kata Sandi
              </label>

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                placeholder="Kata Sandi"
                className="h-14 w-full rounded-[10px] border border-transparent bg-white px-3 pr-12 text-sm text-black outline-none transition placeholder:text-[#B8B8B8] focus:border-amber-700 focus:ring-2 focus:ring-amber-800/15 sm:h-[56px] sm:text-base"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? 'Sembunyikan kata sandi'
                    : 'Tampilkan kata sandi'
                }
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black transition hover:bg-black/5"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {/* Pesan error */}
            {error && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-white/90 px-3 py-2 text-center text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Tombol masuk */}
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.99] sm:h-[46px] sm:text-base"
            >
              Masuk
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}