import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
};

export default function DetailPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pengaduan/${id}`)
      .then((res) => setData(res.data))
      .catch(() => navigate("/pengaduan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Memuat...</p>;
  if (!data) return <p>Data tidak ditemukan.</p>;

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/pengaduan")}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Kembali
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{data.judul}</h1>

        <div className="flex gap-3 mb-4">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm capitalize">
            {data.kategori}
          </span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[data.status]}`}>
            {data.status}
          </span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{data.isi}</p>

        <div className="border-t pt-4 text-sm text-gray-500 flex flex-col gap-1">
          <p>Pelapor: <span className="font-medium text-gray-700">{data.pelapor?.name}</span></p>
          <p>Email: <span className="font-medium text-gray-700">{data.pelapor?.email}</span></p>
          <p>Tanggal: <span className="font-medium text-gray-700">{new Date(data.createdAt).toLocaleDateString("id-ID")}</span></p>
        </div>
      </div>
    </div>
  );
}