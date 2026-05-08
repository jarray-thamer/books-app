import { Route, Routes } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import BookFormPage from "./pages/BookFormPage";
import BookDetailsPage from "./pages/BookDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BooksPage />} />
      <Route path="/book-form" element={<BookFormPage />} />
      <Route path="/book-details/:id" element={<BookDetailsPage />} />
    </Routes>
  );
}

export default App;
