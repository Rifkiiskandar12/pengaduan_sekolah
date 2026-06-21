import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePengaduan } from "../hooks/usePengaduan";

export default function FormPengaduan() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("fasilitas");
  const { create, loading, error } = usePengaduan();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;
    try {
      await create({ judul, isi, kategori });
      navigate("/pengaduan");
    } catch {
      // error sudah ditangani di hook
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buat Pengaduan</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg">
        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
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
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Pengaduan"}
        </button>
      </form>
    </div>
  );
}