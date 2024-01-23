const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookname: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      age:  { type: Number },
      gender: { type: String },
    },
    pages: { type: Number },
    price:{ type: Number },
    color: { type: String }
  },
  {
      timestamps: true,
  });
// here i am assuming that in our project most relevant fields for search or filter are (author age, author name,book price,pages).
// we can change index fields as per our requirements.
// Index relevant fields for faster searching
bookSchema.index({ 'author.age': 1,'author.name': 1, price: 1, pages: 1});
const Books = mongoose.model('bookandauthor', bookSchema);

module.exports = Books;