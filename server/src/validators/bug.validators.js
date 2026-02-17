import { body } from "express-validator";

export const createBugValidators = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ min: 3, max: 200 }).withMessage("Title must be 3-200 characters"),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("bountyAmount")
    .notEmpty().withMessage("Bounty amount is required")
    .isFloat({ min: 0 }).withMessage("Bounty must be 0 or greater")
    .toFloat(),
];
