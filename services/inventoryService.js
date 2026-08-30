const InventoryItem = require("../models/InventoryItem");
const Book = require("../models/Book");
const Store = require("../models/Store");
// Get all inventory items
const getInventory = async () => {
  return await InventoryItem.find()
    .populate("book")
    .populate("store");
};

// Get one inventory item
const getInventoryItem = async (id) => {
  return await InventoryItem.findById(id)
    .populate("book")
    .populate("store");
};

// Stock IN
const stockIn = async (id, quantity) => {
  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = await InventoryItem.findById(id);

  if (!item) {
    throw new Error("Inventory item not found");
  }

  item.stock += Number(quantity);

  await item.save();

  return item;
};

// Stock OUT
const stockOut = async (id, quantity) => {
  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = await InventoryItem.findById(id);

  if (!item) {
    throw new Error("Inventory item not found");
  }

  if (item.stock < Number(quantity)) {
    throw new Error("Insufficient stock");
  }

  item.stock -= Number(quantity);

  await item.save();

  return item;
};

// Adjust stock to an exact value
const adjustStock = async (id, stock) => {
  if (stock === undefined || stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const item = await InventoryItem.findById(id);

  if (!item) {
    throw new Error("Inventory item not found");
  }

  item.stock = Number(stock);

  await item.save();

  return item;
};

// Get low-stock items
const getLowStock = async (threshold = 5) => {
  return await InventoryItem.find({
    stock: { $lte: Number(threshold) },
  })
    .populate("book")
    .populate("store");
};

module.exports = {
  getInventory,
  getInventoryItem,
  stockIn,
  stockOut,
  adjustStock,
  getLowStock,
};