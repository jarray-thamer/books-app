import React from "react";
import { useNavigate } from "react-router-dom";
import "./bookCard.css";

const BookCard = ({ bookData }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book-details/${bookData._id}`);
  };

  return (
    <div className="book-card-container" onClick={handleCardClick}>
      <div className="poster-container">
        <img
          className="book-poster"
          src={bookData?.imageUrl || ""}
          alt={bookData.title}
        />
      </div>
      <div className="book-information">
        <h4 className="book-title">{bookData.title}</h4>
        <p className="book-author">{bookData.author}</p>
      </div>
    </div>
  );
};

export default BookCard;
