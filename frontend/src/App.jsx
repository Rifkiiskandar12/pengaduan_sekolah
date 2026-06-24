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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/pengaduan/edit/:id" element={<EditPengaduan />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pengaduan" element={<ListPengaduan />} />
            <Route path="/pengaduan/tambah" element={<FormPengaduan />} />
            <Route path="/pengaduan/:id" element={<DetailPengaduan />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;