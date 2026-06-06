import express from "express";
import {
  addGoal,
  getGoals,
  deleteGoal
} from "../controllers/goalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGoals);
router.post("/", authMiddleware, addGoal);
router.delete("/:id", authMiddleware, deleteGoal);

export default router;