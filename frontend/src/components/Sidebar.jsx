import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({ open, onClose }) {
  const { getUser } = useAuth();
  const user = getUser();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200"
    }`;

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-20 md:hidden" />
      )}
      <aside className={`fixed md:static top-0 left-0 h-screen w-56 bg-white dark:bg-gray-800 shadow p-4 z-30 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <nav className="flex flex-col gap-2" onClick={onClose}>
          {(user?.role === "admin" || user?.role === "guru") && (
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          )}
          <NavLink to="/pengaduan" end className={linkClass}>Daftar Pengaduan</NavLink>
          {user?.role === "siswa" && (
            <NavLink to="/pengaduan/tambah" className={linkClass}>Buat Pengaduan</NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}