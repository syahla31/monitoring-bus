import { useMemo, useState } from "react";

const TABS = [
  "Laporan Masuk",
  "Menunggu Ditangani",
  "Proses Penanganan",
  "Laporan Selesai",
];

const INITIAL_REPORTS = [
  {
    id: 1,
    reportNumber: "LP-20261014120132CKR",
    reportDate: "14/10/2026 12:01",
    reporterName: "Guest",
    reporterEmail: "guest@gmail.com",
    category: "Kondisi Halte/Bus Stop",
    description: "Test pengaduan analysis with location",
    evidence: "",
    status: "Laporan Masuk",
    officer: "",
    handlingDate: "",
  },
  {
    id: 2,
    reportNumber: "LP-20261014115947RLA",
    reportDate: "14/10/2026 11:59",
    reporterName: "Guest",
    reporterEmail: "guest@gmail.com",
    category: "Kondisi Halte/Bus Stop",
    description: "Terdapat fasilitas halte yang mengalami kerusakan.",
    evidence: "",
    status: "Laporan Masuk",
    officer: "",
    handlingDate: "",
  },
];

const OFFICERS = [
  "Budi Santoso",
  "Andi Pratama",
  "Rizky Maulana",
  "Dewi Anggraini",
];

export default function Pengaduan() {
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = sessionStorage.getItem("pengaduanTab");
    sessionStorage.removeItem("pengaduanTab");

    return TABS.includes(requestedTab) ? requestedTab : TABS[0];
  });

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [handlingDate, setHandlingDate] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");

  const [notification, setNotification] = useState("");

  // FILTER DATA
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesTab = report.status === activeTab;
      const keyword = search.toLowerCase();

      const matchesSearch =
        report.reportNumber.toLowerCase().includes(keyword) ||
        report.reportDate.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword);

      return matchesTab && matchesSearch;
    });
  }, [reports, activeTab, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / pageSize)
  );

  const displayedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const firstData =
    filteredReports.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const lastData = Math.min(
    currentPage * pageSize,
    filteredReports.length
  );

  // PINDAH TAB
  function changeTab(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch("");
  }

  // DETAIL LAPORAN
  function openDetail(report) {
    setSelectedReport(report);
    setShowDetailModal(true);
  }

  function closeDetail() {
    setShowDetailModal(false);
    setSelectedReport(null);
  }

  // JADWAL PENANGANAN
  function openSchedule() {
    setHandlingDate("");
    setSelectedOfficer("");
    setShowScheduleModal(true);
  }

  function closeSchedule() {
    setShowScheduleModal(false);
  }

  function saveSchedule() {
    if (!handlingDate || !selectedOfficer) {
      setNotification("Tanggal dan petugas wajib dipilih.");
      return;
    }

    if (!selectedReport) return;

    setReports((previous) =>
      previous.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: "Menunggu Ditangani",
              handlingDate,
              officer: selectedOfficer,
            }
          : report
      )
    );

    setShowScheduleModal(false);
    setShowDetailModal(false);
    setSelectedReport(null);

    setActiveTab("Menunggu Ditangani");
    setCurrentPage(1);
    setSearch("");

    setNotification("Jadwal penanganan berhasil disimpan.");
  }

  // TOLAK LAPORAN
  function rejectReport() {
    if (!selectedReport) return;

    setReports((previous) =>
      previous.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: "Laporan Ditolak" }
          : report
      )
    );

    setShowDetailModal(false);
    setSelectedReport(null);

    setNotification("Laporan berhasil ditolak.");
  }

  // EXPORT CSV (DAPAT DIBUKA DI EXCEL)
  function exportCSV() {
    const headers = [
      "No",
      "Nomor Laporan",
      "Waktu Laporan",
      "Kategori Pengaduan",
      "Status",
      "Tanggal Penanganan",
      "Petugas",
    ];

    const rows = filteredReports.map((report, index) => [
      index + 1,
      report.reportNumber,
      report.reportDate,
      report.category,
      report.status,
      report.handlingDate,
      report.officer,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan-pengaduan.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function printReports() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] px-4 py-8 md:px-6 lg:px-10">
      {/* JUDUL */}
      <h1 className="mb-6 text-2xl font-semibold text-[#172B43]">
        Laporan Pengaduan
      </h1>

      {/* TAB STATUS */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => changeTab(tab)}
            className={`min-w-fit rounded-t-xl border border-b-0 border-[#0CA6B7] px-5 py-4 text-sm font-semibold transition md:px-8 ${
              activeTab === tab
                ? "bg-[#0CA6B7] text-white"
                : "bg-[#E8F4FA] text-[#079EB4] hover:bg-[#DDF4F8]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTAINER TABEL */}
      <div className="rounded-b-lg rounded-tr-lg border border-[#D5D5D5] bg-white p-4 md:p-5">
        {/* TOOLBAR */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#D0D0D0] pb-5 xl:flex-row xl:items-center">
          {/* JUMLAH DATA */}
          <div className="flex items-center gap-3 text-base text-[#172B43]">
            <span className="whitespace-nowrap">Tampilkan</span>

            <CustomPageSize
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
            />

            <span>data</span>
          </div>

          {/* SEARCH DAN EXPORT */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-base text-[#172B43]">
              Search:
            </label>

            <input
              type="text"
              placeholder="Cari Data"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[42px] w-full rounded-md border border-[#DCE1E7] px-3 text-sm outline-none transition focus:border-[#0CA6B7] sm:w-[205px]"
            />

            {/* EXPORT EXCEL */}
            <button
              onClick={exportCSV}
              title="Export Excel (CSV)"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#0CA6B7] text-white transition hover:bg-[#0796A7]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M8 13l6 6M14 13l-6 6" />
              </svg>
            </button>

            {/* EXPORT PDF / PRINT */}
            <button
              onClick={printReports}
              title="Print PDF"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#0CA6B7] text-white transition hover:bg-[#0796A7]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M8 14h8M8 17h5" />
                <text
                  x="12"
                  y="12"
                  fontSize="4"
                  fill="currentColor"
                  stroke="none"
                  textAnchor="middle"
                >
                  PDF
                </text>
              </svg>
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="h-[54px] bg-[#E1FAFC] text-[#079FB4]">
                <th className="w-[7%] px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>No</span>
                  </div>
                </th>

                <th className="w-[30%] px-3 py-3">
                  <SortHeader label="Nomor Laporan" />
                </th>

                <th className="w-[23%] px-3 py-3">
                  <SortHeader label="Waktu Laporan" />
                </th>

                <th className="w-[28%] px-3 py-3">
                  <SortHeader label="Kategori Pengaduan" />
                </th>

                <th className="w-[12%] px-3 py-3 text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedReports.length > 0 ? (
                displayedReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="border-b border-[#DCE1E7] text-[15px] text-black transition hover:bg-[#F8FCFD]"
                  >
                    <td className="px-3 py-4 text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td className="px-3 py-4">
                      {report.reportNumber}
                    </td>

                    <td className="px-3 py-4">
                      {report.reportDate}
                    </td>

                    <td className="px-3 py-4">
                      {report.category}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => openDetail(report)}
                        className="rounded-xl bg-[#0CA6B7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#078F9F]"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border-b border-[#DCE1E7] px-4 py-12 text-center text-sm text-slate-400"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-[#172B43]">
            Menampilkan {firstData} - {lastData} dari{" "}
            {filteredReports.length} data
          </p>

          <div className="flex items-center overflow-hidden rounded-lg border border-[#D9DEE4]">
            <PaginationButton
              label="«"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            />

            <PaginationButton
              label="‹"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            />

            <span className="flex h-[50px] min-w-[46px] items-center justify-center bg-[#1675E8] px-3 text-base font-medium text-white">
              {currentPage}
            </span>

            <PaginationButton
              label="›"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            />

            <PaginationButton
              label="»"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
            />
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* MODAL DETAIL LAPORAN */}
      {/* ===================================== */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-3 backdrop-blur-sm md:p-6">
          <div className="flex max-h-[95vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 pb-4 pt-5 md:px-6">
              <h2 className="text-lg font-semibold text-[#252A32] md:text-2xl">
                Detail Laporan Pengaduan
              </h2>

              <button
                onClick={closeDetail}
                aria-label="Tutup detail laporan"
                className="text-3xl leading-none text-slate-500 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5 md:px-6">
              <div className="mb-5 rounded-lg border border-slate-200 p-4 md:p-5">
                <DetailRow
                  label="Nama Pelapor"
                  value={selectedReport.reporterName}
                />
                <DetailRow
                  label="Email"
                  value={selectedReport.reporterEmail}
                />
              </div>

              <div className="mb-5 rounded-lg border border-slate-200 p-4 md:p-5">
                <DetailRow
                  label="Nomor Laporan"
                  value={selectedReport.reportNumber}
                />
                <DetailRow
                  label="Waktu Laporan"
                  value={selectedReport.reportDate}
                />
              </div>

              <div className="mb-5 rounded-lg border border-slate-200 p-4 md:p-5">
                <DetailRow
                  label="Kategori Pengaduan"
                  value={selectedReport.category}
                />
                <DetailRow
                  label="Detail Laporan"
                  value={selectedReport.description}
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-800 md:text-base">
                  Bukti Foto/Video Laporan
                </h3>

                {selectedReport.evidence ? (
                  <img
                    src={selectedReport.evidence}
                    alt="Bukti laporan"
                    className="h-44 w-44 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
                    Tidak ada bukti foto
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto flex flex-col-reverse justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row md:px-6">
              <button
                onClick={rejectReport}
                className="rounded-xl bg-[#EEEEEE] px-7 py-3 text-sm font-medium text-slate-800 hover:bg-slate-200 md:text-base"
              >
                Tolak Laporan
              </button>

              <button
                onClick={openSchedule}
                className="rounded-xl bg-[#0CA6B7] px-7 py-3 text-sm font-semibold text-white hover:bg-[#0993A3] md:text-base"
              >
                Verifikasi & Buat Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* MODAL JADWAL PENANGANAN */}
      {/* ===================================== */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 p-3 backdrop-blur-sm md:p-6">
          <div className="w-full max-w-[1100px] rounded-xl border border-slate-300 bg-white p-5 shadow-2xl md:p-6">
            <h2 className="mb-8 text-center text-xl font-semibold text-[#252A32] md:text-2xl">
              Jadwal Penanganan
            </h2>

            {/* TANGGAL */}
            <div className="mb-5">
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Pelaksanaan Penanganan
              </label>

              <CustomDatePicker
                value={handlingDate}
                onChange={setHandlingDate}
              />
            </div>

            {/* PETUGAS */}
            <div className="mb-16">
              <CustomOfficerDropdown
                value={selectedOfficer}
                onChange={setSelectedOfficer}
                officers={OFFICERS}
              />
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                onClick={closeSchedule}
                className="rounded-xl bg-[#EEEEEE] px-6 py-3 text-sm font-medium text-slate-800 hover:bg-slate-200 md:text-base"
              >
                Kembali
              </button>

              <button
                onClick={saveSchedule}
                className="rounded-xl bg-[#0CA6B7] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0993A3] md:text-base"
              >
                Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFIKASI */}
      {notification && (
        <div className="fixed right-4 top-5 z-[100] max-w-sm rounded-xl bg-slate-800 px-5 py-3 text-sm text-white shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <span>{notification}</span>

            <button
              onClick={() => setNotification("")}
              className="text-lg text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================================== */
/* SORT HEADER */
/* ===================================== */
function SortHeader({ label }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>

      <span className="flex flex-col text-[11px] leading-[9px] text-[#BCEEF1]">
        <span>▲</span>
        <span>▼</span>
      </span>
    </div>
  );
}

/* ===================================== */
/* PAGINATION BUTTON */
/* ===================================== */
function PaginationButton({ label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-[50px] min-w-[43px] items-center justify-center border-r border-[#D9DEE4] bg-[#E9ECEF] px-3 text-base text-slate-600 transition hover:bg-[#DDE2E7] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

/* ===================================== */
/* CUSTOM PAGE SIZE */
/* ===================================== */
function CustomPageSize({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[42px] min-w-[92px] items-center justify-between rounded-md border border-[#DCE1E7] bg-white px-3 text-sm text-slate-800 hover:border-[#0CA6B7]"
      >
        {value}

        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            aria-label="Tutup pilihan jumlah data"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {[5, 10, 25, 50, 100].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  onChange(size);
                  setIsOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#E7F8FA] ${
                  value === size
                    ? "font-semibold text-[#0CA6B7]"
                    : "text-slate-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================================== */
/* DETAIL ROW */
/* ===================================== */
function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-1.5 sm:grid-cols-[minmax(180px,350px)_1fr] sm:gap-4">
      <span className="text-sm text-slate-500 md:text-base">
        {label}
      </span>

      <span className="break-words text-sm font-medium text-slate-800 md:text-base">
        {value || "-"}
      </span>
    </div>
  );
}

/* ===================================== */
/* CUSTOM DATE PICKER */
/* ===================================== */
function CustomDatePicker({ value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [isOpen, setIsOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const monthNames = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember",
  ];

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function formatDate(date) {
    if (!date) return "";

    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }

  function selectDate(day) {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) return;

    const formatted = [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    onChange(formatted);
    setIsOpen(false);
  }

  function changeMonth(direction) {
    setCurrentMonth(new Date(year, month + direction, 1));
  }

  function isSelected(day) {
    if (!value || !day) return false;

    const [y, m, d] = value.split("-").map(Number);

    return y === year && m === month + 1 && d === day;
  }

  function isPast(day) {
    if (!day) return false;

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    return date < today;
  }

  const cannotGoPrevious =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month <= today.getMonth());

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left transition ${
          isOpen
            ? "border-[#0CA6B7] ring-2 ring-[#0CA6B7]/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value ? formatDate(value) : "dd/mm/yyyy"}
        </span>

        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-slate-500"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup kalender"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute left-0 top-full z-50 mt-2 w-[310px] max-w-[calc(100vw-48px)] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.16)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-800">
                  {monthNames[month]} {year}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Pilih tanggal penanganan
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  disabled={cannotGoPrevious}
                  aria-label="Bulan sebelumnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Bulan berikutnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7">
              {days.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day, index) => {
                const selected = isSelected(day);
                const disabled = !day || isPast(day);

                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDate(day)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition ${
                      selected
                        ? "bg-[#0CA6B7] font-semibold text-white shadow-md shadow-[#0CA6B7]/20"
                        : isToday
                        ? "border border-[#0CA6B7] font-semibold text-[#0CA6B7]"
                        : disabled
                        ? "cursor-not-allowed text-slate-300"
                        : "text-slate-700 hover:bg-[#E7F8FA] hover:text-[#0CA6B7]"
                    }`}
                  >
                    {day || ""}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-medium text-slate-500 hover:text-red-500"
              >
                Hapus tanggal
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentMonth(
                    new Date(today.getFullYear(), today.getMonth(), 1)
                  );
                }}
                className="text-xs font-semibold text-[#0CA6B7] hover:text-[#088B99]"
              >
                Hari ini
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ===================================== */
/* CUSTOM DROPDOWN PETUGAS */
/* ===================================== */
function CustomOfficerDropdown({ value, onChange, officers }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left transition ${
          isOpen
            ? "border-[#0CA6B7] ring-2 ring-[#0CA6B7]/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value || "Pilih Petugas"}
        </span>

        <svg
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup pilihan petugas"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
            {officers.map((officer) => {
              const selected = value === officer;

              return (
                <button
                  key={officer}
                  type="button"
                  onClick={() => {
                    onChange(officer);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "bg-[#E7F8FA] font-semibold text-[#0CA6B7]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {officer}

                  {selected && (
                    <svg
                      className="h-4 w-4 text-[#0CA6B7]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}