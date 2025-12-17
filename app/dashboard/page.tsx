'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar active="Home" />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-100"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                    Welcome back, {session.user?.name}!
                  </h1>
                  <p className="text-slate-600">{session.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                    <div className="text-slate-700 font-medium">Active Clients</div>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                    <div className="text-slate-700 font-medium">Open Cases</div>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
                    <div className="text-slate-700 font-medium">Pending Tasks</div>
                  </div>
                  <div className="text-4xl">✓</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-5 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                  <div className="font-semibold text-slate-900 mb-1">Add Client</div>
                  <div className="text-sm text-slate-600">Create new client profile</div>
                </button>
                
                <button className="p-5 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                  <div className="font-semibold text-slate-900 mb-1">New Case</div>
                  <div className="text-sm text-slate-600">Start a new case</div>
                </button>
                
                <button className="p-5 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📧</div>
                  <div className="font-semibold text-slate-900 mb-1">Email Inbox</div>
                  <div className="text-sm text-slate-600">AI-processed emails</div>
                </button>
                
                <button className="p-5 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                  <div className="font-semibold text-slate-900 mb-1">Reports</div>
                  <div className="text-sm text-slate-600">View analytics</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
