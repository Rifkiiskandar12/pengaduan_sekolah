const mongoose = require("mongoose");

const kategoriSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-z0-9_\-\s]+$/
    }
}, { timestamps: true });

module.exports = mongoose.model("Kategori", kategoriSchema);