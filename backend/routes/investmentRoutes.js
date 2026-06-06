import express from "express";
import {
  addInvestment,
  getInvestments,
  deleteInvestment
} from "../controllers/investmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInvestments);
router.post("/", authMiddleware, addInvestment);
router.delete("/:id", authMiddleware, deleteInvestment);

export default router;