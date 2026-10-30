import AdminHeader from '../pages/admin/AdminHeader'

export default function AdminLayout({
  children,
  activeMenu,
  setActiveMenu,
  onLogout,
}) {
  return (
    <div className="min-h-screen w-full bg-[#F0F0F0]">
      <AdminHeader
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />

      <div className="min-h-[calc(100vh-76px)] w-full">
        {children}
      </div>
    </div>
  )
}