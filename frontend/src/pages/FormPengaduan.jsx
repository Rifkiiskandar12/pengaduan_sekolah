import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
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
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    api.get("/kategori").then(res => {
      setKategoriList(res.data);
      if (res.data.length > 0) setKategori(res.data[0].nama);
    });
  }, []);

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
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Pengaduan berhasil dikirim!");
      setTimeout(() => navigate("/pengaduan"), 1000);
    } catch {
      setError("Gagal mengirim pengaduan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <header className="page-head">
        <div>
          <h1 className="page-title">Buat Pengaduan</h1>
          <p className="page-subtitle">Tulis laporan singkat, jelas, dan lengkapi lampiran bila perlu.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="panel p-6 max-w-2xl form-grid">
        {error && <p className="alert alert-error mb-4">{error}</p>}

        <div>
          <label className="field-label">Judul<span className="text-red-500">*</span></label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required className="field" />
        </div>

        <div>
          <label className="field-label">Kategori<span className="text-red-500">*</span></label>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="field">
            {kategoriList.map(k => (
              <option key={k._id} value={k.nama}>{k.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Isi Pengaduan<span className="text-red-500">*</span></label>
          <textarea value={isi} onChange={(e) => setIsi(e.target.value)} required rows={5} className="field" />
        </div>

        <div>
          <label className="field-label">Lampiran Gambar (opsional)</label>
         <input type="file" accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                setError("Ukuran file maksimal 2MB");
                e.target.value = "";
                return;
              }
              if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setError("Format file harus JPG atau PNG");
                e.target.value = "";
                return;
              }
              setError(null);
              setGambar(file);
            }}
            className="field" />
          <p className="file-note mt-1">Max 2MB, format JPG/PNG</p>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Mengirim..." : "Kirim Pengaduan"}
        </button>
      </form>
    </div>
  );
}
