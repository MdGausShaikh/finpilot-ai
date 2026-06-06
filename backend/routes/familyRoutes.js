import express from "express";
import {
  addFamilyMember,
  getFamilyMembers,
  deleteFamilyMember
} from "../controllers/familyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getFamilyMembers);
router.post("/", authMiddleware, addFamilyMember);
router.delete("/:id", authMiddleware, deleteFamilyMember);

export default router;