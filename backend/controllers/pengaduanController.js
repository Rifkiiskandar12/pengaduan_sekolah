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
    res.json(data);
  } catch (err) { next(err); }
};

// POST /api/pengaduan
exports.create = async (req, res, next) => {
  try {
    const { judul, isi, kategori } = req.body;
    const data = await Pengaduan.create({ judul, isi, kategori, pelapor: req.user.id });
    res.status(201).json(data);
  } catch (err) { next(err); }
};

// PUT /api/pengaduan/:id
exports.update = async (req, res, next) => {
  try {
    const data = await Pengaduan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });
    res.json(data);
  } catch (err) { next(err); }
};

// DELETE /api/pengaduan/:id
exports.remove = async (req, res, next) => {
  try {
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