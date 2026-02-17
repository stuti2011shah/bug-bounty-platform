import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    bountyAmount: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ["OPEN", "IN_REVIEW", "CLOSED"], default: "OPEN" },

    rewarded: { type: Boolean, default: false },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    winningSubmission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Bug", bugSchema);