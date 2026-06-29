import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({ open, onClose }) {
  const { getUser } = useAuth();
  const user = getUser();

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "is-active" : ""}`;

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-20 md:hidden" />
      )}
      <aside className={`sidebar-panel fixed md:static top-0 left-0 h-screen w-56 p-4 z-30 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="sidebar-brand">
          <span className="brand-mark">PS</span>
          <div>
            <p className="sidebar-title">Pengaduan</p>
            <span className="sidebar-subtitle">{user?.role || "user"}</span>
          </div>
        </div>
        <nav className="flex flex-col gap-2" onClick={onClose}>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/pengaduan" end className={linkClass}>Daftar Pengaduan</NavLink>
          {user?.role === "siswa" && (
            <NavLink to="/pengaduan/tambah" className={linkClass}>Buat Pengaduan</NavLink>
          )}
          {(user?.role === "admin") && (
            <NavLink to="/pengguna" className={linkClass}>Kelola Pengguna</NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}
