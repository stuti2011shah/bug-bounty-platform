import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { registerValidators, loginValidators } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", registerValidators, validate, register);
router.post("/login", loginValidators, validate, login);
router.get("/me", protect, getMe);

export default router;