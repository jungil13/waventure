const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const controller = require("../controllers/packageController");

// Food Packages
router.post("/foodpackage", auth, upload.array("images", 5), controller.addFoodPackage);
router.put("/foodpackage/:package_id", auth, upload.array("images", 5), controller.editFoodPackage);
router.get("/foodpackage/boat/:boat_id", controller.getFoodPackages);
router.get("/foodpackage/user/:user_id", auth, controller.getFoodPackagesByUser);

// Addons
router.post("/addon", auth, upload.array("images", 5), controller.addAddon);
router.put("/addon/:addon_id", auth, upload.array("images", 5), controller.editAddon);
router.get("/addon/boat/:boat_id", controller.getAddons);
router.get("/addon/user/:user_id", auth, controller.getAddonsByUser);

module.exports = router;
