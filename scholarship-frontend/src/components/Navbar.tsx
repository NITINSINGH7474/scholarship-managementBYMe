"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logout } from "@/src/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ui/ThemeToggle";

const API_URL = "http://localhost:5000"; // Fallback if env not set

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith("http") ? user.avatar : `${API_URL}${user.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`;

  return (
    <nav className="glass sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <Link href="/" className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
        🎓 Scholarship Platform
      </Link>

      <div className="flex gap-6 items-center">
        <ThemeToggle />
        {!isAuthenticated && (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all">
              Signup
            </Link>
          </>
        )}

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            {/* Profile Dropdown Trigger (Simple Image for now) */}
            <Link href="/dashboard/profile" className="flex items-center gap-2 group">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-400 object-cover transition-all"
              />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden md:block">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>

            {user?.role === "APPLICANT" && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">Dashboard</Link>
            )}
            {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors text-sm">Admin</Link>
            )}
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
