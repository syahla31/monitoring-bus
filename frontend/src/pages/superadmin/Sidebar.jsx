import {
  LayoutDashboard,
  ShieldUser,
  Building2,
  ClipboardList,
  Database,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  LockKeyhole,
} from 'lucide-react'

const menus = [
  { label: 'Manajemen Klien', icon: Building2 },
  { label: 'Laporan Pengaduan', icon: ClipboardList },
]

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  sidebarOpen,
  setSidebarOpen,
}) {
  const accessActive = [
    'Manajemen Akses',
    'Daftar Role',
    'Daftar Akun',
  ].includes(activeMenu)

  const masterDataActive = [
    'Master Data',
    'Kategori Pengaduan',
  ].includes(activeMenu)

  function navigate(menu) {
    setActiveMenu(menu)

    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Overlay khusus tampilan mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-dvh w-64 shrink-0 overflow-x-hidden overflow-y-auto bg-[#F2B600] px-4 py-6 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between gap-2">
          <img
            src="/navbus-logo-sidebar.png"
            alt="NavBus Admin Monitoring"
            className="h-auto w-full min-w-0 max-w-[190px] object-contain"
          />

          <button
            type="button"
            aria-label="Tutup sidebar"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 rounded-lg p-2 transition hover:bg-yellow-400 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => navigate('Dashboard')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
              activeMenu === 'Dashboard'
                ? 'bg-black text-white'
                : 'text-black hover:bg-yellow-400'
            }`}
          >
            <LayoutDashboard size={17} className="shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Manajemen Akses */}
          <div>
            <button
              type="button"
              aria-expanded={accessActive}
              onClick={() => {
                if (accessActive) {
                  setActiveMenu('Dashboard')
                } else {
                  setActiveMenu('Daftar Role')
                }
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                accessActive
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-yellow-400'
              }`}
            >
              <ShieldUser size={17} className="shrink-0" />

              <span className="min-w-0 flex-1">
                Manajemen Akses
              </span>

              {accessActive ? (
                <ChevronDown size={15} />
              ) : (
                <ChevronRight size={15} />
              )}
            </button>

            {accessActive && (
              <div className="ml-5 mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => navigate('Daftar Role')}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs transition ${
                    activeMenu === 'Daftar Role'
                      ? 'bg-white/40 font-semibold text-black'
                      : 'text-black/80 hover:bg-white/25'
                  }`}
                >
                  <LockKeyhole size={13} className="shrink-0" />
                  <span>Daftar Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('Daftar Akun')}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs transition ${
                    activeMenu === 'Daftar Akun'
                      ? 'bg-white/40 font-semibold text-black'
                      : 'text-black/80 hover:bg-white/25'
                  }`}
                >
                  <Users size={13} className="shrink-0" />
                  <span>Daftar Akun</span>
                </button>
              </div>
            )}
          </div>

          {/* Master Data */}
          <div>
            <button
              type="button"
              aria-expanded={masterDataActive}
              onClick={() => {
                if (masterDataActive) {
                  setActiveMenu('Dashboard')
                } else {
                  setActiveMenu('Kategori Pengaduan')
                }
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                masterDataActive
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-yellow-400'
              }`}
            >
              <Database size={17} className="shrink-0" />

              <span className="min-w-0 flex-1">
                Master Data
              </span>

              {masterDataActive ? (
                <ChevronDown size={15} />
              ) : (
                <ChevronRight size={15} />
              )}
            </button>

            {masterDataActive && (
              <div className="ml-5 mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => navigate('Kategori Pengaduan')}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs transition ${
                    activeMenu === 'Kategori Pengaduan'
                      ? 'bg-white/40 font-semibold text-black'
                      : 'text-black/80 hover:bg-white/25'
                  }`}
                >
                  <span>Kategori Pengaduan</span>
                </button>
              </div>
            )}
          </div>

          {/* Menu lainnya */}
          {menus.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                activeMenu === label
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-yellow-400'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}