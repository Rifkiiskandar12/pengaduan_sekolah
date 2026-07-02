import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const roleColor = {
  admin: "badge-neutral",
  guru: "badge-diproses",
  siswa: "badge-selesai",
};

export default function KelolaPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const handleRoleChange = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    showToast("Role berhasil diubah!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus user ini?")) return;
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
    showToast("User berhasil dihapus!", "error");
  };

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      const res = await api.get("/users");
      if (!active) return;
      setUsers(res.data);
      setLoading(false);
    }

    loadUsers().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <header className="page-head">
        <div>
          <h1 className="page-title">Kelola Pengguna</h1>
          <p className="page-subtitle">Atur role dan akses akun dalam satu daftar ringkas.</p>
        </div>
      </header>

      {loading && <p className="page-subtitle">Memuat...</p>}

      <div className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Terdaftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="font-bold">{u.name}</td>
                <td className="text-[color:var(--color-ink-2)]">{u.email}</td>
                <td>
                  <select value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className={`badge ${roleColor[u.role]}`}>
                    <option value="siswa">siswa</option>
                    <option value="guru">guru</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="text-[color:var(--color-ink-2)]">
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td>
                  <button onClick={() => handleDelete(u._id)}
                    title="Hapus"
                    className="action-icon action-icon-danger">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
