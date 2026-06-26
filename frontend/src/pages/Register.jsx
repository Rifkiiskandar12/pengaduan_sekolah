import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-context">
        <div>
          <span className="brand-mark mb-6">PS</span>
          <h1 className="page-title">
            Mulai dari satu laporan.
          </h1>
          <p className="auth-context-text mt-4 max-w-xl">
            Buat akun untuk mengirim pengaduan dan mengikuti proses tindak lanjutnya.
          </p>
        </div>
      </section>

      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} className="auth-card panel p-8">
          <h1 className="section-title mb-2">Daftar Akun</h1>
          <p className="page-subtitle mb-6">Isi data dasar untuk membuat akun baru.</p>

          {error && <p className="alert alert-error mb-4">{error}</p>}

          <div className="mb-4">
            <label className="field-label">Nama</label>
            <input name="name" value={form.name} onChange={handleChange} required className="field" />
          </div>

          <div className="mb-4">
            <label className="field-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="field"
            />
          </div>

          <div className="mb-4">
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Mendaftar..." : "Daftar"}
          </button>

          <p className="text-sm text-center mt-4 text-[color:var(--color-ink-2)]">
            Sudah punya akun?{" "}
            <Link to="/" className="font-semibold text-[color:var(--color-accent)]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
