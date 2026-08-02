const { getBookByISBN } = require("../services/isbnService");

const fetchBook = async (req, res) => {
    try {
        const { isbn } = req.params;

        const book = await getBookByISBN(isbn);

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    fetchBook,
};