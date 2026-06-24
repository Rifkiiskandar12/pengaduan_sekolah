import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { usePengaduan } from "../hooks/usePengaduan";

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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await update(id, form);
      navigate("/pengaduan");
    } catch (err) {
      setError("Gagal mengupdate pengaduan");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Pengaduan</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg">
        {error && <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fasilitas">Fasilitas</option>
            <option value="akademik">Akademik</option>
            <option value="bullying">Bullying</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Isi Pengaduan</label>
          <textarea
            value={form.isi}
            onChange={(e) => setForm({ ...form, isi: e.target.value })}
            required
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" onClick={() => navigate("/pengaduan")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}