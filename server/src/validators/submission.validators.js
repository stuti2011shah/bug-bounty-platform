import { body } from "express-validator";

export const createSubmissionValidators = [
  body("fixDescription").trim().notEmpty().withMessage("Fix description is required").isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("proofLinks")
    .optional()
    .custom((val) => {
      if (val == null || val === "") return true;
      const raw = Array.isArray(val) ? val : typeof val === "string" ? val.split(/\s+/).filter(Boolean) : [val];
      const urlRegex = /^https?:\/\/.+/i;
      for (const link of raw) {
        const s = typeof link === "string" ? link.trim() : "";
        if (!s) continue;
        if (!urlRegex.test(s)) throw new Error("Invalid URL in proof links");
      }
      return true;
    }),
];
