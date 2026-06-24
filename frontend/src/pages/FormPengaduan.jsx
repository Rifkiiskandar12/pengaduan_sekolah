import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import api from "../services/api";

export default function FormPengaduan() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("fasilitas");
  const [gambar, setGambar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("isi", isi);
      formData.append("kategori", kategori);
      if (gambar) formData.append("gambar", gambar);

      await api.post("/pengaduan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showToast("Pengaduan berhasil dikirim!");
      setTimeout(() => navigate("/pengaduan"), 1000);
    } catch {
      setError("Gagal mengirim pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600";
  const labelClass = "block text-sm font-medium mb-1 dark:text-gray-200";

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <h1 className="text-2xl font-bold mb-4">Buat Pengaduan</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-lg">
        {error && <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}

        <div className="mb-4">
          <label className={labelClass}>Judul</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Kategori</label>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={inputClass}>
            <option value="fasilitas">Fasilitas</option>
            <option value="akademik">Akademik</option>
            <option value="bullying">Bullying</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Isi Pengaduan</label>
          <textarea value={isi} onChange={(e) => setIsi(e.target.value)} required rows={4} className={inputClass} />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Lampiran Gambar (opsional)</label>
          <input type="file" accept="image/*"
            onChange={(e) => setGambar(e.target.files[0])}
            className="w-full text-sm dark:text-gray-200" />
          <p className="text-xs text-gray-500 mt-1">Max 2MB, format JPG/PNG</p>
        </div>

        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Mengirim..." : "Kirim Pengaduan"}
        </button>
      </form>
    </div>
  );
}