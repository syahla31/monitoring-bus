import { useState } from 'react'
import Sidebar from '../pages/superadmin/Sidebar'
import Header from '../pages/superadmin/Header'

export default function SuperAdminLayout({
  children,
  activeMenu,
  setActiveMenu,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-slate-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`min-h-screen min-w-0 transition-[margin,width] duration-300 ${
          sidebarOpen
            ? 'ml-0 w-full md:ml-64 md:w-[calc(100%-16rem)]'
            : 'ml-0 w-full'
        }`}
      >
        <Header
          onMenuClick={() => setSidebarOpen((open) => !open)}
          onLogout={onLogout}
        />

        {children}
      </div>
    </div>
  )
}