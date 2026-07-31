import { Outlet, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import Logo from "../ui/Logo";

export default function CandidateLayout() {

  const { user, logout } = useAuth();

  return (

    <div className="min-h-screen bg-[#EEF3FA]">

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 inset-x-0 z-20 bg-white shadow-sm border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">

          {/* Left Side */}

          <div className="flex items-center gap-5">

            <Link to="/candidate/dashboard">

              <Logo size={34} />

            </Link>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-[#0E4B8E] font-semibold">

                Candidate Portal

              </p>

              <p className="text-sm text-gray-500 mt-1">

              Secure AI Recruitment Platform

              </p>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-6">

            <div className="text-right">

              <p className="text-lg font-semibold text-[#111827]">

                {user?.name ?? "Candidate"}

              </p>

              <div className="flex justify-end items-center gap-2 mt-1">

                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

                <span className="text-sm text-gray-500">

                  {user?.role ?? "Candidate"}

                </span>

              </div>

            </div>

            <button

              onClick={logout}

              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[#0E4B8E] font-medium transition-all duration-200 hover:border-[#0E4B8E] hover:bg-[#EEF4FF] hover:shadow-sm"

            >

              <LogOut size={18} />

              Sign Out

            </button>

          </div>

        </div>

      </header>

      {/* ================= PAGE CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-8 py-8 pt-32">

        <Outlet />

      </main>

    </div>

  );

}