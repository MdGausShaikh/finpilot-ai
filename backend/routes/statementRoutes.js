import express from "express";
import multer from "multer";
import { uploadStatement } from "../controllers/statementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/csv",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV, Excel and PDF files are supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("statement"),
  uploadStatement
);

export default router;