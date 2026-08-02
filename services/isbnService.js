const axios = require("axios");
const isbnCache = new Map();
async function getBookByISBN(isbn) {

    if (isbnCache.has(isbn)) {
  console.log("Returning data from cache...");
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
  console.log("Open Library failed. Trying Google Books...");

  
  try {
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    const googleResponse = await axios.get(googleUrl);

    if (!googleResponse.data.items || googleResponse.data.items.length === 0) {
      return null;
    }

    const book = googleResponse.data.items[0].volumeInfo;

    return {
      title: book.title || null,
      authors: book.authors || [],
      publisher: book.publisher || null,
      publishDate: book.publishedDate || null,
      isbn13: isbn,
      pages: book.pageCount || null,
      cover: book.imageLinks?.thumbnail || null,
      source: "Google Books",
    };
     } catch (googleError) {
    console.error("Google Books Lookup Error:", googleError.message);
    return null;
  }
}
}
  
module.exports = {
  getBookByISBN,
};