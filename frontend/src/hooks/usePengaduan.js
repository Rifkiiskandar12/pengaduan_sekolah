import { useState } from "react";
import api from "../services/api";

export const usePengaduan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/pengaduan", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/pengaduan", data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat pengaduan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.put(`/pengaduan/${id}`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/pengaduan/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal hapus");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, create, update, remove, loading, error };
};