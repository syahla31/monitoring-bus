import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  ArrowLeft,
} from 'lucide-react'

const INITIAL_DATA = [
  {
    id: 1,
    name: 'Keamanan Halte/Bus Stop',
    description: 'umum',
  },
  {
    id: 2,
    name: 'Tindak Kriminal',
    description: 'umum',
  },
  {
    id: 3,
    name: 'Lainnya',
    description: 'umum',
  },
  {
    id: 4,
    name: 'Kondisi Halte/Bus Stop',
    description: 'umum',
  },
]

const inputClass =
  'h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#0DA7B8] focus:ring-1 focus:ring-[#0DA7B8]'

function Popup({
  title,
  message,
  type = 'success',
  confirmText = 'Oke',
  cancelText,
  onConfirm,
  onCancel,
}) {
  const success = type === 'success'
  const warning = type === 'warning'

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[360px] rounded-xl bg-white px-6 py-6 text-center shadow-2xl"
      >
        {(success || warning) && (
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              success
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {success ? (
              <CheckCircle2 size={26} />
            ) : (
              <AlertTriangle size={26} />
            )}
          </div>
        )}

        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

        <p className="mt-2 text-xs leading-5 text-slate-600">{message}</p>

        <div className="mt-6 flex justify-center gap-2">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#0DA7B8] px-4 py-2 text-xs font-medium text-white hover:bg-cyan-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

function CustomSelect({ value, options, onChange, width = 'w-auto' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div ref={ref} className={`relative ${width}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-full items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-sm"
      >
        <span>{value}</span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-1 max-h-40 w-full rounded border border-slate-200 bg-white p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between px-2 py-1.5 text-left text-xs hover:bg-slate-50"
            >
              <span>{option}</span>
              {String(value) === String(option) && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MasterData() {
  const [data, setData] = useState(INITIAL_DATA)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [view, setView] = useState('list')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [popup, setPopup] = useState(null)
  const [formError, setFormError] = useState('')

  const [form, setForm] = useState({ name: '', description: '' })

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return data
    return data.filter((item) =>
      [item.name, item.description].some((val) =>
        val.toLowerCase().includes(keyword),
      ),
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  function notify(title, message, type = 'success') {
    setPopup({ title, message, type })
  }

  function openAddForm() {
    setEditing(null)
    setViewing(false)
    setFormError('')
    setForm({ name: '', description: '' })
    setView('form')
  }

  function openEditForm(item, readOnly = false) {
    setEditing(item)
    setViewing(readOnly)
    setFormError('')
    setForm({ name: item.name, description: item.description })
    setView('form')
  }

  function saveData(event) {
    event.preventDefault()
    setFormError('')

    const name = form.name.trim()
    const description = form.description.trim()

    if (!name) {
      setFormError('Nama kategori wajib diisi.')
      return
    }

    if (editing) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, name, description } : item,
        ),
      )
    } else {
      setData((prev) => [...prev, { id: Date.now(), name, description }])
    }

    setView('list')
    setEditing(null)
    notify('Berhasil', 'Data berhasil disimpan.')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setData((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    notify('Berhasil', 'Kategori berhasil dihapus.')
  }

  return (
    <main className="min-h-full w-full bg-[#F4F6F9] p-4 lg:p-6">
      {/* Judul Halaman Sesuai Gambar 2 */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#1E293B]">
          Daftar Kategori Pengaduan
        </h1>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {view === 'list' ? (
          <>
            {/* Control Bar Top */}
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Entries selector */}
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span>Tampilkan</span>
                <CustomSelect
                  value={pageSize}
                  options={[10, 25, 50]}
                  width="w-[60px]"
                  onChange={(val) => {
                    setPageSize(Number(val))
                    setPage(1)
                  }}
                />
                <span>data</span>
              </div>

              {/* Action items & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span>Search:</span>
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    placeholder="Cari Data"
                    className="h-8 w-44 rounded border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-[#0DA7B8]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Export Excel"
                    className="flex h-8 items-center justify-center rounded bg-[#0DA7B8] px-2.5 text-white hover:bg-cyan-700"
                  >
                    <FileSpreadsheet size={15} />
                  </button>

                  <button
                    type="button"
                    title="Export PDF"
                    className="flex h-8 items-center justify-center rounded bg-[#0DA7B8] px-2.5 text-white hover:bg-cyan-700"
                  >
                    <FileText size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={openAddForm}
                    className="flex h-8 items-center justify-center gap-1 rounded bg-[#0DA7B8] px-3 text-xs font-medium text-white hover:bg-cyan-700"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto px-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#E6F9FA] text-[#0DA7B8]">
                    <th className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <span>Kategori Pengaduan</span>
                        <ChevronsUpDown size={14} className="opacity-40" />
                      </div>
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <span>Deskripsi</span>
                        <ChevronsUpDown size={14} className="opacity-40" />
                      </div>
                    </th>
                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <span>Aksi</span>
                        <ChevronsUpDown size={14} className="opacity-40" />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 text-slate-800">
                        {item.name}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700">
                        {item.description || '-'}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-3 text-slate-700">
                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => setDeleteTarget(item)}
                            className="hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            type="button"
                            title="Detail"
                            onClick={() => openEditForm(item, true)}
                            className="hover:text-cyan-600"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() => openEditForm(item)}
                            className="hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleData.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  Data tidak ditemukan.
                </div>
              )}
            </div>

            {/* Pagination Bottom */}
            <div className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-600">
                Menampilkan{' '}
                {filteredData.length ? (currentPage - 1) * pageSize + 1 : 0}{' '}
                - {Math.min(currentPage * pageSize, filteredData.length)} dari{' '}
                {filteredData.length} data
              </p>

              <div className="flex items-center overflow-hidden rounded border border-slate-200">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(1)}
                  className="bg-slate-100 px-2 py-1 text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                >
                  <ChevronsLeft size={13} />
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((v) => v - 1)}
                  className="border-r border-slate-200 bg-slate-100 px-2 py-1 text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPage(num)}
                      className={`h-7 w-7 text-xs font-medium ${
                        currentPage === num
                          ? 'bg-[#007BFF] text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((v) => v + 1)}
                  className="border-l border-slate-200 bg-slate-100 px-2 py-1 text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                >
                  <ChevronRight size={13} />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="bg-slate-100 px-2 py-1 text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                >
                  <ChevronsRight size={13} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={saveData} className="p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setView('list')}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-sm font-semibold text-slate-800">
                {viewing
                  ? 'Detail Kategori'
                  : editing
                    ? 'Edit Kategori'
                    : 'Tambah Kategori'}
              </h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-700">
                  Nama Kategori <span className="text-red-500">*</span>
                </span>
                <input
                  disabled={viewing}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-700">
                  Deskripsi
                </span>
                <textarea
                  disabled={viewing}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-md border border-slate-200 p-2.5 text-xs outline-none focus:border-[#0DA7B8]"
                />
              </label>

              {formError && (
                <p className="text-xs text-red-500">{formError}</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                Kembali
              </button>
              {!viewing && (
                <button
                  type="submit"
                  className="rounded bg-[#0DA7B8] px-3 py-1.5 text-xs text-white hover:bg-cyan-700"
                >
                  Simpan
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      {deleteTarget && (
        <Popup
          title="Hapus Kategori"
          message="Apakah Anda yakin ingin menghapus kategori ini?"
          type="warning"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onConfirm={() => setPopup(null)}
          onCancel={() => setPopup(null)}
        />
      )}
    </main>
  )
}