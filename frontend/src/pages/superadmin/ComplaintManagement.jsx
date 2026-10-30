import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Check,
} from 'lucide-react'

const INITIAL_COMPLAINTS = [
  {
    id: 1,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'SiBesti',
    category: 'Kondisi Halte/Bus Stop',
    status: 'Laporan Masuk',
    title: 'Kondisi halte kurang terawat',
    location: 'Halte Margonda, Depok',
    description: 'Penumpang melaporkan kondisi halte yang kurang terawat dan membutuhkan pemeriksaan.',
    reporter: 'Pengguna Trans Depok',
    reporterPhone: '08xxxxxxxxxx',
    officer: '-',
    schedule: '-',
    handlingStatus: '-',
  },
  {
    id: 2,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'SiBesti',
    category: 'Kondisi Halte/Bus Stop',
    status: 'Laporan Masuk',
    title: 'Informasi jadwal keberangkatan',
    location: 'Terminal Bekasi',
    description: 'Pelapor meminta pemeriksaan informasi jadwal keberangkatan bus.',
    reporter: 'Pengguna Sibesti',
    reporterPhone: '08xxxxxxxxxx',
    officer: 'Petugas Operasional',
    schedule: '2026-10-30',
    handlingStatus: 'Terjadwal',
  },
  {
    id: 3,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'SiBesti',
    category: 'Pengemudi main hape',
    status: 'Laporan Masuk',
    title: 'Pemeriksaan fasilitas halte',
    location: 'Halte Tangerang',
    description: 'Laporan pemeriksaan fasilitas halte sudah ditindaklanjuti.',
    reporter: 'Pengguna Sobat Beken',
    reporterPhone: '08xxxxxxxxxx',
    officer: 'Petugas Lapangan',
    schedule: '2026-10-27',
    handlingStatus: 'Selesai',
  },
  {
    id: 4,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'Sobat Beken',
    category: 'Pengemudi main hape',
    status: 'Menunggu Ditangani',
    title: 'Laporan operasional bus',
    location: 'Kabupaten Bogor',
    description: 'Laporan tidak dapat diproses karena informasi yang diberikan belum mencukupi.',
    reporter: 'Pengguna Kabogor',
    reporterPhone: '08xxxxxxxxxx',
    officer: '-',
    schedule: '-',
    handlingStatus: 'Ditolak',
  },
  {
    id: 5,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'Sobat Beken',
    category: 'Pengemudi main hape',
    status: 'Menunggu Ditangani',
    title: 'Pengecekan fasilitas bus',
    location: 'Kota Depok',
    description: 'Permintaan pengecekan fasilitas bus dari pengguna layanan.',
    reporter: 'Pengguna Trans Depok',
    reporterPhone: '08xxxxxxxxxx',
    officer: 'Petugas Lapangan',
    schedule: '2026-10-29',
    handlingStatus: 'Terjadwal',
  },
  {
    id: 6,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'Trans Depok',
    category: 'Pengemudi main hape',
    status: 'Proses Penanganan',
    title: 'Pengecekan fasilitas bus',
    location: 'Kota Depok',
    description: 'Permintaan pengecekan fasilitas bus dari pengguna layanan.',
    reporter: 'Pengguna Trans Depok',
    reporterPhone: '08xxxxxxxxxx',
    officer: 'Petugas Lapangan',
    schedule: '2026-10-29',
    handlingStatus: 'Terjadwal',
  },
  {
    id: 7,
    code: '9238592863029',
    date: '2026-01-01',
    source: 'Trans Depok',
    category: 'Kondisi Halte/Bus Stop',
    status: 'Laporan Selesai',
    title: 'Pengecekan fasilitas bus',
    location: 'Kota Depok',
    description: 'Permintaan pengecekan fasilitas bus dari pengguna layanan.',
    reporter: 'Pengguna Trans Depok',
    reporterPhone: '08xxxxxxxxxx',
    officer: 'Petugas Lapangan',
    schedule: '2026-10-29',
    handlingStatus: 'Selesai',
  },
]

const SOURCES = [
  'Semua Asal Laporan',
  'Trans Depok',
  'SiBesti',
  'Sobat Beken',
  'Kabogor',
]

const STATUSES = [
  'Semua Status',
  'Laporan Masuk',
  'Menunggu Ditangani',
  'Proses Penanganan',
  'Laporan Selesai',
]

const pad = (value) => String(value).padStart(2, '0')

const toISO = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const fromISO = (value) => {
  if (!value) return new Date()
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(value) {
  if (!value || value === '-') return '-'

  return fromISO(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function CustomSelect({ value, options, onChange, width = 'w-full' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={ref} className={`relative min-w-0 ${width}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-xs text-slate-700 shadow-sm transition ${
          open
            ? 'border-[#F2B600] ring-2 ring-amber-100'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-2 max-h-64 w-full min-w-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                value === option
                  ? 'bg-amber-50 font-medium text-amber-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{option}</span>
              {value === option && (
                <Check size={14} className="shrink-0 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DatePicker({ label, value, onChange, min, max }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => fromISO(value))
  const ref = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const dayCount = new Date(year, month + 1, 0).getDate()

  const cells = Array.from(
    { length: Math.ceil((offset + dayCount) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1
      return day > 0 && day <= dayCount ? day : null
    },
  )

  function chooseDate(day) {
    const selected = toISO(new Date(year, month, day))

    if (min && selected < min) return
    if (max && selected > max) return

    onChange(selected)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          setViewDate(fromISO(value))
          setOpen((current) => !current)
        }}
        className={`flex h-8 w-full min-w-0 items-center gap-1 rounded px-1.5 text-left transition ${
          open
            ? 'bg-amber-50 text-amber-900'
            : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        <CalendarDays size={13} className="shrink-0 text-slate-400" />
        <span className="min-w-0 flex-1 truncate text-[11px]">
          {value ? formatDate(value) : 'Pilih tanggal'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[110] mt-2 w-[min(300px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Bulan sebelumnya"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-800"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-semibold capitalize text-slate-800">
              {viewDate.toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              })}
            </span>

            <button
              type="button"
              aria-label="Bulan berikutnya"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-800"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
              <span
                key={day}
                className="py-2 text-[10px] font-medium text-slate-400"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const date = toISO(new Date(year, month, day))
              const selected = date === value
              const disabled =
                (min && date < min) || (max && date > max)

              return (
                <button
                  key={date}
                  type="button"
                  disabled={Boolean(disabled)}
                  onClick={() => chooseDate(day)}
                  className={`flex aspect-square items-center justify-center rounded-lg text-xs transition ${
                    selected
                      ? 'bg-[#F2B600] font-bold text-slate-900'
                      : 'text-slate-700 hover:bg-amber-50'
                  } ${disabled ? 'cursor-not-allowed opacity-25' : ''}`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Hapus tanggal
            </button>

            <button
              type="button"
              onClick={() => {
                const today = toISO(new Date())

                if ((!min || today >= min) && (!max || today <= max)) {
                  setViewDate(fromISO(today))
                  onChange(today)
                  setOpen(false)
                }
              }}
              className="text-xs font-medium text-amber-700 hover:text-amber-900"
            >
              Hari ini
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    'Laporan Masuk': 'bg-amber-50 text-amber-700',
    'Menunggu Ditangani': 'bg-blue-50 text-blue-700',
    'Proses Penanganan': 'bg-purple-50 text-purple-700',
    'Laporan Selesai': 'bg-emerald-50 text-emerald-700',
    Ditolak: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

function DetailField({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2 py-1.5 sm:grid-cols-[135px_minmax(0,1fr)]">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="break-words text-[11px] font-medium text-slate-800">
        {value || '-'}
      </span>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 p-3 sm:p-4">
      <h3 className="mb-2 text-xs font-semibold text-slate-800">{title}</h3>
      {children}
    </section>
  )
}

function Modal({ children, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 p-3 backdrop-blur-[4px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[90dvh] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-5 ${
          wide ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <button
          type="button"
          aria-label="Tutup popup"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
        {children}
      </section>
    </div>
  )
}

export default function ComplaintManagement() {
  const [complaints] = useState(INITIAL_COMPLAINTS)
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('Semua Asal Laporan')
  const [status, setStatus] = useState('Semua Status')
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState('2026-10-31')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [notice, setNotice] = useState('')

  const filteredComplaints = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return complaints.filter((item) => {
      const matchesSearch =
        !keyword ||
        [item.code, item.source, item.category, item.title, item.location, item.officer]
          .some((value) => value.toLowerCase().includes(keyword))

      const matchesSource =
        source === 'Semua Asal Laporan' || item.source === source

      const matchesStatus =
        status === 'Semua Status' || item.status === status

      const matchesStart = !startDate || item.date >= startDate
      const matchesEnd = !endDate || item.date <= endDate

      return (
        matchesSearch &&
        matchesSource &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      )
    })
  }, [complaints, search, source, status, startDate, endDate])

  const size = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / size))
  const currentPage = Math.min(page, totalPages)

  const visibleComplaints = filteredComplaints.slice(
    (currentPage - 1) * size,
    currentPage * size,
  )

  function exportNotice(format) {
    setNotice(
      `Export ${format} belum tersedia. Data laporan saat ini masih menggunakan data dummy.`,
    )
  }

  return (
    <main className="min-h-full w-full min-w-0 bg-slate-50 p-3 sm:p-5 lg:p-6">
      {/* Header Halaman Sesuai Gambar: Judul di Kiri, Filter Waktu di Kanan */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          Laporan Pengaduan
        </h1>

        <div className="flex items-center gap-2">
          <CustomSelect
            value="Bulan ini"
            options={['Bulan ini', 'Bulan lalu', 'Semua Waktu']}
            onChange={() => {}}
            width="w-32"
          />

          <div className="flex w-64 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <DatePicker
              label="Tanggal mulai"
              value={startDate}
              max={endDate || undefined}
              onChange={(value) => {
                setStartDate(value)
                setPage(1)
              }}
            />

            <span className="shrink-0 text-xs text-slate-300">-</span>

            <DatePicker
              label="Tanggal akhir"
              value={endDate}
              min={startDate || undefined}
              onChange={(value) => {
                setEndDate(value)
                setPage(1)
              }}
            />
          </div>
        </div>
      </div>

      <section className="min-w-0 overflow-visible rounded-xl border border-slate-200 bg-white">
        <div className="rounded-t-xl border-b border-slate-100 p-3 sm:p-4">
          
          {/* Baris Atas Tabel: Tampilkan data (kiri), Search (tengah/sebelah tombol), Export (kanan) */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Tampilkan</span>
              <div className="w-20">
                <CustomSelect
                  value={pageSize}
                  options={['10', '25', '50']}
                  onChange={(value) => {
                    setPageSize(value)
                    setPage(1)
                  }}
                />
              </div>
              <span>data</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-0 w-full sm:w-56">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari Nama Teknisi"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-[#F2B600] focus:ring-2 focus:ring-amber-100"
                />
              </label>

              <button
                type="button"
                onClick={() => exportNotice('Excel')}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#F2B600] px-3 text-xs font-medium text-slate-900 hover:bg-amber-400"
              >
                <FileSpreadsheet size={15} />
                Export Excel
              </button>

              <button
                type="button"
                onClick={() => exportNotice('PDF')}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#F2B600] px-3 text-xs font-medium text-slate-900 hover:bg-amber-400"
              >
                <FileText size={15} />
                Export PDF
              </button>
            </div>
          </div>

          {/* Baris Filter Dropdown Asal Laporan & Status */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="min-w-0">
              <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Asal Laporan
              </span>
              <CustomSelect
                value={source}
                options={SOURCES}
                onChange={(value) => {
                  setSource(value)
                  setPage(1)
                }}
              />
            </label>

            <label className="min-w-0">
              <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Status
              </span>
              <CustomSelect
                value={status}
                options={STATUSES}
                onChange={(value) => {
                  setStatus(value)
                  setPage(1)
                }}
              />
            </label>
          </div>
        </div>

        {/* Tabel Data Pengaduan */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs">
            <thead className="bg-amber-50 text-slate-700">
              <tr>
                <th className="w-12 px-3 py-3 font-medium">No.</th>
                <th className="min-w-36 px-3 py-3 font-medium">Nomor Pengaduan</th>
                <th className="min-w-28 px-3 py-3 font-medium">Waktu Laporan</th>
                <th className="min-w-28 px-3 py-3 font-medium">Asal Laporan</th>
                <th className="min-w-28 px-3 py-3 font-medium">Kategori Pengaduan</th>
                <th className="min-w-24 px-3 py-3 font-medium">Status</th>
                <th className="w-16 px-3 py-3 text-center font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleComplaints.map((item, index) => (
                <tr key={item.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="px-3 py-3.5">
                    {(currentPage - 1) * size + index + 1}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-slate-800">
                    {item.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5">
                    {formatDate(item.date)} 13:25
                  </td>
                  <td className="px-3 py-3.5">{item.source}</td>
                  <td className="px-3 py-3.5">{item.category}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        title="Lihat detail laporan"
                        aria-label={`Lihat detail ${item.code}`}
                        onClick={() => setSelectedComplaint(item)}
                        className="rounded-md p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleComplaints.length === 0 && (
            <div className="px-4 py-12 text-center text-xs text-slate-500">
              Tidak ada laporan yang sesuai dengan filter.
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <p className="text-xs text-slate-500">
            Menampilkan {filteredComplaints.length ? (currentPage - 1) * size + 1 : 0}
            {' - '}
            {Math.min(currentPage * size, filteredComplaints.length)}
            {' dari '}
            {filteredComplaints.length} data
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 5)
              .map((number) => (
                <button
                  type="button"
                  key={number}
                  onClick={() => setPage(number)}
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs ${
                    currentPage === number
                      ? 'bg-[#F2B600] font-semibold text-black'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {number}
                </button>
              ))}

            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Modal Detail */}
      {selectedComplaint && (
        <Modal wide onClose={() => setSelectedComplaint(null)}>
          <div className="mb-4 pr-7">
            <h2 className="text-sm font-semibold text-slate-900">
              Detail Laporan Pengaduan
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              {selectedComplaint.code}
            </p>
          </div>

          <div className="space-y-3">
            <DetailSection title="Informasi Pengaduan">
              <DetailField label="Nomor Pengaduan" value={selectedComplaint.code} />
              <DetailField label="Asal Laporan" value={selectedComplaint.source} />
              <DetailField label="Tanggal" value={formatDate(selectedComplaint.date)} />
              <DetailField label="Kategori" value={selectedComplaint.category} />
              <DetailField label="Judul Laporan" value={selectedComplaint.title} />
              <DetailField label="Lokasi" value={selectedComplaint.location} />
              <DetailField label="Status" value={selectedComplaint.status} />
            </DetailSection>

            <DetailSection title="Keterangan Pengaduan">
              <DetailField label="Deskripsi" value={selectedComplaint.description} />
              <DetailField label="Nama Pelapor" value={selectedComplaint.reporter} />
              <DetailField label="Nomor Telepon" value={selectedComplaint.reporterPhone} />
            </DetailSection>

            <section>
              <h3 className="mb-2 text-xs font-semibold text-slate-800">
                Foto / Bukti Pengaduan
              </h3>
              <div className="flex flex-wrap gap-3">
                {[1, 2].map((number) => (
                  <div
                    key={number}
                    className="flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 sm:h-28 sm:w-36"
                  >
                    <ImageIcon size={23} />
                    <span className="text-[10px]">Bukti {number}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-400">
                Foto asli ditampilkan setelah terhubung ke backend.
              </p>
            </section>

            <DetailSection title="Jadwal Penanganan">
              <DetailField label="Petugas" value={selectedComplaint.officer} />
              <DetailField label="Jadwal" value={formatDate(selectedComplaint.schedule)} />
              <DetailField label="Status Penanganan" value={selectedComplaint.handlingStatus} />
            </DetailSection>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedComplaint(null)}
              className="rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Notice */}
      {notice && (
        <Modal onClose={() => setNotice('')}>
          <div className="px-1 py-3 text-center">
            <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertCircle size={23} />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">Informasi</h2>
            <p className="mt-3 text-xs leading-5 text-slate-600">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="mt-6 rounded-lg bg-black px-5 py-2.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Mengerti
            </button>
          </div>
        </Modal>
      )}
    </main>
  )
}