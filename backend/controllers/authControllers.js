const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name, email, role } });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email atau password salah" });

    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) { next(err); }
};