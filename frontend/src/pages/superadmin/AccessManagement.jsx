import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

const MENUS = [
  "Dashboard",
  "Manajemen Akses",
  "Manajemen Klien",
  "Master Data",
  "Laporan Pengaduan",
];

const ACTIONS = ["Lihat", "Tambah", "Edit", "Hapus"];

const INITIAL_ROLES = [
  {
    id: 1,
    name: "Admin",
    description: "Administrator sistem",
    permissions: {
      Dashboard: ["Lihat"],
      "Manajemen Akses": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Manajemen Klien": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Master Data": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Laporan Pengaduan": ["Lihat", "Tambah", "Edit", "Hapus"],
    },
  },
  {
    id: 2,
    name: "Superadmin",
    description: "Superadministrator sistem",
    permissions: {
      Dashboard: ["Lihat"],
      "Manajemen Akses": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Manajemen Klien": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Master Data": ["Lihat", "Tambah", "Edit", "Hapus"],
      "Laporan Pengaduan": ["Lihat", "Tambah", "Edit", "Hapus"],
    },
  },
];

const INITIAL_ACCOUNTS = [
  {
    id: 1,
    name: "Admin1",
    role: "Admin",
    username: "administrator",
    email: "administrator@navbus.id",
  },
  {
    id: 2,
    name: "Admin2",
    role: "Superadmin",
    username: "superadmin",
    email: "superadmin@navbus.id",
  },
];

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Pilih pilihan",
  disabled = false,
  width = "w-full",
}) {
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
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-sm text-slate-700 shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-50 ${
          open
            ? "border-[#F2B600] ring-2 ring-amber-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={`truncate ${value ? "" : "text-slate-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full z-[100] mt-2 max-h-64 w-full min-w-36 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                String(value) === String(option)
                  ? "bg-amber-50 font-medium text-amber-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{option}</span>
              {String(value) === String(option) && (
                <Check size={14} className="shrink-0 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Popup({
  title,
  message,
  type = "success",
  onConfirm,
  onCancel,
  confirmText = "Oke",
  cancelText,
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

export default function AccessManagement({ activePage = "Daftar Role" }) {
  const isRole = activePage !== "Daftar Akun";

  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [popup, setPopup] = useState(null);
  const [formError, setFormError] = useState("");

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  const [accountForm, setAccountForm] = useState({
    name: "",
    role: "",
    username: "",
    email: "",
    password: "",
  });

  const source = isRole ? roles : accounts;
  const query = search.trim().toLowerCase();

  const filtered = source.filter((item) =>
    [item.name, item.description, item.role, item.username, item.email]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setPage(1);
    setSearch("");
    setView("list");
    setEditing(null);
    setViewing(false);
    setFormError("");
  }, [activePage]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setPopup(null);
        setDeleteTarget(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function notify(title, message, type = "success") {
    setPopup({ title, message, type });
  }

  function startAdd() {
    setEditing(null);
    setViewing(false);
    setFormError("");

    if (isRole) {
      setRoleForm({
        name: "",
        description: "",
        permissions: {},
      });
    } else {
      setAccountForm({
        name: "",
        role: roles[0]?.name || "",
        username: "",
        email: "",
        password: "",
      });
    }

    setView("form");
  }

  function startEdit(item) {
    setEditing(item);
    setViewing(false);
    setFormError("");

    if (isRole) {
      setRoleForm({
        name: item.name,
        description: item.description || "",
        permissions: item.permissions || {},
      });
    } else {
      setAccountForm({
        name: item.name,
        role: item.role || "",
        username: item.username || "",
        email: item.email || "",
        password: "",
      });
    }

    setView("form");
  }

  function startView(item) {
    startEdit(item);
    setViewing(true);
  }

  function updatePermission(menu, action, checked) {
    setRoleForm((previous) => {
      const current = previous.permissions[menu] || [];
      const permissions = checked
        ? [...current, action]
        : current.filter((value) => value !== action);

      return {
        ...previous,
        permissions: {
          ...previous.permissions,
          [menu]: permissions,
        },
      };
    });
  }

  function toggleAll(menu, checked) {
    setRoleForm((previous) => ({
      ...previous,
      permissions: {
        ...previous.permissions,
        [menu]: checked ? [...ACTIONS] : [],
      },
    }));
  }

  function saveForm(event) {
    event.preventDefault();
    setFormError("");

    if (isRole) {
      const name = roleForm.name.trim();

      if (!name) {
        setFormError("Nama role wajib diisi.");
        return;
      }

      if (
        roles.some(
          (item) =>
            item.name.toLowerCase() === name.toLowerCase() &&
            item.id !== editing?.id,
        )
      ) {
        setFormError("Nama role sudah digunakan.");
        return;
      }

      if (editing) {
        setRoles((previous) =>
          previous.map((item) =>
            item.id === editing.id ? { ...item, ...roleForm, name } : item,
          ),
        );
      } else {
        setRoles((previous) => [
          ...previous,
          { id: Date.now(), ...roleForm, name },
        ]);
      }
    } else {
      const name = accountForm.name.trim();
      const username = accountForm.username.trim();
      const email = accountForm.email.trim();

      if (!name || !username || !accountForm.role) {
        setFormError("Nama akun, role, dan username wajib diisi.");
        return;
      }

      if (!editing && !accountForm.password.trim()) {
        setFormError("Password wajib diisi untuk akun baru.");
        return;
      }

      if (
        accounts.some(
          (item) =>
            item.username.toLowerCase() === username.toLowerCase() &&
            item.id !== editing?.id,
        )
      ) {
        setFormError("Username sudah digunakan.");
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormError("Format email belum valid.");
        return;
      }

      if (editing) {
        setAccounts((previous) =>
          previous.map((item) =>
            item.id === editing.id
              ? {
                  ...item,
                  name,
                  role: accountForm.role,
                  username,
                  email,
                }
              : item,
          ),
        );
      } else {
        setAccounts((previous) => [
          ...previous,
          {
            id: Date.now(),
            name,
            role: accountForm.role,
            username,
            email,
          },
        ]);
      }
    }

    const wasEditing = Boolean(editing);
    const type = isRole ? "Role" : "Akun";

    setView("list");
    setEditing(null);
    setPage(1);

    notify(
      wasEditing
        ? `${type} Berhasil Diperbarui`
        : `${type} Berhasil Ditambahkan`,
      wasEditing
        ? `${type} berhasil diperbarui.`
        : `${type} baru berhasil ditambahkan.`,
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const name = deleteTarget.name;
    const type = isRole ? "Role" : "Akun";

    if (isRole) {
      setRoles((previous) =>
        previous.filter((item) => item.id !== deleteTarget.id),
      );
    } else {
      setAccounts((previous) =>
        previous.filter((item) => item.id !== deleteTarget.id),
      );
    }

    setDeleteTarget(null);
    setPage(1);

    notify(`${type} Berhasil Dihapus`, `${type} "${name}" berhasil dihapus.`);
  }

  const title = isRole ? "Daftar Role" : "Daftar Akun";

  return (
    <div className="min-w-0 p-3 sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Daftar {isRole ? "Role" : "Akun"} Akses
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          <ShieldCheck size={16} className="text-amber-600" />
          Administrasi
        </div>
      </div>

      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {view === "list" ? (
          <>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Tampilkan</span>
                <div className="w-20">
                  <CustomSelect
                    value={String(pageSize)}
                    options={["10", "25", "50"]}
                    onChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                  />
                </div>
                <span>data</span>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-2">
                <label className="relative min-w-0 w-full sm:w-52">
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
                    placeholder={isRole ? "Cari nama role" : "Cari nama akun"}
                    className={`${inputClass} pl-9`}
                  />
                </label>

                {/* Tombol Export Excel */}
                <button
                  type="button"
                  onClick={() =>
                    notify(
                      "Export belum tersedia",
                      "Fitur export akan dihubungkan setelah format datanya ditentukan.",
                      "warning",
                    )
                  }
                  title="Export Excel"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs text-white hover:bg-slate-700"
                >
                  {/* Contoh menggunakan ikon file dengan huruf X */}
                  <div className="relative flex items-center justify-center">
                    <FileText size={16} />
                    <span className="absolute text-[9px] font-bold">X</span>
                  </div>
                </button>

                {/* Tombol Export PDF */}
                <button
                  type="button"
                  onClick={() =>
                    notify(
                      "Export belum tersedia",
                      "Fitur export PDF akan dihubungkan setelah format datanya ditentukan.",
                      "warning",
                    )
                  }
                  title="Export PDF"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs text-white hover:bg-slate-700"
                >
                  <FileText size={16} />
                  <span className="font-semibold text-[10px]">PDF</span>
                </button>

                {/* Tombol Tambah Dinamis (+ Role / + Akun) */}
                <button
                  type="button"
                  onClick={startAdd}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-slate-700"
                >
                  <Plus size={15} />
                  {isRole ? "Role" : "Akun"}
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-amber-50 text-slate-700">
                  <tr>
                    <th className="w-12 px-3 py-3 font-medium">No.</th>
                    <th className="px-3 py-3 font-medium">
                      {isRole ? "Nama Role" : "Nama Akun"}
                    </th>
                    <th className="px-3 py-3 font-medium">
                      {isRole ? "Deskripsi" : "Role"}
                    </th>
                    {!isRole && (
                      <th className="px-3 py-3 font-medium">Username</th>
                    )}
                    <th className="w-24 px-3 py-3 text-center font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleRows.map((item, index) => (
                    <tr
                      key={item.id}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-3 py-3">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="px-3 py-3 font-medium">{item.name}</td>

                      <td className="px-3 py-3">
                        {isRole ? item.description || "-" : item.role}
                      </td>

                      {!isRole && (
                        <td className="px-3 py-3">{item.username}</td>
                      )}

                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            type="button"
                            title="Hapus"
                            aria-label={`Hapus ${item.name}`}
                            onClick={() => setDeleteTarget(item)}
                            className="rounded-md p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => startEdit(item)}
                            className="rounded-md p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            title="Lihat detail"
                            aria-label={`Lihat ${item.name}`}
                            onClick={() => startView(item)}
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleRows.length === 0 && (
                <div className="px-4 py-12 text-center text-xs text-slate-500">
                  Data tidak ditemukan.
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">
                Menampilkan{" "}
                {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}
                {" - "}
                {Math.min(currentPage * pageSize, filtered.length)} dari{" "}
                {filtered.length} data
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Halaman sebelumnya"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
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
                        number === currentPage
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
                  className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={saveForm}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
              <button
                type="button"
                aria-label="Kembali"
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
                  {viewing ? "Detail" : editing ? "Edit" : "Tambah"}{" "}
                  {isRole ? "Role Akses" : "Akun"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {viewing
                    ? "Informasi data yang dipilih."
                    : "Lengkapi informasi berikut."}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              {isRole ? (
                <>
                  <Field label="Nama Role" required>
                    <input
                      disabled={viewing}
                      value={roleForm.name}
                      onChange={(event) =>
                        setRoleForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Masukkan nama role"
                      className={`${inputClass} disabled:bg-slate-50`}
                    />
                  </Field>

                  <Field label="Deskripsi">
                    <textarea
                      disabled={viewing}
                      value={roleForm.description}
                      onChange={(event) =>
                        setRoleForm((previous) => ({
                          ...previous,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Masukkan deskripsi role"
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400 disabled:bg-slate-50"
                    />
                  </Field>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Pengaturan Hak Akses
                    </h3>
                    <p className="mb-3 mt-1 text-xs text-slate-500">
                      Tentukan hak akses pada setiap menu.
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full min-w-[490px] text-left text-xs">
                        <thead className="bg-amber-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-3">Menu</th>
                            {ACTIONS.map((action) => (
                              <th
                                key={action}
                                className="px-3 py-3 text-center"
                              >
                                {action}
                              </th>
                            ))}
                            <th className="px-3 py-3 text-center">Semua</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {MENUS.map((menu) => {
                            const selected = roleForm.permissions[menu] || [];

                            return (
                              <tr key={menu}>
                                <td className="px-3 py-3 font-medium">
                                  {menu}
                                </td>

                                {ACTIONS.map((action) => (
                                  <td
                                    key={action}
                                    className="px-3 py-3 text-center"
                                  >
                                    <input
                                      type="checkbox"
                                      disabled={viewing}
                                      checked={selected.includes(action)}
                                      onChange={(event) =>
                                        updatePermission(
                                          menu,
                                          action,
                                          event.target.checked,
                                        )
                                      }
                                      className="h-4 w-4 accent-amber-500"
                                    />
                                  </td>
                                ))}

                                <td className="px-3 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    disabled={viewing}
                                    checked={ACTIONS.every((action) =>
                                      selected.includes(action),
                                    )}
                                    onChange={(event) =>
                                      toggleAll(menu, event.target.checked)
                                    }
                                    className="h-4 w-4 accent-amber-500"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Nama Akun" required>
                    <input
                      disabled={viewing}
                      value={accountForm.name}
                      onChange={(event) =>
                        setAccountForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Masukkan nama akun"
                      className={`${inputClass} disabled:bg-slate-50`}
                    />
                  </Field>

                  <Field label="Role" required>
                    <CustomSelect
                      value={accountForm.role}
                      options={roles.map((role) => role.name)}
                      placeholder="Pilih role"
                      disabled={viewing}
                      onChange={(value) =>
                        setAccountForm((previous) => ({
                          ...previous,
                          role: value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="Username" required>
                    <input
                      disabled={viewing}
                      value={accountForm.username}
                      onChange={(event) =>
                        setAccountForm((previous) => ({
                          ...previous,
                          username: event.target.value,
                        }))
                      }
                      placeholder="Masukkan username"
                      className={`${inputClass} disabled:bg-slate-50`}
                    />
                  </Field>

                  <Field label="Email">
                    <input
                      disabled={viewing}
                      type="email"
                      value={accountForm.email}
                      onChange={(event) =>
                        setAccountForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder="nama@domain.com"
                      className={`${inputClass} disabled:bg-slate-50`}
                    />
                  </Field>

                  {!viewing && (
                    <Field
                      label={editing ? "Password Baru (opsional)" : "Password"}
                      required={!editing}
                    >
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={accountForm.password}
                        onChange={(event) =>
                          setAccountForm((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }))
                        }
                        placeholder={
                          editing
                            ? "Kosongkan jika tidak diubah"
                            : "Masukkan password"
                        }
                        className={inputClass}
                      />
                    </Field>
                  )}
                </div>
              )}

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
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs text-slate-600 hover:bg-slate-50"
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
          title={`Hapus ${isRole ? "Role" : "Akun"}`}
          message={`Anda yakin ingin menghapus ${isRole ? "Role" : "Akun"} ini?`}
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
          confirmText="Oke"
          onConfirm={() => setPopup(null)}
          onCancel={() => setPopup(null)}
        />
      )}
    </div>
  );
}