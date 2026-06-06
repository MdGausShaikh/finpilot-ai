import express from "express";
import {
  addIncome,
  getIncome,
  deleteIncome
} from "../controllers/incomeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getIncome);
router.post("/", authMiddleware, addIncome);
router.delete("/:id", authMiddleware, deleteIncome);

export default router;