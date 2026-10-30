import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  ShieldUser,
  ChevronDown,
  UserRound,
  LogOut,
  X,
} from 'lucide-react'

export default function Header({ onMenuClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleLogout() {
    setLogoutConfirm(false)
    setProfileOpen(false)
    setDropdownOpen(false)

    if (typeof onLogout === 'function') {
      onLogout()
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 md:px-8">
        <button
          type="button"
          aria-label="Buka atau tutup sidebar"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
        >
          <Menu size={22} />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <ShieldUser size={20} />
            </span>

            <span className="hidden text-sm font-medium text-slate-800 sm:inline">
              Admin
            </span>

            <ChevronDown
              size={15}
              className={`text-slate-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Admin NavBus
                </p>
                <p className="mt-1 break-all text-xs text-slate-500">
                  admin@navbus.local
                </p>
                <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                  Super Admin
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false)
                  setProfileOpen(true)
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <UserRound size={17} />
                Profil Saya
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false)
                  setLogoutConfirm(true)
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {profileOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setProfileOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="profile-title" className="text-lg font-bold">
                Profil Saya
              </h2>

              <button
                type="button"
                aria-label="Tutup profil"
                onClick={() => setProfileOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Nama</p>
                <p className="mt-1 text-sm font-medium">Admin NavBus</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 break-all text-sm font-medium">
                  admin@navbus.local
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="mt-1 text-sm font-medium">Super Admin</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="mt-6 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Tutup
            </button>
          </section>
        </div>
      )}

      {logoutConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setLogoutConfirm(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="logout-title"
              className="text-lg font-bold text-slate-900"
            >
              Konfirmasi Logout
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Apakah kamu yakin ingin keluar dari akun Admin NavBus?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-slate-800"
              >
                Ya, Logout
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}