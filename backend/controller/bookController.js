import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";

export const createBook = async (req, res) => {
  console.log("body: ", req.body, "File : ", req.file);
  try {
    const { title, author, price, language, theme } = req.body;
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: "books",
        },
        async (error, result) => {
          if (error) throw error;

          const newBook = await Book.create({
            title,
            author,
            price,
            language,
            theme,
            imageUrl: result.secure_url,
          });

          return res.status(201).json({
            success: true,
            message: "book created with image",
            newBook,
          });
        },
      );
      result.end(req.file.buffer);
    } else {
      const newBook = await Book.create({
        title,
        author,
        price,
        language,
        theme,
      });
      return res.status(200).json({
        success: true,
        message: "Book created with no image",
        newBook,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong in creating book:",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const allBooks = await Book.find({});
    res.status(200).json({ succes: true, allBooks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong in getting all books",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong in getting book",
      error: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (book.imageUrl) {
      const publicId = book.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`books/${publicId}`);
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong in deleting book",
      error: error.message,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, language, theme } = req.body;

    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update basic fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (price) book.price = price;
    if (language) book.language = language;
    if (theme) book.theme = theme;

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (book.imageUrl) {
        const publicId = book.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`books/${publicId}`);
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "books",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      book.imageUrl = result.secure_url;
    }

    await book.save();
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong in updating book",
      error: error.message,
    });
  }
};
