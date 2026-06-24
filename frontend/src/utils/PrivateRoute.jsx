import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/" replace />;

  // Redirect siswa langsung ke pengaduan
  if (user.role === "siswa" && window.location.pathname === "/dashboard") {
    return <Navigate to="/pengaduan" replace />;
  }

  return <Outlet />;
}