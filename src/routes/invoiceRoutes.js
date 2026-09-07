const express = require("express");
const Invoice = require("../../models/Invoice");
const Customer = require("../../models/Customer");

const {
  createInvoice,
  getInvoiceById,
  updatePaymentStatus,
} = require("../../services/invoiceService");

const router = express.Router();

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("store")
      .populate("customer");

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one invoice with invoice lines
router.get("/:id", async (req, res) => {
  try {
    const result = await getInvoiceById(req.params.id);

    res.json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

// Update payment status
router.patch("/:id/payment-status", async (req, res) => {
  try {
    const invoice = await updatePaymentStatus(
      req.params.id,
      req.body.paymentStatus
    );

    res.json(invoice);
  } catch (error) {
    if (error.message === "Invoice not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(400).json({ message: error.message });
  }
});

// Create invoice
router.post("/", async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;