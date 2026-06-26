import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePengaduan } from "../hooks/usePengaduan";
import api from "../services/api";

export default function EditPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { update, loading } = usePengaduan();
  const [form, setForm] = useState({ judul: "", isi: "", kategori: "fasilitas" });
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/pengaduan/${id}`).then((res) => {
      const { judul, isi, kategori, status } = res.data;
      if (status !== "pending") {
        alert("Hanya pengaduan berstatus pending yang bisa diedit");
        navigate("/pengaduan");
      }
      setForm({ judul, isi, kategori });
    }).catch(() => navigate("/pengaduan"));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await update(id, form);
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
          <select
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            className="field"
          >
            <option value="fasilitas">Fasilitas</option>
            <option value="akademik">Akademik</option>
            <option value="bullying">Bullying</option>
            <option value="lainnya">Lainnya</option>
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
