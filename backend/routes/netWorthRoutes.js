import express from "express";
import { getNetWorthSummary } from "../controllers/netWorthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNetWorthSummary);

export default router;