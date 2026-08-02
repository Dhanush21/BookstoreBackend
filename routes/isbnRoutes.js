const express = require("express");
const router = express.Router();

const { fetchBook } = require("../controllers/isbnController");

router.get("/:isbn", fetchBook);

module.exports = router;
