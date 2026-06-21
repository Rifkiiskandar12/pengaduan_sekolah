import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700"
    }`;

  return (
    <aside className="w-56 bg-white shadow h-screen p-4">
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/pengaduan" className={linkClass}>
          Daftar Pengaduan
        </NavLink>
        <NavLink to="/pengaduan/tambah" className={linkClass}>
          Buat Pengaduan
        </NavLink>
      </nav>
    </aside>
  );
}