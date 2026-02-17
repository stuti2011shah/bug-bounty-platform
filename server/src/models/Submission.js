import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    bug: { type: mongoose.Schema.Types.ObjectId, ref: "Bug", required: true },
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fixDescription: { type: String, required: true },
    proofLinks: [{ type: String }], // image/video links/github links

    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }
  },
  { timestamps: true }
);

// prevent same user submitting unlimited times for same bug (optional)
submissionSchema.index({ bug: 1, submitter: 1 });

export default mongoose.model("Submission", submissionSchema);