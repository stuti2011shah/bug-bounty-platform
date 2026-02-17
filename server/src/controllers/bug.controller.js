import Bug from "../models/Bug.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a bug
export const createBug = asyncHandler(async (req, res) => {
  const { title, description, bountyAmount } = req.body;

  const bug = await Bug.create({
    creator: req.user._id,
    title,
    description,
    bountyAmount,
  });

  res.status(201).json(bug);
});

// Get all bugs (public)
export const getAllBugs = asyncHandler(async (req, res) => {
  const bugs = await Bug.find()
    .populate("creator", "name email")
    .sort({ createdAt: -1 });

  res.json(bugs);
});

// Get single bug
export const getBugById = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id)
    .populate("creator", "name email")
    .populate("winner", "name email");

  if (!bug) {
    res.status(404);
    throw new Error("Bug not found");
  }

  res.json(bug);
});