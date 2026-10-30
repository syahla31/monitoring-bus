import { useMemo, useState } from 'react'
import {
  Search,
  FileSpreadsheet,
  FileText,
  Plus,
  Trash2,
  Eye,
  Pencil,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const initialOfficers = [
  { id: 1, name: 'testing', email: 'test@gmail.com', phone: '08977666666666' },
  { id: 2, name: 'Lala', email: 'lala@gmail.com', phone: '081234541234' },
]

export default function DaftarPetugas() {
  const [officers, setOfficers] = useState(initialOfficers)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState('10')
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [selectedOfficer, setSelectedOfficer] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const filteredOfficers = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return officers.filter((officer) =>
      [officer.name, officer.email, officer.phone].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [officers, search])

  const totalPages = Math.max(1, Math.ceil(filteredOfficers.length / Number(pageSize)))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * Number(pageSize)
  const visibleOfficers = filteredOfficers.slice(startIndex, startIndex + Number(pageSize))

  function openAdd() {
    setSelectedOfficer(null)
    setForm({ name: '', email: '', phone: '' })
    setModal('add')
  }

  function openEdit(officer) {
    setSelectedOfficer(officer)
    setForm({ name: officer.name, email: officer.email, phone: officer.phone })
    setModal('edit')
  }

  function saveOfficer(event) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()
    if (!name || !email || !phone) return

    const duplicate = officers.some(
      (officer) =>
        officer.email.toLowerCase() === email.toLowerCase() &&
        officer.id !== selectedOfficer?.id,
    )
    if (duplicate) {
      window.alert('Email petugas sudah digunakan.')
      return
    }

    if (modal === 'edit' && selectedOfficer) {
      setOfficers((current) =>
        current.map((officer) =>
          officer.id === selectedOfficer.id
            ? { ...officer, name, email, phone }
            : officer,
        ),
      )
    } else {
      setOfficers((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((officer) => officer.id)) + 1,
          name,
          email,
          phone,
        },
      ])
    }
    setPage(1)
    setModal(null)
  }

  function deleteOfficer(officer) {
    if (!window.confirm(`Hapus petugas "${officer.name}"?`)) return
    setOfficers((current) => current.filter((item) => item.id !== officer.id))
    setModal(null)
  }

  function exportCsv() {
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`
    const rows = [
      ['Nama Petugas', 'Email', 'Nomor Hp'],
      ...filteredOfficers.map((officer) => [officer.name, officer.email, officer.phone]),
    ]
    const csv = '\uFEFF' + rows.map((row) => row.map(escapeCsv).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'daftar-petugas.csv'
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
        Daftar Petugas
      </h1>

      <section className="min-w-0 rounded-lg border border-[#D5D5D5] bg-white p-3 sm:p-5">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm sm:gap-3 sm:text-base">
            <span className="shrink-0 text-slate-700">Tampilkan</span>
            <div className="relative inline-flex shrink-0">
              <button
                type="button"
                aria-label="Jumlah data per halaman"
                aria-haspopup="listbox"
                aria-expanded={pageSizeOpen}
                onClick={() => setPageSizeOpen((open) => !open)}
                className={`flex h-10 w-[84px] items-center justify-between rounded-lg border bg-white px-3 text-sm text-slate-700 transition sm:h-11 ${
                  pageSizeOpen ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-200 hover:border-cyan-400'
                }`}
              >
                {pageSize}
                <ChevronDown size={15} className={`text-slate-500 transition-transform ${pageSizeOpen ? 'rotate-180' : ''}`} />
              </button>
              {pageSizeOpen && (
                <>
                  <button type="button" aria-label="Tutup pilihan jumlah data" className="fixed inset-0 z-40 cursor-default" onClick={() => setPageSizeOpen(false)} />
                  <div role="listbox" className="absolute left-0 top-full z-50 mt-2 w-[84px] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                    {['10', '25', '50', '100'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        role="option"
                        aria-selected={pageSize === size}
                        onClick={() => {
                          setPageSize(size)
                          setPage(1)
                          setPageSizeOpen(false)
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                          pageSize === size ? 'bg-cyan-50 font-semibold text-cyan-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="shrink-0 text-slate-700">data</span>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label htmlFor="officer-search" className="text-sm sm:mr-1">Search:</label>
            <div className="relative min-w-0 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="officer-search"
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
              <button type="button" onClick={exportCsv} title="Export Excel / CSV" aria-label="Export Excel atau CSV" className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700 sm:h-11 sm:w-12">
                <FileSpreadsheet size={20} />
              </button>
              <button type="button" onClick={() => window.print()} title="Cetak / simpan PDF" aria-label="Cetak atau simpan PDF" className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700 sm:h-11 sm:w-12">
                <FileText size={20} />
              </button>
              <button type="button" onClick={openAdd} className="flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0DA7B8] px-3 text-sm text-white hover:bg-cyan-700 sm:h-11 sm:flex-none sm:px-5">
                <Plus size={17} className="shrink-0" />
                Tambah
              </button>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#DFFBFC] text-[#0DA7B8]">
                <th className="w-[27%] px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">Nama Petugas <ArrowUpDown size={15} /></span>
                </th>
                <th className="w-[28%] px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">Email <ArrowUpDown size={15} className="opacity-30" /></span>
                </th>
                <th className="w-[25%] px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">Nomor Hp <ArrowUpDown size={15} className="opacity-30" /></span>
                </th>
                <th className="w-[20%] px-3 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleOfficers.map((officer) => (
                <tr key={officer.id} className="border-b border-slate-200 text-slate-900">
                  <td className="break-words px-3 py-4">{officer.name}</td>
                  <td className="break-all px-3 py-4">{officer.email}</td>
                  <td className="break-words px-3 py-4">{officer.phone}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => deleteOfficer(officer)} title="Hapus" aria-label={`Hapus petugas ${officer.name}`} className="text-slate-800 hover:text-red-600"><Trash2 size={22} strokeWidth={1.8} /></button>
                      <button type="button" onClick={() => { setSelectedOfficer(officer); setModal('view') }} title="Lihat" aria-label={`Lihat petugas ${officer.name}`} className="text-slate-800 hover:text-cyan-700"><Eye size={23} strokeWidth={1.8} /></button>
                      <button type="button" onClick={() => openEdit(officer)} title="Edit" aria-label={`Edit petugas ${officer.name}`} className="text-slate-800 hover:text-amber-600"><Pencil size={22} strokeWidth={1.8} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleOfficers.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-10 text-center text-slate-500">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-slate-200 pt-4 sm:mt-6 sm:gap-4 sm:pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-700 sm:text-sm">
            Menampilkan {filteredOfficers.length === 0 ? 0 : startIndex + 1}
            {' - '}
            {Math.min(startIndex + Number(pageSize), filteredOfficers.length)}
            {' dari '}
            {filteredOfficers.length} data
          </p>
          <div className="flex max-w-full items-center self-end overflow-hidden rounded-lg border border-slate-200">
            {pagination.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                type="button"
                disabled={((index === 0 || index === 1) && currentPage === 1) || ((index === 3 || index === 4) && currentPage === totalPages)}
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
                {modal === 'add' ? 'Tambah Petugas' : modal === 'edit' ? 'Edit Petugas' : 'Detail Petugas'}
              </h2>
              <button type="button" onClick={() => setModal(null)} aria-label="Tutup" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            {modal === 'view' ? (
              <div className="space-y-4">
                <div><p className="text-sm text-slate-500">Nama Petugas</p><p className="mt-1 break-words font-medium">{selectedOfficer?.name}</p></div>
                <div><p className="text-sm text-slate-500">Email</p><p className="mt-1 break-all">{selectedOfficer?.email}</p></div>
                <div><p className="text-sm text-slate-500">Nomor Hp</p><p className="mt-1 break-words">{selectedOfficer?.phone}</p></div>
                <div className="flex justify-end"><button type="button" onClick={() => setModal(null)} className="rounded-lg bg-[#0DA7B8] px-5 py-2.5 text-white">Tutup</button></div>
              </div>
            ) : (
              <form onSubmit={saveOfficer} className="space-y-4">
                <div>
                  <label htmlFor="officer-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Petugas</label>
                  <input id="officer-name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500" placeholder="Masukkan nama petugas" />
                </div>
                <div>
                  <label htmlFor="officer-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <input id="officer-email" type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500" placeholder="nama@email.com" />
                </div>
                <div>
                  <label htmlFor="officer-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Nomor Hp</label>
                  <input id="officer-phone" type="tel" required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500" placeholder="Masukkan nomor HP" />
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