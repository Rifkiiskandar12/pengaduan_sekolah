import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout() {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}