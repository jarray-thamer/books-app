import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BookCard from "../components/BookCard";
import "./BooksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const fetchBooks = async () => {
    const res = await fetch("http://localhost:3000/api/books/get-all");
    const data = await res.json();
    setBooks(data.allBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <div className="books-page-container">
      <div className="books-header">
        <h1 className="books-title">📚 Books</h1>
        <Link to="/book-form" className="add-book-link">
          <button className="add-book-button">+ Add New Book</button>
        </Link>
      </div>
      <div className="books-grid">
        {books.map((book) => (
          <Link key={book._id} to={`/book-details/${book._id}`}>
            <BookCard bookData={book} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
