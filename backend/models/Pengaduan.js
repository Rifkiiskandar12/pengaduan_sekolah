const mongoose = require("mongoose");

const pengaduanSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
  },
  isi: {
    type: String,
    required: true,
  },
  kategori: {
    type: String,
    enum: ["fasilitas", "akademik", "bullying", "lainnya"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "diproses", "selesai"],
    default: "pending",
  },
  pelapor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Pengaduan", pengaduanSchema);