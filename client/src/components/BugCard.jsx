import { Link } from "react-router-dom";
import { formatBounty } from "../utils/currency.js";

const STATUS_COLORS = {
  OPEN: "bg-emerald-500/20 text-emerald-400",
  IN_REVIEW: "bg-amber-500/20 text-amber-400",
  CLOSED: "bg-slate-500/20 text-slate-400",
};

export function BugCard({ bug }) {
  return (
    <Link
      to={`/bugs/${bug._id}`}
      className="block p-4 sm:p-5 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-emerald-500/50 hover:bg-slate-900 transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg text-white truncate">{bug.title}</h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{bug.description}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[bug.status] ?? "bg-slate-500/20 text-slate-400"}`}
            >
              {bug.status?.replace("_", " ")}
            </span>
            {bug.creator?.name && (
              <span className="text-slate-500 text-xs truncate">by {bug.creator.name}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-emerald-400 font-bold text-lg sm:text-xl">{formatBounty(bug.bountyAmount)}</div>
          <div className="text-slate-500 text-xs">bounty</div>
        </div>
      </div>
    </Link>
  );
}
