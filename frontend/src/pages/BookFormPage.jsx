import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BookFormPage.css";

const BookFormPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    language: "",
    theme: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBookById = async () => {
    const res = await fetch(`http://localhost:3000/api/books/${id}`);
    const data = await res.json();
    setImagePreview(data.book.imageUrl);
    setForm({
      title: data.book.title,
      author: data.book.author,
      price: data.book.price,
      theme: data.book.theme,
      language: data.book.language,
    });
  };

  useEffect(() => {
    if (id) {
      fetchBookById();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      if (id) {
        // Update
        await fetch(`http://localhost:3000/api/books/${id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Create
        await fetch(`http://localhost:3000/api/books/create`, {
          method: "POST",
          body: formData,
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="form-title">
            {id ? "✏️ Edit Book" : "📝 Create Book"}
          </h1>
          <p className="form-subtitle">
            {id
              ? "Update the book details"
              : "Add a new book to your collection"}
          </p>
        </div>

        <div className="form-content">
          <div className="image-section">
            <label className="image-label">Book Cover</label>
            <div className="image-upload-container">
              {imagePreview || form.imageUrl ? (
                <img
                  src={imagePreview}
                  alt="Book cover preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">
                  <span className="placeholder-icon">📖</span>
                  <p>No image selected</p>
                </div>
              )}
            </div>
            <label htmlFor="file-input" className="file-input-label">
              Choose Image
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleImageChange}
              className="file-input"
              accept="image/*"
            />
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                id="title"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author *
              </label>
              <input
                id="author"
                name="author"
                placeholder="Enter author name"
                value={form.author}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                placeholder="Enter price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language" className="form-label">
                Language
              </label>
              <input
                id="language"
                name="language"
                placeholder="e.g., English, Spanish"
                value={form.language}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="theme" className="form-label">
                Theme
              </label>
              <input
                id="theme"
                name="theme"
                placeholder="e.g., Science Fiction, Mystery"
                value={form.theme}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={() => navigate("/")}
            className="btn btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-submit"
            disabled={loading}
          >
            {loading ? "Processing..." : id ? "Update Book" : "Create Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFormPage;
