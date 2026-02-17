import { useState, useEffect } from "react";
import { BugCard } from "../components/BugCard.jsx";
import * as bugsApi from "../api/bugs.js";

export function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    bugsApi
      .getBugs()
      .then(setBugs)
      .catch(() => setError("Failed to load bugs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/20 text-red-400">{error}</div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Open bugs</h1>
      {bugs.length === 0 ? (
        <p className="text-slate-400">No bugs yet. Create the first one!</p>
      ) : (
        <div className="space-y-4">
          {bugs.map((bug) => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </div>
  );
}
