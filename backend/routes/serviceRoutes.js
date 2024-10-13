const express = require("express");
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
  purchaseService,
} = require("../controllers/serviceController");
const router = express.Router();

router.post("/", createService);
router.get("/", getAllServices);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.post("/services/:id/purchase", purchaseService);

module.exports = router;
