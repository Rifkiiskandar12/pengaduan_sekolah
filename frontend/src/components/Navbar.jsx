export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">Sistem Pengaduan Sekolah</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.name} ({user?.role})</span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}