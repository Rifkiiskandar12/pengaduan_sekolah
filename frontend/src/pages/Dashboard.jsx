import { useEffect, useState } from "react";
import { usePengaduan } from "../hooks/usePengaduan";
import { useAuth } from "../hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444"];
const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
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
    { label: isAdmin ? "Total Pengaduan" : "Pengaduan Saya", value: stats?.total, color: "bg-blue-500" },
    { label: "Pending", value: stats?.pending, color: "bg-yellow-500" },
    { label: "Diproses", value: stats?.diproses, color: "bg-indigo-500" },
    { label: "Selesai", value: stats?.selesai, color: "bg-green-500" },
  ];

  const statusData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Diproses", value: stats?.diproses || 0 },
    { name: "Selesai", value: stats?.selesai || 0 },
  ];

  const kategoriData = [
    { name: "Fasilitas", value: recent.filter(d => d.kategori === "fasilitas").length },
    { name: "Akademik", value: recent.filter(d => d.kategori === "akademik").length },
    { name: "Bullying", value: recent.filter(d => d.kategori === "bullying").length },
    { name: "Lainnya", value: recent.filter(d => d.kategori === "lainnya").length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading && <p>Memuat...</p>}

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} text-white rounded-lg p-5 shadow`}>
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.value ?? "-"}</p>
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          {/* Grafik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-4">Grafik Per Kategori</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kategoriData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow" style={{ backgroundColor: "inherit" }}>
              <h2 className="font-semibold mb-4">Grafik Status</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart style={{ background: "transparent" }}>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    label={{ fill: "currentColor" }}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ color: "inherit" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabel Terbaru */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <div className="p-4 border-b font-semibold">5 Pengaduan Terbaru</div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Judul</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Pelapor</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-2">{item.judul}</td>
                    <td className="px-4 py-2 capitalize">{item.kategori}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{item.pelapor?.name}</td>
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