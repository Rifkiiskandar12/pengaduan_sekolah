import { useDarkMode } from "../hooks/useDarkMode";

export default function Navbar({ user, onLogout, onMenuClick }) {
  const { dark, toggleDark } = useDarkMode();

  return (
    <nav className="bg-blue-600 text-white px-4 md:px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick}
          className="md:hidden flex flex-col gap-1 p-2 hover:bg-blue-700 rounded">
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>
        <h1 className="font-bold text-base md:text-lg">Sistem Pengaduan Sekolah</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleDark}
          className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm">
          {dark ? "☀️" : "🌙"}
        </button>
        <span className="text-xs md:text-sm hidden sm:inline">{user?.name} ({user?.role})</span>
        <button onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}