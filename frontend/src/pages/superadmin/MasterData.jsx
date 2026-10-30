import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const INITIAL_DATA = [
  {
    id: 1,
    name: "Fasilitas",
    description: "Pengaduan terkait fasilitas bus",
  },
  {
    id: 2,
    name: "Keamanan",
    description: "Pengaduan terkait keamanan penumpang",
  },
  {
    id: 3,
    name: "Pelayanan",
    description: "Pengaduan terkait pelayanan",
  },
  {
    id: 4,
    name: "Operasional",
    description: "Pengaduan terkait operasional bus",
  },
];

const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-50";

function Popup({
  title,
  message,
  type = "success",
  confirmText = "Oke",
  cancelText,
  onConfirm,
  onCancel,
}) {
  const success = type === "success";
  const warning = type === "warning";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[4px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[360px] rounded-[20px] bg-white px-6 py-8 text-center shadow-2xl"
      >
        {(success || warning) && (
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              success
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {success ? <CheckCircle2 size={26} /> : <AlertTriangle size={26} />}
          </div>
        )}

        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

        <p className="mt-3 text-xs leading-5 text-slate-600">{message}</p>

        <div className="mt-7 flex justify-center gap-2">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomSelect({ value, options, onChange, width = "w-auto" }) {
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
    <div ref={ref} className={`relative ${width}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-9 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 text-xs text-slate-700 shadow-sm transition ${
          open
            ? "border-[#F2B600] ring-2 ring-amber-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-2 max-h-60 w-full min-w-24 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {options.map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                String(value) === String(option)
                  ? "bg-amber-50 font-medium text-amber-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{option}</span>
              {String(value) === String(option) && (
                <Check size={13} className="shrink-0 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({ title, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-md p-1.5 transition ${
        danger
          ? "text-slate-600 hover:bg-red-50 hover:text-red-600"
          : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function MasterData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [popup, setPopup] = useState(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return data;

    return data.filter((item) =>
      [item.name, item.description].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const visibleData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setPopup(null);
        setDeleteTarget(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function notify(title, message, type = "success") {
    setPopup({ title, message, type });
  }

  function openAddForm() {
    setEditing(null);
    setViewing(false);
    setFormError("");
    setForm({ name: "", description: "" });
    setView("form");
  }

  function openEditForm(item, readOnly = false) {
    setEditing(item);
    setViewing(readOnly);
    setFormError("");
    setForm({
      name: item.name,
      description: item.description,
    });
    setView("form");
  }

  function saveData(event) {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setFormError("Nama kategori wajib diisi.");
      return;
    }

    const duplicate = data.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== editing?.id,
    );

    if (duplicate) {
      setFormError("Nama kategori sudah digunakan.");
      return;
    }

    if (editing) {
      setData((previous) =>
        previous.map((item) =>
          item.id === editing.id ? { ...item, name, description } : item,
        ),
      );
    } else {
      setData((previous) => [
        ...previous,
        {
          id: Date.now(),
          name,
          description,
        },
      ]);
    }

    const wasEditing = Boolean(editing);

    setView("list");
    setEditing(null);
    setPage(1);

    notify(
      wasEditing ? "Data Berhasil Diperbarui" : "Data Berhasil Ditambahkan",
      wasEditing
        ? "Kategori pengaduan berhasil diperbarui."
        : "Kategori pengaduan baru berhasil ditambahkan.",
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const deletedName = deleteTarget.name;

    setData((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id),
    );

    setDeleteTarget(null);
    setPage(1);

    notify(
      "Data Berhasil Dihapus",
      `Kategori "${deletedName}" berhasil dihapus.`,
    );
  }

  function exportNotice(format) {
    notify(
      `Export ${format} Belum Tersedia`,
      `Fitur export ${format} belum dihubungkan. Data pada halaman ini masih menggunakan data dummy.`,
      "warning",
    );
  }

  return (
    <main className="min-h-full w-full min-w-0 bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-slate-800">
          Kategori Pengaduan
        </h1>
      </div>

      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {view === "list" ? (
          <>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-xs text-slate-600">
                  <span>Tampilkan</span>

                  <CustomSelect
                    value={pageSize}
                    options={[10, 25, 50]}
                    width="w-[76px]"
                    onChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                  />

                  <span>data</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <label className="relative col-span-2 min-w-0 sm:col-span-1 sm:w-52">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Cari kategori..."
                    className={`${inputClass} pl-9`}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => exportNotice("Excel")}
                  title="Export Excel"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs text-white transition hover:bg-slate-700"
                >
                  <FileSpreadsheet size={15} />
                  <span className="sm:hidden">Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportNotice("PDF")}
                  title="Export PDF"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs text-white transition hover:bg-slate-700"
                >
                  <FileText size={15} />
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs font-medium text-white transition hover:bg-slate-700 sm:col-span-1"
                >
                  <Plus size={15} />
                  Kategori Pengaduan
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-xs">
                <thead className="bg-amber-50 text-slate-700">
                  <tr>
                    <th className="w-14 px-3 py-3 font-medium">No.</th>
                    <th className="px-3 py-3 font-medium">Nama Kategori</th>
                    <th className="px-3 py-3 font-medium">Deskripsi</th>
                    <th className="w-28 px-3 py-3 text-center font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-3 py-3.5">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="px-3 py-3.5 font-medium text-slate-800">
                        {item.name}
                      </td>

                      <td className="px-3 py-3.5">{item.description || "-"}</td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-0.5">
                          <ActionButton
                            title="Hapus"
                            danger
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 size={14} />
                          </ActionButton>

                          <ActionButton
                            title="Edit"
                            onClick={() => openEditForm(item)}
                          >
                            <Pencil size={14} />
                          </ActionButton>

                          <ActionButton
                            title="Lihat detail"
                            onClick={() => openEditForm(item, true)}
                          >
                            <Eye size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleData.length === 0 && (
                <div className="px-4 py-12 text-center text-xs text-slate-500">
                  Data kategori tidak ditemukan.
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">
                Menampilkan{" "}
                {filteredData.length ? (currentPage - 1) * pageSize + 1 : 0}
                {" - "}
                {Math.min(
                  currentPage * pageSize,
                  filteredData.length,
                )} dari {filteredData.length} data
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
                          ? "bg-amber-400 font-semibold text-black"
                          : "text-slate-600 hover:bg-slate-100"
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
          </>
        ) : (
          <form onSubmit={saveData}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
              <button
                type="button"
                aria-label="Kembali ke daftar"
                onClick={() => {
                  setView("list");
                  setEditing(null);
                  setViewing(false);
                  setFormError("");
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft size={17} />
              </button>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {viewing
                    ? "Detail Kategori Pengaduan"
                    : editing
                      ? "Edit Kategori Pengaduan"
                      : "Tambah Kategori Pengaduan"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {viewing
                    ? "Detail data kategori yang dipilih."
                    : "Lengkapi informasi kategori pengaduan."}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-slate-700">
                  Nama Kategori
                  <span className="ml-1 text-red-500">*</span>
                </span>

                <input
                  autoFocus={!viewing}
                  disabled={viewing}
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Masukkan nama kategori"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-slate-700">
                  Deskripsi
                </span>

                <textarea
                  disabled={viewing}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Masukkan deskripsi kategori"
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-50"
                />
              </label>

              {formError && (
                <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
                  <AlertTriangle size={15} />
                  {formError}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setEditing(null);
                  setViewing(false);
                  setFormError("");
                }}
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {viewing ? "Kembali" : "Batal"}
              </button>

              {!viewing && (
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-xs font-medium text-white hover:bg-slate-800"
                >
                  <Check size={15} />
                  Simpan
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      {deleteTarget && (
        <Popup
          title="Hapus Kategori Pengaduan"
          message="Anda yakin ingin menghapus kategori pengaduan ini?"
          type="delete"
          confirmText="Ya, Hapus"
          cancelText="Kembali"
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
  );
}