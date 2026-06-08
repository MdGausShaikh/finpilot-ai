import express from "express";
import { getExpenseReports } from "../controllers/expenseReportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getExpenseReports);

export default router;