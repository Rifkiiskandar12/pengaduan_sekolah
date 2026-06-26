import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../hooks/useAuth";
import { usePengaduan } from "../hooks/usePengaduan";

const COLORS = ["var(--color-warning)", "var(--color-info)", "var(--color-success)"];
const statusColor = {
  pending: "badge-pending",
  diproses: "badge-diproses",
  selesai: "badge-selesai",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const { getStats, getAll, loading } = usePengaduan();
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.role === "admin" || user?.role === "guru";

  useEffect(() => {
    if (isAdmin) {
      getStats().then(setStats).catch(() => {});
      getAll().then((data) => setRecent(data.slice(0, 5))).catch(() => {});
    } else {
      getAll().then((data) => {
        setStats({
          total: data.length,
          pending: data.filter((d) => d.status === "pending").length,
          diproses: data.filter((d) => d.status === "diproses").length,
          selesai: data.filter((d) => d.status === "selesai").length,
        });
      }).catch(() => {});
    }
  }, []);

  const cards = [
    { label: isAdmin ? "Total Pengaduan" : "Pengaduan Saya", value: stats?.total },
    { label: "Pending", value: stats?.pending },
    { label: "Diproses", value: stats?.diproses },
    { label: "Selesai", value: stats?.selesai },
  ];

  const statusData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Diproses", value: stats?.diproses || 0 },
    { name: "Selesai", value: stats?.selesai || 0 },
  ];

  const kategoriData = [
    { name: "Fasilitas", value: recent.filter((d) => d.kategori === "fasilitas").length },
    { name: "Akademik", value: recent.filter((d) => d.kategori === "akademik").length },
    { name: "Bullying", value: recent.filter((d) => d.kategori === "bullying").length },
    { name: "Lainnya", value: recent.filter((d) => d.kategori === "lainnya").length },
  ];

  return (
    <div className="page-wrap">
      <header className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Ringkasan status pengaduan dan aktivitas terbaru.</p>
        </div>
      </header>

      {loading && <p className="page-subtitle">Memuat...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="metric-card">
            <p className="metric-label">{card.label}</p>
            <p className="metric-value">{card.value ?? "-"}</p>
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="panel p-4">
              <h2 className="section-title mb-4">Grafik Per Kategori</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={kategoriData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel p-4">
              <h2 className="section-title mb-4">Grafik Status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ color: "var(--color-ink)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel table-wrap">
            <div className="panel-header">
              <h2 className="section-title">5 Pengaduan Terbaru</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Pelapor</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item._id}>
                    <td>{item.judul}</td>
                    <td className="capitalize">{item.kategori}</td>
                    <td>
                      <span className={`badge ${statusColor[item.status]}`}>{item.status}</span>
                    </td>
                    <td>{item.pelapor?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
