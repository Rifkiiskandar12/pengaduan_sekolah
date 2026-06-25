const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ctrl = require("../controllers/pengaduanController");
const { protect, adminOnly } = require("../middleware/auth");
const guruOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "guru")
    return res.status(403).json({ message: "Akses ditolak" });
  next();
};

router.get("/dashboard/stats", protect, guruOrAdmin, ctrl.stats);
router.get("/", protect, ctrl.getAll);
router.get("/:id", protect, ctrl.getOne);
router.post("/", protect, upload.single("gambar"), ctrl.create);
router.put("/:id", protect, ctrl.update);
router.delete("/:id", protect, ctrl.remove);

module.exports = router;