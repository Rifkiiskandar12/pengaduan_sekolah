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
      navigate("/dashboard");
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
          <p className="mt-4 max-w-xl text-[color:oklch(86%_0.025_120)]">
            Masuk untuk mencatat laporan, memantau status, dan membantu sekolah merespons masalah dengan jelas.
          </p>
        </div>
        <p className="text-sm text-[color:oklch(78%_0.025_120)]">
          Akses untuk siswa, guru, dan admin.
        </p>
      </section>

      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} className="auth-card panel p-8">
          <h1 className="text-2xl font-bold mb-6">Login</h1>

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
