const { getBookByISBN } = require("../services/isbnService");

const fetchBook = async (req, res) => {
  try {
    const isbn = req.params.isbn.trim();
    if (!/^\d{10}(\d{3})?$/.test(isbn)) {
  return res.status(400).json({
    success: false,
    message: "Invalid ISBN. Please provide a valid ISBN-10 or ISBN-13.",
  });
}

    const book = await getBookByISBN(isbn);

    if (!book) {
  return res.status(404).json({
    success: false,
    message: "Book not found. Please enter book details manually.",
    manualEntry: true,
  });
}
    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("ISBN Lookup Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  fetchBook,
};