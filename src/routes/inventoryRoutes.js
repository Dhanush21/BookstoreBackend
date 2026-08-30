const express = require("express");

const {
  getInventory,
  getInventoryItem,
  stockIn,
  stockOut,
  adjustStock,
  getLowStock,
} = require("../../services/inventoryService");

const router = express.Router();

// Get all inventory
router.get("/", async (req, res) => {
  try {
    const inventory = await getInventory();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low-stock items
router.get("/low-stock", async (req, res) => {
  try {
    const threshold = req.query.threshold || 5;
    const inventory = await getLowStock(threshold);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one inventory item
router.get("/:id", async (req, res) => {
  try {
    const item = await getInventoryItem(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stock IN
router.post("/:id/stock-in", async (req, res) => {
  try {
    const item = await stockIn(req.params.id, req.body.quantity);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Stock OUT
router.post("/:id/stock-out", async (req, res) => {
  try {
    const item = await stockOut(req.params.id, req.body.quantity);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Adjust stock
router.patch("/:id/adjust", async (req, res) => {
  try {
    const item = await adjustStock(req.params.id, req.body.stock);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;