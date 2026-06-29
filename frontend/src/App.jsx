import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FormPengaduan from "./pages/FormPengaduan";
import ListPengaduan from "./pages/ListPengaduan";
import DetailPengaduan from "./pages/DetailPengaduan";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./utils/PrivateRoute";
import EditPengaduan from "./pages/EditPengaduan";
import KelolaPengguna from "./pages/KelolaPengguna";
import KelolaKategori from "./pages/KelolaKategori";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pengaduan" element={<ListPengaduan />} />
            <Route path="/pengaduan/tambah" element={<FormPengaduan />} />
            <Route path="/pengaduan/:id" element={<DetailPengaduan />} />
            <Route path="/pengguna" element={<KelolaPengguna />} />
            <Route path="/kategori" element={<KelolaKategori />} />
            <Route path="/pengaduan/edit/:id" element={<EditPengaduan />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;