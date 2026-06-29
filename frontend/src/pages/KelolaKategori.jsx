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

  const fetchKategori = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

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

  useEffect(() => { fetchKategori(); }, []);

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <h1 className="text-2xl font-bold mb-4">Kelola Kategori</h1>

      {/* Form tambah */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex gap-2 max-w-lg">
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
          placeholder="Nama kategori baru..." required
          className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Tambah
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Daftar kategori */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto max-w-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Nama Kategori</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-4 text-center text-gray-400">Belum ada kategori</td></tr>
            )}
            {kategori.map((k) => (
              <tr key={k._id} className="border-t">
                <td className="px-4 py-2 capitalize">{k.nama}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(k._id)}
                    className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200">
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