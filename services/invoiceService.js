const Invoice = require("../models/Invoice");
const InvoiceLine = require("../models/InvoiceLine");
const InventoryItem = require("../models/InventoryItem");

// Calculate GST
function calculateGST(taxableAmount, gstRate, isInterState) {
  const totalTax = (taxableAmount * gstRate) / 100;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = totalTax;
  } else {
    cgstAmount = totalTax / 2;
    sgstAmount = totalTax / 2;
  }

  return {
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
  };
}

// Create invoice
async function createInvoice({
  storeId,
  customerId,
  items,
  isInterState = false,
}) {
  // Validate required fields
  if (!storeId) {
    throw new Error("Store ID is required");
  }

  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one invoice item is required");
  }

  // Validate all items before creating invoice
  for (const item of items) {
    if (!item.inventoryItemId) {
      throw new Error("Inventory item ID is required");
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Quantity must be a positive integer");
    }

    const inventoryItem = await InventoryItem.findById(
      item.inventoryItemId
    );

    if (
      !inventoryItem ||
      inventoryItem.store.toString() !== storeId.toString()
    ) {
      throw new Error("Inventory item not found");
    }

    if (item.quantity > inventoryItem.stock) {
      throw new Error(
        `Insufficient stock for inventory item ${item.inventoryItemId}`
      );
    }
  }

  let subtotal = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalTax = 0;

  const invoiceNumber = `INV-${Date.now()}`;

  const invoice = await Invoice.create({
    invoiceNumber,
    store: storeId,
    customer: customerId,
    subtotal: 0,
    totalAmount: 0,
  });

  for (const item of items) {
    const inventoryItem = await InventoryItem.findById(
      item.inventoryItemId
    ).populate("book");

    const quantity = item.quantity;

    const taxableAmount = inventoryItem.price * quantity;

    const gst = calculateGST(
      taxableAmount,
      inventoryItem.gstRate,
      isInterState
    );

    const lineTotal = taxableAmount + gst.totalTax;

    await InvoiceLine.create({
      invoice: invoice._id,
      book: inventoryItem.book._id,
      quantity,
      unitPrice: inventoryItem.price,
      hsnSac: inventoryItem.book.hsnSac,
      gstRate: inventoryItem.gstRate,
      taxableAmount,
      cgstAmount: gst.cgstAmount,
      sgstAmount: gst.sgstAmount,
      igstAmount: gst.igstAmount,
      totalTax: gst.totalTax,
      lineTotal,
    });

    // Reduce inventory stock after billing
    inventoryItem.stock -= quantity;
    await inventoryItem.save();

    subtotal += taxableAmount;
    totalCgst += gst.cgstAmount;
    totalSgst += gst.sgstAmount;
    totalIgst += gst.igstAmount;
    totalTax += gst.totalTax;
  }

  invoice.subtotal = subtotal;
  invoice.cgstAmount = totalCgst;
  invoice.sgstAmount = totalSgst;
  invoice.igstAmount = totalIgst;
  invoice.totalTax = totalTax;
  invoice.totalAmount = subtotal + totalTax;

  await invoice.save();

  return invoice;
}

// Get invoice with its lines
async function getInvoiceById(invoiceId) {
  const invoice = await Invoice.findById(invoiceId)
    .populate("store")
    .populate("customer");

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const lines = await InvoiceLine.find({
    invoice: invoiceId,
  }).populate("book");

  return {
    invoice,
    lines,
  };
}

// Update payment status
async function updatePaymentStatus(invoiceId, paymentStatus) {
  const allowedStatuses = [
    "PENDING",
    "PAID",
    "PARTIAL",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(paymentStatus)) {
    throw new Error("Invalid payment status");
  }

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  invoice.paymentStatus = paymentStatus;

  await invoice.save();

  return invoice;
}

module.exports = {
  calculateGST,
  createInvoice,
  getInvoiceById,
  updatePaymentStatus,
};