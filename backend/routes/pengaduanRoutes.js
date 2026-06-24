const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/pengaduanController");

router.get("/dashboard/stats", protect, adminOnly, ctrl.stats);
router.get("/", protect, ctrl.getAll);
router.get("/:id", protect, ctrl.getOne);
router.post("/", protect, upload.single("gambar"), ctrl.create);
router.put("/:id", protect, ctrl.update);
router.delete("/:id", protect, ctrl.remove);

module.exports = router;