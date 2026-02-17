import Bug from "../models/Bug.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/bugs/:bugId/submissions  (any logged-in user)
export const createSubmission = asyncHandler(async (req, res) => {
  const { bugId } = req.params;
  const { fixDescription } = req.body;

  const bug = await Bug.findById(bugId);
  if (!bug) return res.status(404).json({ message: "Bug not found" });
  if (bug.status === "CLOSED") return res.status(400).json({ message: "Bug is closed" });
  if (String(bug.creator) === String(req.user._id)) {
    return res.status(400).json({ message: "Bug creator cannot submit to their own bug" });
  }

  const proofLinks = [];

  if (req.body.proofLinks) {
    const links = typeof req.body.proofLinks === "string"
      ? req.body.proofLinks.split("\n").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(req.body.proofLinks) ? req.body.proofLinks : [];
    proofLinks.push(...links.filter((l) => /^https?:\/\//i.test(l)));
  }

  if (req.files?.length) {
    for (const f of req.files) {
      proofLinks.push(`/uploads/${f.filename}`);
    }
  }

  const submission = await Submission.create({
    bug: bug._id,
    submitter: req.user._id,
    fixDescription,
    proofLinks,
  });

  // move bug to IN_REVIEW once submissions start coming
  if (bug.status === "OPEN") {
    bug.status = "IN_REVIEW";
    await bug.save();
  }

  res.status(201).json(submission);
});

// GET /api/bugs/:bugId/submissions  (public or protected - your choice)
export const listSubmissionsForBug = asyncHandler(async (req, res) => {
  const { bugId } = req.params;

  const submissions = await Submission.find({ bug: bugId })
    .populate("submitter", "name email")
    .sort({ createdAt: -1 });

  res.json(submissions);
});

// POST /api/bugs/:bugId/submissions/:submissionId/approve  (creator-only)
export const approveSubmission = asyncHandler(async (req, res) => {
  const { bugId, submissionId } = req.params;

  const bug = await Bug.findById(bugId);
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  // only creator can approve
  if (String(bug.creator) !== String(req.user._id)) {
    return res.status(403).json({ message: "Only bug creator can approve" });
  }

  if (bug.status === "CLOSED") {
    return res.status(400).json({ message: "Bug already closed" });
  }

  const submission = await Submission.findOne({ _id: submissionId, bug: bugId });
  if (!submission) return res.status(404).json({ message: "Submission not found" });

  // mark all submissions as REJECTED except approved one (optional but clean)
  await Submission.updateMany({ bug: bugId }, { status: "REJECTED" });

  submission.status = "APPROVED";
  await submission.save();

  // close bug + declare winner + mark rewarded
  bug.status = "CLOSED";
  bug.winner = submission.submitter;
  bug.winningSubmission = submission._id;
  bug.rewarded = true;
  await bug.save();

  // reward logic-level update
  await User.findByIdAndUpdate(submission.submitter, {
    $inc: { totalWon: bug.bountyAmount, winsCount: 1 },
  });

  res.json({
    message: "Winner approved ✅",
    bug,
    approvedSubmission: submission,
  });
});