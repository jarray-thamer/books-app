import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { books } from "../data/booksData";
import "./BookDetailsPage.css";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [book, setBook] = useState();

  const fetchBook = async () => {
    const res = await fetch(`http://localhost:3000/api/books/${id}`);
    const data = await res.json();

    setBook(data.book);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (!book) {
    return (
      <div className="details-error">
        <h2>Book not found</h2>
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to Books
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    await fetch(`http://localhost:3000/api/books/${id}`, { method: "DELETE" });

    setShowDeleteConfirm(false);
    navigate("/");
  };

  const handleUpdate = () => {
    navigate(`/book-form?id=${id}`);
  };

  return (
    <div className="book-details-container">
      <button onClick={() => navigate("/")} className="back-button">
        ← Back to Books
      </button>

      <div className="details-content">
        <div className="details-image-section">
          <img
            src={book.imageUrl || ""}
            alt={book.title}
            className="details-image"
          />
        </div>

        <div className="details-info-section">
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">By {book.author}</p>

          <div className="details-metadata">
            {book.theme && (
              <div className="detail-item">
                <span className="detail-label">Theme:</span>
                <span className="detail-value">{book.theme}</span>
              </div>
            )}
            {book.language && (
              <div className="detail-item">
                <span className="detail-label">Language:</span>
                <span className="detail-value">{book.language}</span>
              </div>
            )}
            {book.price && (
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${book.price}</span>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={handleUpdate} className="btn btn-update">
              ✏️ Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-delete"
            >
              🗑️ Delete
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirm-modal">
              <div className="confirm-content">
                <h3>Delete Book?</h3>
                <p>
                  Are you sure you want to delete "{book.title}"? This action
                  cannot be undone.
                </p>
                <div className="confirm-buttons">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-confirm-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
