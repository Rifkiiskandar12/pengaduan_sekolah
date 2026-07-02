import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { usePengaduan } from "../hooks/usePengaduan";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import { exportExcel, exportPDF } from "../utils/exportHelper";
import { Eye, Pencil, Trash2 } from "lucide-react";

const statusColor = {
  pending: "badge-pending",
  diproses: "badge-diproses",
  selesai: "badge-selesai",
};

export default function ListPengaduan() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [page, setPage] = useState(1);
  const limitPerPage = 5;
  const { getAll, update, remove, loading, error } = usePengaduan();
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const fetchData = async () => {
    const params = {};
    if (kategori) params.kategori = kategori;
    if (status) params.status = status;
    if (search) params.search = search;
    const res = await getAll(params);
    setData(res);
    setPage(1);
  };

  const handleStatusChange = async (id, status) => {
    await update(id, { status });
    fetchData();
    showToast("Status berhasil diubah!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus pengaduan ini?")) return;
    try {
      await remove(id);
      fetchData();
      showToast("Pengaduan berhasil dihapus!", "success");
    } catch {
      showToast("Gagal hapus pengaduan", "error");
    }
  };

  useEffect(() => {
  api.get("/kategori").then(res => setKategoriList(res.data));
}, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [kategori, status]);

  const totalPages = Math.ceil(data.length / limitPerPage);
  const paginated = data.slice((page - 1) * limitPerPage, page * limitPerPage);

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <header className="page-head">
        <div>
          <h1 className="page-title">Daftar Pengaduan</h1>
          <p className="page-subtitle">Cari, filter, ekspor, dan tindak lanjuti laporan.</p>
        </div>
      </header>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
          className="field flex-1 min-w-40"
        />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}
          className="field">
          <option value="">Semua Kategori</option>
          {kategoriList.map(k => (
            <option key={k._id} value={k.nama}>{k.nama}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="field">
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
        </select>
        <button onClick={fetchData} className="btn btn-primary">Cari</button>
        <button onClick={() => exportPDF(data)} className="btn btn-danger">PDF</button>
        <button onClick={() => exportExcel(data)} className="btn btn-secondary">Excel</button>
      </div>

      {loading && <p className="page-subtitle">Memuat data...</p>}
      {error && <p className="alert alert-error">{error}</p>}

      <div className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-[color:var(--color-muted)]">Belum ada pengaduan</td>
              </tr>
            )}
            {paginated.map((item) => (
              <tr key={item._id}>
                <td>{item.judul}</td>
                <td className="capitalize">{item.kategori}</td>
                <td>
                  {user?.role === "admin" || user?.role === "guru" ? (
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`badge border-0 ${statusColor[item.status]}`}
                    >
                      <option value="pending">menunggu</option>
                      <option value="diproses">diproses</option>
                      <option value="selesai">selesai</option>
                    </select>
                  ) : (
                    <span className={`badge ${statusColor[item.status]}`}>{item.status}</span>
                  )}
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <button onClick={() => navigate(`/pengaduan/${item._id}`)}
                      title="Detail"
                      className="action-icon">
                      <Eye size={14} />
                    </button>
                  {(user?.role === "siswa" && item.status === "pending") && (
                    <button onClick={() => navigate(`/pengaduan/edit/${item._id}`)}
                      title="Edit"
                      className="action-icon">
                      <Pencil size={14} />
                    </button>
                  )}
                  {(user?.role === "admin" || (user?.role === "siswa" && item.status === "pending")) && (
                    <button onClick={() => handleDelete(item._id)}
                      title="Hapus"
                      className="action-icon action-icon-danger">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="btn btn-secondary !min-h-0 !py-1">
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn !min-h-0 !py-1 ${page === i + 1 ? "btn-primary" : "btn-secondary"}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="btn btn-secondary !min-h-0 !py-1">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
