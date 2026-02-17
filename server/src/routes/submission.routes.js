import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createSubmission,
  listSubmissionsForBug,
  approveSubmission,
} from "../controllers/submission.controller.js";
import { validate } from "../middleware/validate.js";
import { createSubmissionValidators } from "../validators/submission.validators.js";
import { uploadProof } from "../middleware/upload.js";

const router = Router({ mergeParams: true });

// /api/bugs/:bugId/submissions
router.get("/", listSubmissionsForBug);
router.post(
  "/",
  protect,
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      uploadProof(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
      });
    } else {
      next();
    }
  },
  createSubmissionValidators,
  validate,
  createSubmission
);

// /api/bugs/:bugId/submissions/:submissionId/approve
router.post("/:submissionId/approve", protect, approveSubmission);

export default router;