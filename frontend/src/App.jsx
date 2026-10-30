import { useState, useRef, useEffect } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

import SuperAdminLayout from "./layouts/SuperAdminLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StatCard from "./components/StatCard";
import ComplaintChart from "./pages/superadmin/ComplaintChart";
import RejectionChart from "./pages/superadmin/RejectionChart";
import NewComplaintChart from "./pages/superadmin/NewComplaintChart";
import PendingComplaintChart from "./pages/superadmin/PendingComplaintChart";
import AccessManagement from "./pages/superadmin/AccessManagement";
import MasterData from "./pages/superadmin/MasterData";
import ClientManagement from "./pages/superadmin/ClientManagement";
import ComplaintManagement from "./pages/superadmin/ComplaintManagement";
import Login from "./components/Login";
import RoleAkses from "./pages/admin/RoleAkses";
import AksesAkun from "./pages/admin/AksesAkun";
import MasterDataAdmin from "./pages/admin/MasterData";
import DaftarPetugas from "./pages/admin/DaftarPetugas";
import Pengaduan from "./pages/admin/Pengaduan";

const PERIODS = [
  "Hari ini",
  "7 hari terakhir",
  "Bulan ini",
  "30 hari terakhir",
  "Tahun ini",
];

const SOURCES = [
  "Semua Asal Laporan",
  "Trans Depok",
  "Sibesti",
  "Sobat Beken",
  "Kabogor",
];

const pad = (value) => String(value).padStart(2, "0");

const toISO = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromISO = (value) => {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (value) =>
  fromISO(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function CustomSelect({ value, options, onChange, width = "w-full" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className={`relative min-w-0 ${width}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-sm text-slate-700 shadow-sm transition ${
          open
            ? "border-[#F2B600] ring-2 ring-amber-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[80] mt-2 max-h-64 w-full min-w-44 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                value === option
                  ? "bg-amber-50 font-medium text-amber-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{option}</span>
              {value === option && (
                <Check size={15} className="shrink-0 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePicker({ label, value, onChange, min, max }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => fromISO(value));
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();

  const cells = Array.from(
    { length: Math.ceil((offset + days) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= days ? day : null;
    },
  );

  function chooseDate(day) {
    const selected = toISO(new Date(year, month, day));

    if (min && selected < min) return;
    if (max && selected > max) return;

    onChange(selected);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          setViewDate(fromISO(value));
          setOpen((current) => !current);
        }}
        className={`flex h-10 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left transition ${
          open
            ? "bg-amber-50 text-amber-900"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <CalendarDays size={15} className="shrink-0 text-slate-400" />
        <span className="min-w-0 flex-1 truncate text-xs">
          {formatDate(value)}
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[90] mt-2 w-[min(300px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Bulan sebelumnya"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-800"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-semibold capitalize text-slate-800">
              {viewDate.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
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
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
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
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const date = toISO(new Date(year, month, day));
              const selected = date === value;
              const disabled = (min && date < min) || (max && date > max);

              return (
                <button
                  key={date}
                  type="button"
                  disabled={Boolean(disabled)}
                  onClick={() => chooseDate(day)}
                  className={`flex aspect-square items-center justify-center rounded-lg text-xs transition ${
                    selected
                      ? "bg-[#F2B600] font-bold text-slate-900"
                      : "text-slate-700 hover:bg-amber-50"
                  } ${disabled ? "cursor-not-allowed opacity-25" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Hapus tanggal
            </button>

            <button
              type="button"
              onClick={() => {
                const today = toISO(new Date());

                if ((!min || today >= min) && (!max || today <= max)) {
                  setViewDate(fromISO(today));
                  onChange(today);
                  setOpen(false);
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
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Preview sementara: gunakan ?role=admin untuk melihat dashboard Admin.
  // Nanti state ini diganti dengan role asli dari autentikasi Laravel.
  const [userRole] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("role") === "admin" ? "admin" : "superadmin";
  });
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [period, setPeriod] = useState("Bulan ini");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-28");
  const [source, setSource] = useState("Semua Asal Laporan");

  function selectPeriod(item) {
    setPeriod(item);

    const today = new Date();
    let start = new Date(today);

    if (item === "Hari ini") {
      start = new Date(today);
    } else if (item === "7 hari terakhir") {
      start.setDate(today.getDate() - 6);
    } else if (item === "Bulan ini") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (item === "30 hari terakhir") {
      start.setDate(today.getDate() - 29);
    } else if (item === "Tahun ini") {
      start = new Date(today.getFullYear(), 0, 1);
    }

    setStartDate(toISO(start));
    setEndDate(toISO(today));
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Tampilan Admin untuk preview. Role produksi akan berasal dari Laravel.
  if (userRole === "admin") {
    return (
      <AdminLayout
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={() => setIsLoggedIn(false)}
      >
        {activeMenu === "Dashboard" ? (
          <AdminDashboard setActiveMenu={setActiveMenu} />
        ) : activeMenu === "Role Akses" ? (
          <RoleAkses />
        ) : activeMenu === "Akses Akun" ? (
          <AksesAkun />
        ) : activeMenu === "Kategori Pengaduan" ? (
          <MasterDataAdmin/>
        ): activeMenu === "Daftar Petugas" ? (
          <DaftarPetugas />
        ) : activeMenu === "Pengaduan" ? (
          <Pengaduan />
        ) : (
          <main className="min-h-screen p-6">
            <h1 className="text-xl font-semibold text-slate-800">
              {activeMenu}
            </h1>
          </main>
        )}
      </AdminLayout>
    );
  }

  return (
    <SuperAdminLayout
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      onLogout={() => setIsLoggedIn(false)}
    >
      {activeMenu === "Dashboard" ? (
        <main className="w-full min-w-0 overflow-x-clip bg-slate-50 p-3 sm:p-5 lg:p-6">
          <div className="mb-5 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>

            <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center xl:w-auto xl:flex-nowrap">
              <div className="col-span-2 sm:col-span-1 sm:w-36">
                <CustomSelect
                  value={period}
                  options={PERIODS}
                  onChange={selectPeriod}
                />
              </div>

              <div className="col-span-2 flex min-w-0 items-center rounded-lg border border-slate-200 bg-white px-1 shadow-sm sm:col-span-1 sm:w-[300px]">
                <DatePicker
                  label="Tanggal mulai"
                  value={startDate}
                  max={endDate}
                  onChange={(value) => {
                    if (!value) return;
                    setStartDate(value);
                    setPeriod("Rentang khusus");
                  }}
                />

                <span className="shrink-0 text-xs text-slate-300">—</span>

                <DatePicker
                  label="Tanggal akhir"
                  value={endDate}
                  min={startDate}
                  onChange={(value) => {
                    if (!value) return;
                    setEndDate(value);
                    setPeriod("Rentang khusus");
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2.5 text-[11px] font-medium text-white transition hover:bg-slate-700 sm:gap-2 sm:px-3 sm:text-xs"
              >
                <FileSpreadsheet size={15} className="shrink-0" />
                Export Excel
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2.5 text-[11px] font-medium text-white transition hover:bg-slate-700 sm:gap-2 sm:px-3 sm:text-xs"
              >
                <FileText size={15} className="shrink-0" />
                Export PDF
              </button>
            </div>
          </div>

          <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Pengaduan"
              value="120"
              description="Seluruh laporan masuk"
              icon={ClipboardList}
              color="blue"
            />
            <StatCard
              title="Pengaduan Diproses"
              value="20"
              description="Sedang ditangani"
              icon={Clock3}
              color="yellow"
            />
            <StatCard
              title="Pengaduan Selesai"
              value="80"
              description="Penanganan selesai"
              icon={CheckCircle2}
              color="green"
            />
            <StatCard
              title="Pengaduan Ditolak"
              value="20"
              description="Laporan ditolak"
              icon={XCircle}
              color="red"
            />
          </section>

          <section className="mt-3 grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
              <h2 className="mb-3 text-sm font-medium text-slate-800 sm:mb-4">
                Pengaduan berdasarkan Asal Laporan
              </h2>
              <ComplaintChart />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                <h2 className="text-sm font-medium text-slate-800">
                  Pengaduan Ditolak berdasarkan Alasan
                </h2>

                <div className="w-full sm:w-48">
                  <CustomSelect
                    value={source}
                    options={SOURCES}
                    onChange={setSource}
                  />
                </div>
              </div>
              <RejectionChart />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
              <h2 className="mb-3 text-sm font-medium text-slate-800 sm:mb-4">
                Laporan Pengaduan Baru
              </h2>
              <NewComplaintChart />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
              <h2 className="mb-3 text-sm font-medium text-slate-800 sm:mb-4">
                Pengaduan Menunggu Ditangani
              </h2>
              <PendingComplaintChart />
            </div>
          </section>
        </main>
      ) : activeMenu === "Daftar Role" || activeMenu === "Daftar Akun" ? (
        <AccessManagement activePage={activeMenu} />
      ) : activeMenu === "Master Data" ||
        activeMenu === "Kategori Pengaduan" ? (
        <MasterData />
      ) : activeMenu === "Manajemen Klien" ? (
        <ClientManagement />
      ) : activeMenu === "Laporan Pengaduan" ? (
        <ComplaintManagement />
      ) : (
        <main className="min-h-full w-full min-w-0 bg-slate-50 p-3 sm:p-5 lg:p-6">
          <p className="mb-2 text-xs text-slate-400">NavBus / Monitoring</p>

          <h1 className="text-xl font-bold text-slate-900">{activeMenu}</h1>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Area ini akan kita isi dengan fitur {activeMenu.toLowerCase()}.
            </p>
          </div>
        </main>
      )}
    </SuperAdminLayout>
  );
}

export default App;