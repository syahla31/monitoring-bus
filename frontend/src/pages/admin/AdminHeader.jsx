import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  UserRoundCog,
  Database,
  Files,
  ChevronDown,
  UserRound,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const menus = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [],
  },
  {
    label: 'Manajemen Akses',
    icon: UserRoundCog,
    children: ['Role Akses', 'Akses Akun'],
  },
  {
    label: 'Master Data',
    icon: Database,
    children: ['Kategori Pengaduan', 'Daftar Petugas'],
  },
  {
    label: 'Pengaduan',
    icon: Files,
    children: [],
  },
]

export default function AdminHeader({
  activeMenu,
  setActiveMenu,
  onLogout,
}) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null)
        setProfileOpen(false)
        setMobileMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setProfileOpen(false)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function selectMenu(label) {
    setActiveMenu(label)
    setOpenDropdown(null)
    setProfileOpen(false)
    setMobileMenuOpen(false)
  }

  function toggleDropdown(label) {
    setOpenDropdown((current) => (current === label ? null : label))
    setProfileOpen(false)
  }

  function renderDesktopMenu({ label, icon: Icon, children }) {
    const hasDropdown = children.length > 0
    const isActive =
      activeMenu === label || children.includes(activeMenu)
    const isOpen = openDropdown === label

    return (
      <div key={label} className="relative shrink-0">
        <button
          type="button"
          aria-expanded={hasDropdown ? isOpen : undefined}
          onClick={() => {
            if (hasDropdown) {
              toggleDropdown(label)
            } else {
              selectMenu(label)
            }
          }}
          className={`flex min-h-[54px] items-center gap-2 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium transition 2xl:px-4 ${
            isActive
              ? 'bg-[#0DA7B8] text-white shadow-lg shadow-cyan-900/10'
              : 'text-[#0DA7B8] hover:bg-cyan-50'
          }`}
        >
          <Icon size={20} strokeWidth={2.2} />
          <span>{label}</span>

          {hasDropdown && (
            <ChevronDown
              size={15}
              className={`transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>

        {hasDropdown && isOpen && (
          <div className="absolute left-0 top-full z-[60] mt-1 min-w-[210px] overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
            {children.map((child) => (
              <button
                key={child}
                type="button"
                onClick={() => selectMenu(child)}
                className={`block w-full px-5 py-3 text-left text-sm transition ${
                  activeMenu === child
                    ? 'bg-cyan-50 font-medium text-[#0DA7B8]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {child}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <header
      ref={headerRef}
      className="relative z-50 w-full border-b border-slate-200 bg-white"
    >
      {/* Header utama */}
      <div className="flex min-h-[68px] items-center justify-between gap-2 px-3 sm:min-h-[82px] sm:px-5 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => selectMenu('Dashboard')}
          className="flex min-w-0 shrink items-center"
          aria-label="Kembali ke Dashboard"
        >
          <img
            src="/navbus-logo.png"
            alt="NavBus Admin Monitoring"
            className="h-9 w-auto max-w-[135px] object-contain sm:h-12 sm:max-w-[175px]"
          />
        </button>

        {/* Navigasi desktop */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {menus.map(renderDesktopMenu)}
        </nav>

        {/* Profil */}
        <div className="relative ml-auto flex shrink-0 items-center gap-1 xl:ml-2">
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((open) => !open)
              setOpenDropdown(null)
            }}
            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-slate-800 hover:bg-slate-50 sm:gap-2 sm:px-3"
          >
            <UserRound size={19} />
            <span className="hidden sm:inline">Administrator</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-[80] mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>
                <p className="mt-1 text-xs text-slate-500">Admin</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  onLogout?.()
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}

          {/* Tombol hamburger hanya di layar kecil */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setMobileMenuOpen((open) => !open)
              setOpenDropdown(null)
              setProfileOpen(false)
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 xl:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Menu mobile: terbuka ke bawah, bukan terpotong ke samping */}
      {mobileMenuOpen && (
        <nav className="border-t border-slate-100 bg-white px-3 py-3 shadow-lg xl:hidden sm:px-5">
          <div className="flex flex-col gap-1">
            {menus.map(({ label, icon: Icon, children }) => {
              const hasDropdown = children.length > 0
              const isActive =
                activeMenu === label || children.includes(activeMenu)
              const isOpen = openDropdown === label

              return (
                <div key={label} className="min-w-0">
                  <button
                    type="button"
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    onClick={() => {
                      if (hasDropdown) {
                        toggleDropdown(label)
                      } else {
                        selectMenu(label)
                      }
                    }}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0DA7B8] text-white'
                        : 'text-slate-700 hover:bg-cyan-50 hover:text-[#0DA7B8]'
                    }`}
                  >
                    <Icon size={19} />
                    <span className="flex-1">{label}</span>

                    {hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {hasDropdown && isOpen && (
                    <div className="ml-8 mt-1 flex flex-col border-l-2 border-cyan-100 pl-3">
                      {children.map((child) => (
                        <button
                          key={child}
                          type="button"
                          onClick={() => selectMenu(child)}
                          className={`rounded-lg px-3 py-3 text-left text-sm transition ${
                            activeMenu === child
                              ? 'bg-cyan-50 font-semibold text-[#0DA7B8]'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}