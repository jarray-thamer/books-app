import mongoose, { Types } from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, require: true },
  author: String,
  price: Number,
  language: String,
  theme: String,
  imageUrl: String, // Cloudinary URL
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
