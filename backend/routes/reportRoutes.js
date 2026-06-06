import express from "express";
import { getFinancialReport } from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getFinancialReport);

export default router;