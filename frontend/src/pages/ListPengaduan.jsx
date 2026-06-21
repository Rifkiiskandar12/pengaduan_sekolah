import { useEffect, useState } from "react";
import { usePengaduan } from "../hooks/usePengaduan";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
};

export default function ListPengaduan() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState("");
  const { getAll, loading, error } = usePengaduan();

  const fetchData = async () => {
    const params = {};
    if (kategori) params.kategori = kategori;
    const res = await getAll(params);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, [kategori]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daftar Pengaduan</h1>

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="border rounded px-3 py-2 mb-4"
      >
        <option value="">Semua Kategori</option>
        <option value="fasilitas">Fasilitas</option>
        <option value="akademik">Akademik</option>
        <option value="bullying">Bullying</option>
        <option value="lainnya">Lainnya</option>
      </select>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Judul</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                  Belum ada pengaduan
                </td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-2">{item.judul}</td>
                <td className="px-4 py-2 capitalize">{item.kategori}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}