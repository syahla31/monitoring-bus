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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  X,
} from 'lucide-react'

const initialAccounts = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    role: 'superadmin',
  },
]

export default function AksesAkun() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState('10')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [form, setForm] = useState({
    name: '',
    username: '',
    role: 'admin',
  })

  const filteredAccounts = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return accounts.filter((account) =>
      [account.name, account.username, account.role].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [accounts, search])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / Number(pageSize)),
  )
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * Number(pageSize)
  const visibleAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + Number(pageSize),
  )

  function openAdd() {
    setSelectedAccount(null)
    setForm({ name: '', username: '', role: 'admin' })
    setModal('add')
  }

  function openEdit(account) {
    setSelectedAccount(account)
    setForm({
      name: account.name,
      username: account.username,
      role: account.role,
    })
    setModal('edit')
  }

  function saveAccount(event) {
    event.preventDefault()

    const name = form.name.trim()
    const username = form.username.trim()

    if (!name || !username) return

    const duplicate = accounts.some(
      (account) =>
        account.username.toLowerCase() === username.toLowerCase() &&
        account.id !== selectedAccount?.id,
    )

    if (duplicate) {
      window.alert('Username sudah digunakan.')
      return
    }

    if (modal === 'edit' && selectedAccount) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === selectedAccount.id
            ? { ...account, name, username, role: form.role }
            : account,
        ),
      )
    } else {
      setAccounts((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((account) => account.id)) + 1,
          name,
          username,
          role: form.role,
        },
      ])
    }

    setPage(1)
    setModal(null)
  }

  function deleteAccount(account) {
    if (account.username === 'admin') {
      window.alert('Akun contoh utama tidak dihapus dari tampilan ini.')
      return
    }

    if (!window.confirm(`Hapus akun "${account.username}"?`)) return

    setAccounts((current) =>
      current.filter((item) => item.id !== account.id),
    )
    setModal(null)
  }

  function exportCsv() {
    const escapeCsv = (value) =>
      `"${String(value).replace(/"/g, '""')}"`

    const rows = [
      ['Nama Pengguna', 'Username', 'Role'],
      ...filteredAccounts.map((account) => [
        account.name,
        account.username,
        account.role,
      ]),
    ]

    const csv =
      '\uFEFF' +
      rows.map((row) => row.map(escapeCsv).join(';')).join('\r\n')

    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'daftar-akun.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7] px-4 py-6 sm:px-6 lg:px-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Daftar Akun
      </h1>

      <section className="rounded-lg border border-[#D5D5D5] bg-white p-4 sm:p-5">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <span>Tampilkan</span>

            <div className="relative">
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value)
                  setPage(1)
                }}
                className="h-11 w-[92px] appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 outline-none focus:border-cyan-500"
                aria-label="Jumlah data per halaman"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>

            <span>data</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="account-search" className="mr-1">
              Search:
            </label>

            <div className="relative min-w-[160px] flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="account-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Cari Data"
                className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 outline-none focus:border-cyan-500 sm:w-[205px]"
              />
            </div>

            <button
              type="button"
              onClick={exportCsv}
              title="Export CSV"
              className="flex h-11 w-12 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700"
            >
              <FileSpreadsheet size={20} />
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              title="Cetak / simpan PDF"
              className="flex h-11 w-12 items-center justify-center rounded-xl bg-[#0DA7B8] text-white hover:bg-cyan-700"
            >
              <FileText size={20} />
            </button>

            <button
              type="button"
              onClick={openAdd}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#0DA7B8] px-5 text-white hover:bg-cyan-700"
            >
              <Plus size={17} />
              Tambah
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-[#DFFBFC] text-[#0DA7B8]">
                <th className="px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">
                    Nama Pengguna <ArrowUpDown size={15} />
                  </span>
                </th>
                <th className="px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">
                    Username <ArrowUpDown size={15} className="opacity-30" />
                  </span>
                </th>
                <th className="px-3 py-4 font-semibold">
                  <span className="flex items-center gap-2">
                    Role <ArrowUpDown size={15} className="opacity-30" />
                  </span>
                </th>
                <th className="w-[24%] px-3 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {visibleAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-slate-200 text-slate-900"
                >
                  <td className="px-3 py-4">{account.name}</td>
                  <td className="px-3 py-4">{account.username}</td>
                  <td className="px-3 py-4">{account.role}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => deleteAccount(account)}
                        title="Hapus"
                        aria-label={`Hapus akun ${account.username}`}
                        className="text-slate-800 hover:text-red-600"
                      >
                        <Trash2 size={23} strokeWidth={1.8} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccount(account)
                          setModal('view')
                        }}
                        title="Lihat"
                        aria-label={`Lihat akun ${account.username}`}
                        className="text-slate-800 hover:text-cyan-700"
                      >
                        <Eye size={24} strokeWidth={1.8} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(account)}
                        title="Edit"
                        aria-label={`Edit akun ${account.username}`}
                        className="text-slate-800 hover:text-amber-600"
                      >
                        <Pencil size={23} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleAccounts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-10 text-center text-slate-500"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700">
            Menampilkan {filteredAccounts.length === 0 ? 0 : startIndex + 1}
            {' - '}
            {Math.min(startIndex + Number(pageSize), filteredAccounts.length)}
            {' dari '}
            {filteredAccounts.length} data
          </p>

          <div className="flex items-center self-end overflow-hidden rounded-lg border border-slate-200">
            {[
              { label: '«', target: 1 },
              { label: '‹', target: currentPage - 1 },
              { label: String(currentPage), target: currentPage, active: true },
              { label: '›', target: currentPage + 1 },
              { label: '»', target: totalPages },
            ].map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                type="button"
                disabled={
                  ((index === 0 || index === 1) && currentPage === 1) ||
                  ((index === 3 || index === 4) &&
                    currentPage === totalPages)
                }
                onClick={() =>
                  setPage(Math.max(1, Math.min(totalPages, item.target)))
                }
                className={`flex h-12 min-w-11 items-center justify-center border-r border-slate-200 px-3 last:border-r-0 disabled:cursor-not-allowed disabled:opacity-40 ${
                  item.active
                    ? 'bg-blue-600 font-semibold text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal === 'add'
                  ? 'Tambah Akun'
                  : modal === 'edit'
                    ? 'Edit Akun'
                    : 'Detail Akun'}
              </h2>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {modal === 'view' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Nama Pengguna</p>
                  <p className="mt-1 font-medium">
                    {selectedAccount?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Username</p>
                  <p className="mt-1">{selectedAccount?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="mt-1">{selectedAccount?.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg bg-[#0DA7B8] px-5 py-2.5 text-white"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={saveAccount} className="space-y-4">
                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Nama Pengguna
                  </label>
                  <input
                    id="account-name"
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500"
                    placeholder="Masukkan nama pengguna"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-username"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Username
                  </label>
                  <input
                    id="account-username"
                    required
                    value={form.username}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-role"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Role
                  </label>
                  <select
                    id="account-role"
                    value={form.role}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-cyan-500"
                  >
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                    <option value="Approvel">Approvel</option>
                    <option value="Petugas">Petugas</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0DA7B8] px-5 py-2.5 text-white hover:bg-cyan-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}