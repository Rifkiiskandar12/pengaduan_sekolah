import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePengaduan } from "../hooks/usePengaduan";
import api from "../services/api";


export default function EditPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = usePengaduan();
  const [form, setForm] = useState({ judul: "", isi: "", kategori: "fasilitas" });
  const [data, setData] = useState(null);
  const [gambar, setGambar] = useState(null);
  const [error, setError] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    api.get("/kategori").then(res => setKategoriList(res.data));
  }, []);

  useEffect(() => {
    api.get(`/pengaduan/${id}`).then((res) => {
      const { judul, isi, kategori, status } = res.data;
      if (status !== "pending") {
        alert("Hanya pengaduan berstatus pending yang bisa diedit");
        navigate("/pengaduan");
      }
      setForm({ judul, isi, kategori });
      setData(res.data);
    }).catch(() => navigate("/pengaduan"));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      formData.append("judul", form.judul);
      formData.append("isi", form.isi);
      formData.append("kategori", form.kategori);
      if (gambar) formData.append("gambar", gambar);

      await api.put(`/pengaduan/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/pengaduan");
    } catch {
      setError("Gagal mengupdate pengaduan");
    }
  };

  return (
    <div className="page-wrap">
      <header className="page-head">
        <div>
          <h1 className="page-title">Edit Pengaduan</h1>
          <p className="page-subtitle">Perbaiki isi laporan selama statusnya masih pending.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="panel p-6 max-w-2xl form-grid">
        {error && <p className="alert alert-error mb-4">{error}</p>}

        <div>
          <label className="field-label">Judul</label>
          <input
            type="text"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            required
            className="field"
          />
        </div>

        <div>
          <label className="field-label">Kategori</label>
          <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="field">
            {kategoriList.map(k => (
              <option key={k._id} value={k.nama}>{k.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Isi Pengaduan</label>
          <textarea
            value={form.isi}
            onChange={(e) => setForm({ ...form, isi: e.target.value })}
            required
            rows={5}
            className="field"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Ganti Foto (opsional)</label>
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
            className="w-full text-sm dark:text-gray-200" />
          <p className="text-xs text-gray-500 mt-1">Max 2MB, format JPG/PNG</p>
          {data?.gambar && !gambar && (
            <img src={`http://localhost:5000/uploads/${data.gambar}`}
              alt="Foto saat ini" className="mt-2 max-h-32 rounded object-contain" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" onClick={() => navigate("/pengaduan")} className="btn btn-secondary">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
