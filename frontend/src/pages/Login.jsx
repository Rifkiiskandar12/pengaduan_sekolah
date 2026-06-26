import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch {
      // Error is handled by the auth hook.
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-context">
        <div>
          <span className="brand-mark mb-6">PS</span>
          <h1 className="page-title text-[color:var(--color-accent-ink)]">
            Pengaduan sekolah yang tertata.
          </h1>
          <p className="auth-context-text mt-4 max-w-xl">
            Masuk untuk mencatat laporan, memantau status, dan membantu sekolah merespons masalah dengan jelas.
          </p>
        </div>
        <p className="auth-context-text text-sm">
          Akses untuk siswa, guru, dan admin.
        </p>
      </section>

      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} className="auth-card panel p-8">
          <h1 className="section-title mb-2">Login</h1>
          <p className="page-subtitle mb-6">Masukkan email dan password akun.</p>

          {error && <p className="alert alert-error mb-4">{error}</p>}

          <div className="mb-4">
            <label className="field-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field"
            />
          </div>

          <div className="mb-6">
            <label className="field-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4 text-[color:var(--color-ink-2)]">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-[color:var(--color-accent)]">
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
