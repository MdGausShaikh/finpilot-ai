import express from "express";
import { getAiCfoAnalysis } from "../controllers/aiCfoController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAiCfoAnalysis);

export default router;