const axios = require("axios");

const isbnCache = new Map();

async function getBookByISBN(isbn) {

  if (isbnCache.has(isbn)) {
    console.log(`Cache hit for ISBN: ${isbn}`);
    return isbnCache.get(isbn);
  }

  try {
    const url = `https://openlibrary.org/isbn/${isbn}.json`;

    const response = await axios.get(url);

    const book = response.data;

    const normalizedBook = {
      title: book.title || null,
      publisher: book.publishers?.[0] || null,
      publishDate: book.publish_date || null,
      isbn13: book.isbn_13?.[0] || isbn,
      pages: book.number_of_pages || null,
      edition: book.edition_name || null,
      cover: book.covers?.length
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
        : null,
      source: "Open Library",
    };

    isbnCache.set(isbn, normalizedBook);

    return normalizedBook;

  } catch (error) {
    console.error("Open Library Lookup Error:", error.message);
    return null;
  }
}

module.exports = {
  getBookByISBN,
};