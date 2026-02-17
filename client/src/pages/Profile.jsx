import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import * as authApi from "../api/auth.js";

export function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .getMe()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(authUser))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/50 space-y-4">
        <div>
          <span className="text-slate-400 text-sm">Name</span>
          <p className="text-white font-medium">{user?.name}</p>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Email</span>
          <p className="text-white font-medium">{user?.email}</p>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Role</span>
          <p className="text-white font-medium capitalize">{user?.role || "user"}</p>
        </div>
        <div className="pt-4 border-t border-slate-700">
          <h3 className="text-emerald-400 font-semibold mb-2">Rewards</h3>
          <div className="flex gap-6">
            <div>
              <span className="text-slate-400 text-sm block">Total won</span>
              <p className="text-white text-xl font-bold">₹{user?.totalWon ?? 0}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm block">Bugs won</span>
              <p className="text-white text-xl font-bold">{user?.winsCount ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
