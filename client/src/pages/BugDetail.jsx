import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { SubmissionCard } from "../components/SubmissionCard.jsx";
import { formatBounty } from "../utils/currency.js";
import { useAuth } from "../context/AuthContext.jsx";
import * as bugsApi from "../api/bugs.js";
import * as submissionsApi from "../api/submissions.js";

const STATUS_COLORS = {
  OPEN: "bg-emerald-500/20 text-emerald-400",
  IN_REVIEW: "bg-amber-500/20 text-amber-400",
  CLOSED: "bg-slate-500/20 text-slate-400",
};

export function BugDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [bug, setBug] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fixDescription: "", proofLinks: "" });
  const [proofFiles, setProofFiles] = useState([]);
  const [formError, setFormError] = useState("");

  const creatorId = bug?.creator?._id ?? bug?.creator;
  const isCreator = user && (user.id === creatorId || String(user.id) === String(creatorId));

  const loadData = () => {
    Promise.all([
      bugsApi.getBugById(id),
      submissionsApi.getSubmissionsForBug(id),
    ])
      .then(([b, s]) => {
        setBug(b);
        setSubmissions(s);
      })
      .catch(() => setError("Failed to load bug"))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadData(), [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const links = form.proofLinks
        ? form.proofLinks.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];
      await submissionsApi.createSubmission(id, {
        fixDescription: form.fixDescription,
        proofLinks: links,
        proofFiles: Array.from(proofFiles),
      });
      setForm({ fixDescription: "", proofLinks: "" });
      setProofFiles([]);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      await submissionsApi.approveSubmission(id, submissionId);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to approve");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !bug) {
    return (
      <div className="p-4 rounded-lg bg-red-500/20 text-red-400">
        {error || "Bug not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <Link to="/" className="text-emerald-400 hover:text-emerald-300 text-sm inline-block">
        ← Back to bugs
      </Link>
      <div className="p-4 sm:p-6 rounded-xl border border-slate-700 bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{bug.title}</h1>
            <p className="text-slate-300 mt-2">{bug.description}</p>
            <div className="flex items-center gap-3 mt-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[bug.status] ?? "bg-slate-500/20 text-slate-400"}`}
              >
                {bug.status?.replace("_", " ")}
              </span>
              {bug.creator?.name && (
                <span className="text-slate-500 text-sm">by {bug.creator.name}</span>
              )}
            </div>
            {bug.status === "CLOSED" && bug.winner && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-emerald-400 text-sm font-medium">Winner: {bug.winner.name}</span>
                {bug.winner.email && <span className="text-slate-400 text-sm ml-2">({bug.winner.email})</span>}
              </div>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-emerald-400 font-bold text-2xl">{formatBounty(bug.bountyAmount)}</div>
            <div className="text-slate-500 text-sm">bounty</div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Submissions</h2>
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {formError}
          </div>
        )}
        {user && bug.status !== "CLOSED" && !isCreator && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 sm:p-6 rounded-xl border border-slate-700 bg-slate-900/50 space-y-4">
            <h3 className="font-medium text-white">Submit a fix</h3>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Fix description</label>
              <textarea
                value={form.fixDescription}
                onChange={(e) => setForm((f) => ({ ...f, fixDescription: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe your fix..."
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Proof (images/videos from device)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={(e) => setProofFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-sm"
              />
              {proofFiles.length > 0 && (
                <p className="text-slate-400 text-xs mt-1">{proofFiles.length} file(s) selected (max 5, 10MB each)</p>
              )}
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Or add proof URLs (one per line)</label>
              <textarea
                value={form.proofLinks}
                onChange={(e) => setForm((f) => ({ ...f, proofLinks: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit fix"}
            </button>
          </form>
        )}
        {submissions.length === 0 ? (
          <p className="text-slate-400">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <SubmissionCard
                key={s._id}
                submission={s}
                bug={bug}
                onApprove={isCreator ? handleApprove : null}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
