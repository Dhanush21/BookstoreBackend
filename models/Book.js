const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: [
      {
        type: String,
      },
    ],

    publisher: {
      type: String,
      trim: true,
    },

    publishDate: {
      type: String,
    },

    edition: {
      type: String,
    },

    pages: {
      type: Number,
    },

    cover: {
      type: String,
    },

    source: {
      type: String,
      default: "Open Library",
    },
    hsnSac: {
  type: String,
  trim: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);