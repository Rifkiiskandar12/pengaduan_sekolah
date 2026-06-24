const Pengaduan = require("../models/Pengaduan");

// GET /api/pengaduan
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { pelapor: req.user.id };
    const { kategori, status, search } = req.query;
    if (kategori) filter.kategori = kategori;
    if (status) filter.status = status;
    if (search) filter.judul = { $regex: search, $options: "i" };

    const data = await Pengaduan.find(filter).populate("pelapor", "name email").sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/pengaduan/:id
exports.getOne = async (req, res, next) => {
  try {
    const data = await Pengaduan.findById(req.params.id).populate("pelapor", "name email");
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });

    // Cek otorisasi: siswa hanya bisa melihat pengaduan miliknya sendiri
    if (req.user.role !== "admin" && data.pelapor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.json(data);
  } catch (err) { next(err); }
};

// POST /api/pengaduan
exports.create = async (req, res, next) => {
  try {
    const { judul, isi, kategori } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const data = await Pengaduan.create({ judul, isi, kategori, pelapor: req.user.id, gambar });
    res.status(201).json(data);
  } catch (err) { next(err); }
};

// PUT /api/pengaduan/:id
exports.update = async (req, res, next) => {
  try {
    const data = await Pengaduan.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });

    if (req.user.role === "admin") {
      // Admin hanya diperbolehkan mengupdate status pengaduan
      if (req.body.status !== undefined) {
        data.status = req.body.status;
      }
    } else {
      // Siswa hanya bisa mengupdate pengaduan miliknya sendiri
      if (data.pelapor.toString() !== req.user.id) {
        return res.status(403).json({ message: "Akses ditolak" });
      }
      // Siswa hanya bisa mengupdate jika status masih "pending"
      if (data.status !== "pending") {
        return res.status(400).json({ message: "Pengaduan yang sedang diproses atau selesai tidak dapat diubah" });
      }
      // Siswa hanya bisa mengubah judul, isi, dan kategori
      const { judul, isi, kategori } = req.body;
      if (judul !== undefined) data.judul = judul;
      if (isi !== undefined) data.isi = isi;
      if (kategori !== undefined) data.kategori = kategori;
    }

    await data.save();
    const updatedData = await Pengaduan.findById(data._id).populate("pelapor", "name email");
    res.json(updatedData);
  } catch (err) { next(err); }
};

// DELETE /api/pengaduan/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Pengaduan.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });

    if (req.user.role !== "admin" && data.pelapor.toString() !== req.user.id)
      return res.status(403).json({ message: "Akses ditolak" });

    if (req.user.role === "siswa" && data.status !== "pending")
      return res.status(403).json({ message: "Hanya bisa hapus pengaduan berstatus pending" });

    await Pengaduan.findByIdAndDelete(req.params.id);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) { next(err); }
};

// GET /api/pengaduan/dashboard/stats
exports.stats = async (req, res, next) => {
  try {
    const total = await Pengaduan.countDocuments();
    const pending = await Pengaduan.countDocuments({ status: "pending" });
    const diproses = await Pengaduan.countDocuments({ status: "diproses" });
    const selesai = await Pengaduan.countDocuments({ status: "selesai" });
    res.json({ total, pending, diproses, selesai });
  } catch (err) { next(err); }
};