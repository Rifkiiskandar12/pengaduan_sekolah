import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

export default function KelolaKategori() {
  const [kategori, setKategori] = useState([]);
  const [nama, setNama] = useState("");
  const [error, setError] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/kategori", { nama });
      setKategori([...kategori, res.data]);
      setNama("");
      showToast("Kategori berhasil ditambahkan!");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah kategori");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kategori ini?")) return;
    await api.delete(`/kategori/${id}`);
    setKategori(kategori.filter(k => k._id !== id));
    showToast("Kategori dihapus!", "error");
  };

  useEffect(() => {
    let active = true;

    async function loadKategori() {
      const res = await api.get("/kategori");
      if (active) setKategori(res.data);
    }

    loadKategori().catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <header className="page-head">
        <div>
          <h1 className="page-title">Kelola Kategori</h1>
          <p className="page-subtitle">Jaga pilihan kategori tetap rapi untuk proses pengaduan.</p>
        </div>
      </header>

      {/* Form tambah */}
      <form onSubmit={handleAdd} className="panel panel-strong p-4 mb-6 flex flex-wrap gap-2 max-w-lg">
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
          placeholder="Nama kategori baru..." required
          className="field flex-1 min-w-40" />
        <button type="submit" className="btn btn-primary">
          Tambah
        </button>
      </form>
      {error && <p className="alert alert-error mb-4">{error}</p>}

      {/* Daftar kategori */}
      <div className="panel table-wrap max-w-lg">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length === 0 && (
              <tr><td colSpan={2} className="text-center text-[color:var(--color-muted)]">Belum ada kategori</td></tr>
            )}
            {kategori.map((k) => (
              <tr key={k._id}>
                <td className="capitalize font-bold">{k.nama}</td>
                <td>
                  <button onClick={() => handleDelete(k._id)}
                    className="action-icon action-icon-danger">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
