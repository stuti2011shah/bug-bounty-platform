import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as bugsApi from "../api/bugs.js";

export function CreateBug() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    bountyAmount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const bug = await bugsApi.createBug({
        title: form.title,
        description: form.description,
        bountyAmount: Number(form.bountyAmount),
      });
      navigate(`/bugs/${bug._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bug");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
      <h1 className="text-2xl font-bold text-white mb-6">Create a bug</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-slate-400 text-sm mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Bug title"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Describe the bug..."
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Bounty amount ($)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.bountyAmount}
            onChange={(e) => setForm((f) => ({ ...f, bountyAmount: e.target.value }))}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="4000"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create bug"}
        </button>
      </form>
    </div>
  );
}
