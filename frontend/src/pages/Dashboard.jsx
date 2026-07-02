import { useEffect, useState } from "react";
import {
  Bar, BarChart, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { usePengaduan } from "../hooks/usePengaduan";

const COLORS = ["var(--color-warning)", "var(--color-info)", "var(--color-success)"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// FIX: key disesuaikan dengan nilai status dari backend (lowercase)
const statusColor = {
  pending: "badge-pending",
  diproses: "badge-diproses",
  selesai: "badge-selesai",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const { getStats, getAll, loading } = usePengaduan();
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.role === "admin" || user?.role === "guru";

  function buildMonthlyData(data) {
    const counts = Array.from({ length: 12 }, (_, i) => ({
      name: MONTH_NAMES[i],
      total: 0,
      selesai: 0,
    }));
    data.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      if (month >= 0 && month < 12) {
        counts[month].total += 1;
        if (item.status === "selesai") counts[month].selesai += 1;
      }
    });
    setMonthlyData(counts);
  }

  useEffect(() => {
    if (isAdmin) {
      getStats().then(setStats).catch(() => {});
      getAll().then((data) => {
        setRecent(data.slice(0, 5));
        // Bangun data statistik per bulan
        buildMonthlyData(data);
      }).catch(() => {});
      api.get("/kategori").then(res => setKategoriList(res.data));
    } else {
      getAll().then((data) => {
        // FIX: status dari backend adalah "pending", bukan "Menunggu"
        setStats({
          total: data.length,
          pending: data.filter((d) => d.status === "pending").length,
          diproses: data.filter((d) => d.status === "diproses").length,
          selesai: data.filter((d) => d.status === "selesai").length,
        });
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    { label: isAdmin ? "Total Pengaduan" : "Pengaduan Saya", value: stats?.total },
    { label: "Menunggu", value: isAdmin ? stats?.pending : stats?.pending },
    { label: "Diproses", value: stats?.diproses },
    { label: "Selesai", value: stats?.selesai },
  ];

  const statusData = [
    { name: "Menunggu", value: stats?.pending || 0 },
    { name: "Diproses", value: stats?.diproses || 0 },
    { name: "Selesai", value: stats?.selesai || 0 },
  ];

  const kategoriData = kategoriList.map(k => ({
    name: k.nama,
    value: recent.filter((d) => d.kategori === k.nama).length
  }));

  return (
    <div className="page-wrap">
      <header className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Ringkasan status pengaduan dan aktivitas terbaru.</p>
        </div>
      </header>

      {loading && <p className="page-subtitle">Memuat...</p>}

      {/* Kartu Statistik */}
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
          {/* Grafik Kategori & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="panel p-4">
              <h2 className="section-title mb-4">Grafik Per Kategori</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={kategoriData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 0, 0, 0]} />
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

          {/* Grafik Statistik Per Bulan */}
          <div className="panel p-4 mb-6">
            <h2 className="section-title mb-4">Statistik Pengaduan Per Bulan</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend wrapperStyle={{ color: "var(--color-ink)" }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Masuk"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="selesai"
                  name="Selesai"
                  stroke="var(--color-success)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel 5 Pengaduan Terbaru */}
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
