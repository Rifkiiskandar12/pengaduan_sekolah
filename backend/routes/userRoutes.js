const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/userController");

router.get("/", protect, adminOnly, ctrl.getAll);
router.put("/:id/role", protect, adminOnly, ctrl.updateRole);
router.delete("/:id", protect, adminOnly, ctrl.remove);

module.exports = router;