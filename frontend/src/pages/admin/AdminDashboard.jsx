
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  FilePlus2,
  Search,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-react'

const COLORS = {
  purple: '#8975F8',
  coral: '#FF8B83',
  cyan: '#38BED5',
  orange: '#FFA83D',
}

const statistics = [
  {
    title: 'Total Pengaduan',
    value: 120,
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Pengaduan Diproses',
    value: 20,
    icon: Clock3,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Pengaduan Selesai',
    value: 80,
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Pengaduan Ditolak',
    value: 20,
    icon: XCircle,
    color: 'bg-red-100 text-red-600',
  },
]

const rejectionReasons = [
  { label: 'Laporan tidak dapat diverifikasi', value: 7, color: COLORS.purple },
  { label: 'Kendala sedang ditangani', value: 8, color: COLORS.coral },
  { label: 'Tidak ditemukan kendala', value: 3, color: COLORS.cyan },
  { label: 'Lainnya', value: 2, color: COLORS.orange },
]

const halteCategories = [
  { label: 'Kondisi Halte/Bus Stop', value: 40 },
  { label: 'Keamanan Halte/Bus Stop', value: 30 },
  { label: 'Tindak kriminal', value: 2 },
  { label: 'Lainnya', value: 8 },
]

const busCategories = [
  { label: 'Kondisi Bus', value: 14 },
  { label: 'Pengemudi main hape', value: 6 },
  { label: 'Ngebut', value: 3 },
  { label: 'Rute tidak sesuai', value: 4 },
  { label: 'Titik pemberhentian tidak sesuai', value: 8 },
  { label: 'Pengemudi tidak ramah', value: 2 },
  { label: 'Tindak Kriminal', value: 0 },
  { label: 'Lainnya', value: 3 },
]

function Panel({ title, children, className = '' }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-white p-4 sm:p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-medium text-slate-800">
        {title}
      </h2>
      {children}
    </section>
  )
}

function DonutChart({ data, total, centerLabel }) {
  const sum = data.reduce((acc, item) => acc + item.value, 0)
  let current = 0

  const gradient = data
    .map((item) => {
      const start = current
      current += sum ? (item.value / sum) * 100 : 0
      return `${item.color} ${start}% ${current}%`
    })
    .join(', ')

  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-4 sm:gap-6 sm:flex-row">
      <div
        className="relative h-36 w-36 shrink-0 rounded-full min-[390px]:h-40 min-[390px]:w-40 sm:h-56 sm:w-56"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label={`${centerLabel}: ${total}`}
      >
        <div className="absolute inset-[31%] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-semibold text-slate-900">
            {total}
          </span>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex min-w-0 items-start gap-2 text-[11px] sm:text-xs">
            <span
              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 flex-1 break-words text-slate-700">
              {item.label}
            </span>
            <span className="shrink-0 font-medium text-slate-600 sm:ml-1">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBarChart({
  data,
  color = COLORS.purple,
  maxValue,
}) {
  const max = maxValue || Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)] items-center gap-2 sm:grid-cols-[minmax(90px,1fr)_minmax(0,2fr)] sm:gap-3"
        >
          <span className="break-words text-right text-[9px] leading-3 text-slate-600 sm:text-xs sm:leading-4">
            {item.label}
          </span>

          <div className="relative h-7 min-w-0 overflow-hidden bg-slate-100 sm:h-8">
            <div
              className="flex h-full items-center justify-end px-1.5 text-[10px] font-medium text-slate-800 transition-all sm:px-2"
              style={{
                width: `${(item.value / max) * 100}%`,
                minWidth: item.value > 0 ? '22px' : '0',
                backgroundColor: color,
                opacity: 0.85,
              }}
            >
              {item.value > 0 ? item.value : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center justify-between gap-2 rounded-2xl bg-white p-3 text-left transition hover:shadow-md sm:gap-3 sm:p-5"
    >
      <div className="min-w-0">
        <p className="break-words text-xs leading-4 text-slate-700 sm:text-sm sm:leading-normal">
          {title}
        </p>
        <p className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
          {value}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#29458F]">
          Lihat detail <ChevronRight size={14} />
        </span>
      </div>

      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>
        <Icon size={25} />
      </div>
    </button>
  )
}

export default function AdminDashboard({ setActiveMenu }) {

  function openComplaintTab(tab) {
    sessionStorage.setItem('pengaduanTab', tab)
    setActiveMenu('Pengaduan')
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#F0F0F0] p-3 sm:p-5 lg:px-10 lg:py-5">

      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:mb-5 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          Dashboard
        </h1>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <select
            defaultValue="Bulan ini"
            aria-label="Periode laporan"
            className="h-9 w-full min-w-0 rounded-lg border-0 bg-white px-3 text-xs text-slate-700 outline-none sm:w-auto sm:min-w-[120px]"
          >
            <option>Hari ini</option>
            <option>7 hari terakhir</option>
            <option>Bulan ini</option>
            <option>30 hari terakhir</option>
            <option>Tahun ini</option>
          </select>

          <div className="flex h-10 w-full min-w-0 items-center gap-1.5 rounded-lg bg-white px-2 text-xs text-slate-700 sm:h-9 sm:w-auto sm:gap-2 sm:px-3">
            <CalendarDays size={14} className="shrink-0 text-[#29458F]" />

            <input
              type="date"
              aria-label="Tanggal mulai"
              defaultValue="2026-04-01"
              className="min-w-0 w-0 flex-1 bg-transparent text-[11px] outline-none sm:w-[115px] sm:flex-none sm:text-xs"
            />

            <span className="shrink-0">–</span>

            <input
              type="date"
              aria-label="Tanggal akhir"
              defaultValue="2026-04-30"
              className="min-w-0 w-0 flex-1 bg-transparent text-[11px] outline-none sm:w-[115px] sm:flex-none sm:text-xs"
            />
          </div>

          <div className="flex min-w-0 gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#29458F] px-2 text-xs text-white hover:bg-blue-900 sm:flex-none sm:px-3"
            >
              <FileSpreadsheet size={14} className="shrink-0" />
              Export Excel
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#29458F] px-2 text-xs text-white hover:bg-blue-900 sm:flex-none sm:px-3"
            >
              <FileText size={14} className="shrink-0" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {statistics.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="flex min-h-[112px] min-w-0 items-start justify-between gap-2 rounded-2xl bg-white p-3 sm:min-h-[126px] sm:p-5"
          >
            <div>
              <p className="break-words text-xs leading-4 text-slate-700 sm:text-sm sm:leading-normal">
                {title}
              </p>
              <p className="mt-3 text-2xl font-semibold leading-none text-slate-950 sm:mt-4 sm:text-4xl">
                {value}
              </p>
            </div>

            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${color}`}>
              <Icon size={18} className="sm:h-[21px] sm:w-[21px]" />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:mt-4 xl:grid-cols-2">

        <Panel title="Jumlah Pengaduan berdasarkan Lokasi">
          <DonutChart
            centerLabel="Jumlah pengaduan berdasarkan lokasi"
            total={120}
            data={[
              { label: 'di Halte', value: 80, color: COLORS.purple },
              { label: 'di Bus', value: 40, color: COLORS.coral },
            ]}
          />
        </Panel>

        <Panel title="Pengaduan ditolak berdasarkan Alasan">
          <DonutChart
            centerLabel="Pengaduan ditolak berdasarkan alasan"
            total={20}
            data={rejectionReasons}
          />
        </Panel>

        <Panel title="Pengaduan di Halte berdasarkan Kategori">
          <HorizontalBarChart
            data={halteCategories}
            color={COLORS.purple}
            maxValue={40}
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-700">
            <span className="h-2 w-2 bg-purple-400" />
            Pengaduan di Halte
          </div>
        </Panel>

        <Panel title="Pengaduan di Bus berdasarkan Kategori">
          <HorizontalBarChart
            data={busCategories}
            color={COLORS.coral}
            maxValue={20}
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-700">
            <span className="h-2 w-2 bg-rose-400" />
            Pengaduan di Bus
          </div>
        </Panel>

      </section>

      <section className="mt-4 sm:mt-5">
        <h2 className="mb-3 text-base font-semibold text-slate-800">
          Laporan Pengaduan Terbaru
        </h2>

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3">

          <SummaryCard
            title="Pengaduan Baru"
            value={12}
            icon={FilePlus2}
            color="bg-cyan-100 text-sky-500"
            onClick={() => openComplaintTab('Laporan Masuk')}
          />

          <SummaryCard
            title="Menunggu ditangani"
            value={17}
            icon={Search}
            color="bg-violet-100 text-violet-600"
            onClick={() => openComplaintTab('Menunggu Ditangani')}
          />

          <SummaryCard
            title="Proses Penanganan"
            value={10}
            icon={ClipboardCheck}
            color="bg-orange-100 text-orange-500"
            onClick={() => openComplaintTab('Proses Penanganan')}
          />

        </div>
      </section>
    </main>
  )
}