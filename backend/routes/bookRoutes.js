import express from "express";
import {
  createBook,
  getAll,
  getById,
  deleteBook,
  updateBook,
} from "../controller/bookController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("image"), createBook);
router.get("/get-all", getAll);
router.get("/:id", getById);
router.delete("/:id", deleteBook);
router.put("/:id", upload.single("image"), updateBook);

export default router;
