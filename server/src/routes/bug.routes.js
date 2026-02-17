import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createBug, getAllBugs, getBugById } from "../controllers/bug.controller.js";
import { validate } from "../middleware/validate.js";
import { createBugValidators } from "../validators/bug.validators.js";

const router = Router();

// public
router.get("/", getAllBugs);
router.get("/:id", getBugById);

// protected
router.post("/", protect, createBugValidators, validate, createBug);

export default router;