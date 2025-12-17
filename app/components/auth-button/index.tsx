'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-lg flex-shrink-0"></div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full border-2 border-slate-200"
            />
          )}
          <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
            {session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-6 py-2 bg-[#1abc9c] hover:bg-[#16a085] text-white text-sm font-semibold rounded-lg transition-all hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1abc9c]/30 whitespace-nowrap flex-shrink-0"
    >
      Sign In
    </button>
  );
}
