import { useEffect, useState } from "react";
import { usePengaduan } from "../hooks/usePengaduan";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { getStats, getAll, loading, error } = usePengaduan();
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      getStats().then(setStats).catch(() => {});
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading && <p>Memuat statistik...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} text-white rounded-lg p-5 shadow`}>
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.value ?? "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}