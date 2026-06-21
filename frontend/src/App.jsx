import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FormPengaduan from "./pages/FormPengaduan";
import ListPengaduan from "./pages/ListPengaduan";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pengaduan" element={<ListPengaduan />} />
          <Route path="/pengaduan/tambah" element={<FormPengaduan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;