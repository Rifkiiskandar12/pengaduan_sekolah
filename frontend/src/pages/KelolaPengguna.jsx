import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const roleColor = {
  admin: "bg-purple-100 text-purple-700",
  guru: "bg-blue-100 text-blue-700",
  siswa: "bg-green-100 text-green-700",
};

export default function KelolaPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get("/users");
    setUsers(res.data);
    setLoading(false);
  };

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

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>

      {loading && <p>Memuat...</p>}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Terdaftar</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-gray-500">{u.email}</td>
                <td className="px-4 py-2">
                  <select value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border-0 ${roleColor[u.role]}`}>
                    <option value="siswa">siswa</option>
                    <option value="guru">guru</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(u._id)}
                    title="Hapus"
                    className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200">
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