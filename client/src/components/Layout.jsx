import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (e) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  const LeftNavLinks = () => (
    <>
      <Link
        to="/"
        className="text-slate-300 hover:text-white transition whitespace-nowrap"
        onClick={() => setMobileMenuOpen(false)}
      >
        Bugs
      </Link>
      {isAuthenticated ? (
        <>
          <Link
            to="/create"
            className="text-slate-300 hover:text-white transition whitespace-nowrap"
            onClick={() => setMobileMenuOpen(false)}
          >
            Create Bug
          </Link>
        </>
      ) : (
        null
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10 w-full">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4 min-h-[48px]">
            {/* Left side: brand + nav buttons */}
            <div className="flex items-center gap-4 min-w-0">
              <Link
                to="/"
                className="text-lg sm:text-xl font-bold text-emerald-400 hover:text-emerald-300 transition shrink-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bug Bounty
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-3 lg:gap-4">
                <LeftNavLinks />
              </nav>
            </div>

            {/* Right side: auth controls + mobile menu */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition"
                    aria-label="User menu"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    <svg
                      className="w-5 h-5 text-slate-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      aria-label="User menu"
                      className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-white font-semibold truncate">{user?.name || "User"}</p>
                        <p className="text-slate-400 text-sm truncate">{user?.email || ""}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          Role: <span className="capitalize">{user?.role || "user"}</span>
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          role="menuitem"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 transition"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:bg-slate-800 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white transition whitespace-nowrap"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition whitespace-nowrap shrink-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-2 pb-2 border-t border-slate-800 mt-2 flex flex-col [&_a]:flex [&_a]:items-center [&_a]:py-3 [&_a]:min-h-[44px] [&_button]:mt-2 [&_button]:py-3 [&_button]:min-h-[44px]">
              <LeftNavLinks />
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white transition whitespace-nowrap"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition whitespace-nowrap shrink-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
