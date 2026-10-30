import { useMemo, useState } from 'react'
import {
  Search,
  FileSpreadsheet,
  FileText,
  Plus,
  Trash2,
  Eye,
  Pencil,
  ChevronDown,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const initialRoles = [
  { id: 1, name: 'superadmin', description: 'super' },
  { id: 2, name: 'Approvel', description: 'Approvel' },
  { id: 3, name: 'Petugas', description: 'MP' },
  { id: 4, name: 'test', description: '-' },
]

export default function RoleAkses() {
  const [roles, setRoles] = useState(initialRoles)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState('10')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const filteredRoles = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return roles.filter((role) =>
      [role.name, role.description].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [roles, search])

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / Number(pageSize)))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * Number(pageSize)
  const visibleRoles = filteredRoles.slice(startIndex, startIndex + Number(pageSize))

  function openAdd() {
    setSelectedRole(null)
    setForm({ name: '', description: '' })
    setModal('add')
  }

  function openEdit(role) {
    setSelectedRole(role)
    setForm({ name: role.name, description: role.description })
    setModal('edit')
  }

  function saveRole(event) {
    event.preventDefault()
    const name = form.name.trim()
    const description = form.description.trim() || '-'
    if (!name) return

    const duplicate = roles.some(
      (role) =>
        role.name.toLowerCase() === name.toLowerCase() &&
        role.id !== selectedRole?.id,
    )
    if (duplicate) {
      window.alert('Nama role sudah digunakan.')
      return
    }

    if (modal === 'edit' && selectedRole) {
      setRoles((current) =>
        current.map((role) =>
          role.id === selectedRole.id ? { ...role, name, description } : role,
        ),
      )
    } else {
      setRoles((current) => [
        ...current,
        { id: Math.max(0, ...current.map((role) => role.id)) + 1, name, description },
      ])
    }

    setPage(1)
    setModal(null)
  }

  function deleteRole(role) {
    if (role.name.toLowerCase() === 'superadmin') {
      window.alert('Role superadmin tidak dihapus dari tampilan ini.')
      return
    }
    if (!window.confirm(`Hapus role "${role.name}"?`)) return
    setRoles((current) => current.filter((item) => item.id !== role.id))
    setModal(null)
  }

  function exportCsv() {
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`
    const rows = [
      ['Nama Role', 'Deskripsi'],
      ...filteredRoles.map((role) => [role.name, role.description]),
    ]
    const csv = '\uFEFF' + rows.map((row) => row.map(escapeCsv).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'daftar-role.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const pagination = [
    { label: '«', target: 1 },
    { label: '‹', target: currentPage - 1 },
    { label: String(currentPage), target: currentPage, active: true },
    { label: '›', target: currentPage + 1 },
    { label: '»', target: totalPages },
  ]

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F4F5F7] px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
      <h1 className="mb-4 text-xl font-semibold text-slate-900 sm:mb-6 sm:text-2xl">
        Akses Role
      </h1>

      <section className="min-w-0 rounded-lg border border-[#D5D5D5] bg-white p-3 sm:p-5">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm sm:gap-3 sm:text-base">
            <span className="shrink-0 text-slate-700">Tampilkan</span>
            <div className="relative inline-flex shrink-0">
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value)
                  setPage(1)
                }}
                aria-label="Jumlah data per halaman"
                className="h-10 w-[84px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 sm:h-11"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <span className="shrink-0 text-slate-700">data</span>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label htmlFor="role-search" className="text-sm sm:mr-1">
              Search:
            </label>
            <div className="relative min-w-0 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="role-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Cari Data"
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-cyan-500 sm:h-11 sm:w-[205px]"
              />
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={exportCsv}
                title="Export Excel / CSV"
                aria-label="Export Excel atau CSV"
                className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700 sm:h-11 sm:w-12"
              >
                <FileSpreadsheet size={20} />
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                title="Cetak / simpan PDF"
                aria-label="Cetak atau simpan PDF"
                className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700 sm:h-11 sm:w-12"
              >
                <FileText size={20} />
              </button>
              <button
                type="button"
                onClick={openAdd}
                className="flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0DA7B8] px-3 text-sm text-white hover:bg-cyan-700 sm:h-11 sm:flex-none sm:px-5"
              >
                <Plus size={17} className="shrink-0" />
                Tambah
              </button>
            </div>
          </div>
        </div>

        {/* Tetap gunakan tabel di semua ukuran layar; HP dapat menggeser tabel bila perlu */}
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[320px] table-fixed border-collapse text-left text-xs sm:min-w-[650px] sm:text-sm">
            <thead>
              <tr className="bg-[#DFFBFC] text-[#0DA7B8]">
                <th className="w-[36%] px-2 py-3 font-semibold sm:px-3 sm:py-4">
                  <span className="flex items-center gap-1 sm:gap-2">Nama Role <ArrowUpDown size={14} className="shrink-0" /></span>
                </th>
                <th className="w-[31%] px-2 py-3 font-semibold sm:px-3 sm:py-4">
                  <span className="flex items-center gap-1 sm:gap-2">Deskripsi <ArrowUpDown size={14} className="shrink-0 opacity-30" /></span>
                </th>
                <th className="w-[33%] px-2 py-3 font-semibold sm:px-3 sm:py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleRoles.map((role) => (
                <tr key={role.id} className="border-b border-slate-200 text-slate-900">
                  <td className="break-words px-2 py-4 sm:px-3">{role.name}</td>
                  <td className="break-words px-2 py-4 sm:px-3">{role.description}</td>
                  <td className="px-2 py-3 sm:px-3">
                    <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
                      <button type="button" onClick={() => deleteRole(role)} title="Hapus" aria-label={`Hapus role ${role.name}`} className="text-slate-800 hover:text-red-600">
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                      <button type="button" onClick={() => { setSelectedRole(role); setModal('view') }} title="Lihat" aria-label={`Lihat role ${role.name}`} className="text-slate-800 hover:text-cyan-700">
                        <Eye size={19} strokeWidth={1.8} />
                      </button>
                      <button type="button" onClick={() => openEdit(role)} title="Edit" aria-label={`Edit role ${role.name}`} className="text-slate-800 hover:text-amber-600">
                        <Pencil size={18} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRoles.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-10 text-center text-slate-500">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-slate-200 pt-4 sm:mt-6 sm:gap-4 sm:pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-700 sm:text-sm">
            Menampilkan {filteredRoles.length === 0 ? 0 : startIndex + 1}
            {' - '}
            {Math.min(startIndex + Number(pageSize), filteredRoles.length)}
            {' dari '}
            {filteredRoles.length} data
          </p>
          <div className="flex max-w-full items-center self-end overflow-hidden rounded-lg border border-slate-200">
            {pagination.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                type="button"
                disabled={
                  ((index === 0 || index === 1) && currentPage === 1) ||
                  ((index === 3 || index === 4) && currentPage === totalPages)
                }
                onClick={() => setPage(Math.max(1, Math.min(totalPages, item.target)))}
                className={`flex h-10 min-w-9 items-center justify-center border-r border-slate-200 px-2 text-sm last:border-r-0 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:min-w-11 sm:px-3 ${
                  item.active ? 'bg-blue-600 font-semibold text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal === 'add' ? 'Tambah Role' : modal === 'edit' ? 'Edit Role' : 'Detail Role'}
              </h2>
              <button type="button" onClick={() => setModal(null)} aria-label="Tutup" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            {modal === 'view' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Nama Role</p>
                  <p className="mt-1 break-words font-medium">{selectedRole?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Deskripsi</p>
                  <p className="mt-1 break-words">{selectedRole?.description}</p>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setModal(null)} className="rounded-lg bg-[#0DA7B8] px-5 py-2.5 text-white">Tutup</button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveRole} className="space-y-4">
                <div>
                  <label htmlFor="role-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Role</label>
                  <input
                    id="role-name"
                    required
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500"
                    placeholder="Masukkan nama role"
                  />
                </div>
                <div>
                  <label htmlFor="role-description" className="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
                  <textarea
                    id="role-description"
                    rows={3}
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500"
                    placeholder="Masukkan deskripsi role"
                  />
                </div>
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50">Batal</button>
                  <button type="submit" className="rounded-lg bg-[#0DA7B8] px-5 py-2.5 text-white hover:bg-cyan-700">Simpan</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
