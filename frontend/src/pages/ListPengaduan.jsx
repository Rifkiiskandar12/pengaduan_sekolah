import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePengaduan } from "../hooks/usePengaduan";
import { useAuth } from "../hooks/useAuth";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
};

export default function ListPengaduan() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState("");
  const [search, setSearch] = useState("");
  const { getAll, update, remove, loading, error } = usePengaduan();
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();

  const fetchData = async () => {
    const params = {};
    if (kategori) params.kategori = kategori;
    if (search) params.search = search;
    const res = await getAll(params);
    setData(res);
  };

  const handleStatusChange = async (id, status) => {
    await update(id, { status });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus pengaduan ini?")) return;
    await remove(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [kategori]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daftar Pengaduan</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
          className="border rounded px-3 py-2 flex-1 min-w-40"
        />
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua Kategori</option>
          <option value="fasilitas">Fasilitas</option>
          <option value="akademik">Akademik</option>
          <option value="bullying">Bullying</option>
          <option value="lainnya">Lainnya</option>
        </select>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cari
        </button>
      </div>

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
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                  Belum ada pengaduan
                </td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-2">{item.judul}</td>
                <td className="px-4 py-2 capitalize">{item.kategori}</td>
                <td className="px-4 py-2">
                  {user?.role === "admin" ? (
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 ${statusColor[item.status]}`}
                    >
                      <option value="pending">pending</option>
                      <option value="diproses">diproses</option>
                      <option value="selesai">selesai</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[item.status]}`}>
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </td>
               <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/pengaduan/${item._id}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Detail
                  </button>
                  {(user?.role === "siswa" && item.status === "pending") && (
                    <button
                      onClick={() => navigate(`/pengaduan/edit/${item._id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  {(user?.role === "admin" || (user?.role === "siswa" && item.status === "pending")) && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}