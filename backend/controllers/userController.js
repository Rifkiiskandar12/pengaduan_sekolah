const User = require("../models/User");

// GET semua user
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

// PUT update role user
exports.updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) { next(err); }
};

// DELETE user
exports.remove = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) { next(err); }
};