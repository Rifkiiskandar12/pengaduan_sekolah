import { useDarkMode } from "../hooks/useDarkMode";

export default function Navbar({ user, onLogout, onMenuClick }) {
  const { dark, toggleDark } = useDarkMode();

  return (
    <nav className="topbar">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="btn btn-secondary md:hidden !min-h-0 !p-2"
          aria-label="Buka navigasi"
        >
          <span className="block w-5 h-0.5 bg-current"></span>
          <span className="block w-5 h-0.5 bg-current mt-1"></span>
          <span className="block w-5 h-0.5 bg-current mt-1"></span>
        </button>
        <span className="brand-mark">PS</span>
        <h1 className="topbar-title truncate">SIPEKA</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="btn btn-secondary !min-h-0 !py-1 text-sm"
          aria-label="Ganti tema"
        >
          {dark ? "Terang" : "Gelap"}
        </button>
        <span className="hidden sm:inline text-xs md:text-sm text-[color:var(--color-ink-2)]">
          {user?.name} ({user?.role})
        </span>
        <button onClick={onLogout} className="btn btn-danger !min-h-0 !py-1 text-sm">
          Keluar
        </button>
      </div>
    </nav>
  );
}
