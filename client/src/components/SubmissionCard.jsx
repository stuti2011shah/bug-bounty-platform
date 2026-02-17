const STATUS_COLORS = {
  PENDING: "bg-amber-500/20 text-amber-400",
  APPROVED: "bg-emerald-500/20 text-emerald-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export function SubmissionCard({ submission, bug, onApprove }) {
  const isCreator = bug?.creator && typeof bug.creator === "object";
  const canApprove =
    submission.status === "PENDING" &&
    bug?.status !== "CLOSED" &&
    onApprove;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-slate-700 bg-slate-900/50">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-slate-200">{submission.fixDescription}</p>
          {submission.proofLinks?.length > 0 && (
            <div className="mt-2 space-y-2">
              <ul className="flex flex-wrap gap-2">
                {submission.proofLinks.map((link, i) => {
                  const ext = (link.split(/[#?]/)[0].split(".").pop() || "").toLowerCase();
                  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                  const isVideo = ["mp4", "webm", "mov"].includes(ext);
                  return (
                    <li key={i} className="flex flex-col gap-1">
                      <a
                        href={link.startsWith("/") ? link : link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                      >
                        Proof {i + 1} ↗
                      </a>
                      {isImage && (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="block max-w-full w-fit">
                          <img src={link} alt={`Proof ${i + 1}`} className="rounded border border-slate-600 max-h-32 max-w-full object-contain" />
                        </a>
                      )}
                      {isVideo && (
                        <video src={link} controls className="max-w-full sm:max-w-md max-h-48 rounded border border-slate-600" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[submission.status] ?? "bg-slate-500/20 text-slate-400"}`}
            >
              {submission.status}
            </span>
            {submission.submitter?.name && (
              <span className="text-slate-500 text-xs">by {submission.submitter.name}</span>
            )}
          </div>
        </div>
        {canApprove && (
          <button
            onClick={() => onApprove(submission._id)}
            className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition w-full sm:w-auto"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
}
