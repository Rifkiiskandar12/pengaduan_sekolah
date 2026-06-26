import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const statusColor = {
  pending: "badge-pending",
  diproses: "badge-diproses",
  selesai: "badge-selesai",
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
  }, [id, navigate]);

  if (loading) return <p className="page-subtitle">Memuat...</p>;
  if (!data) return <p className="page-subtitle">Data tidak ditemukan.</p>;

  return (
    <div className="page-wrap max-w-3xl">
      <button onClick={() => navigate("/pengaduan")} className="btn btn-secondary mb-4">
        Kembali
      </button>

      <div className="panel p-6">
        <h1 className="page-title mb-4">{data.judul}</h1>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="badge badge-neutral capitalize">{data.kategori}</span>
          <span className={`badge ${statusColor[data.status]}`}>{data.status}</span>
        </div>

        <p className="text-[color:var(--color-ink-2)] mb-6 leading-relaxed">{data.isi}</p>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Pelapor</span>
            <span className="meta-value">{data.pelapor?.name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Email</span>
            <span className="meta-value">{data.pelapor?.email}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Tanggal</span>
            <span className="meta-value">{new Date(data.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>

        {data.gambar && (
          <div className="mt-4">
            <span className="text-sm text-[color:var(--color-muted)] block mb-2">Lampiran:</span>
            <img
              src={`http://localhost:5000/uploads/${data.gambar}`}
              alt="Lampiran"
              className="rounded-[var(--radius-card)] max-w-full max-h-64 object-contain border border-[color:var(--color-rule)]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
