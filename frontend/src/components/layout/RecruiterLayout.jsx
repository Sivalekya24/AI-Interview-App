import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  ListVideo,
  ShieldAlert,
  Radio,
  LogOut,
  BarChart3,
  Download,
  Bell,
  UserCircle2,
  Mail,
} from "lucide-react";

import { useAuth } from "../../lib/auth-context";
import Logo from "../ui/Logo";
import { useEffect, useState } from "react";
import { getRecruiterDashboard } from "../../lib/api";
const NAV_ITEMS = [
  {
    to: "/recruiter/dashboard",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    to: "/recruiter/live",
    label: "Live Proctoring",
    icon: Radio,
  },
  {
    to: "/recruiter/interviews",
    label: "Interviews",
    icon: ListVideo,
  },
  {
    to: "/recruiter/reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
  to: "/recruiter/contact",
  label: "Contact Messages",
  icon: Mail,
  },
  {
    to: "/recruiter/violations",
    label: "Violations",
    icon: ShieldAlert,
  },
  {
    to: "/recruiter/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/recruiter/downloads",
    label: "Downloads",
    icon: Download,
  },
];

export default function RecruiterLayout() {

  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);

useEffect(() => {

    getRecruiterDashboard()
        .then(({ data }) => setStats(data))
        .catch(console.error);

}, []);

  return (

    <div className="min-h-screen flex bg-[#EEF3FA]">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col">

        {/* ================= LOGO ================= */}

        <div className="px-8 py-8 border-b border-slate-200">

          <Logo size={26} />

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 px-5 py-6 space-y-3">

          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (

            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? "bg-[#0E4B8E] text-white shadow-lg"
                    : "text-slate-500 hover:bg-[#EEF4FF] hover:text-[#0E4B8E]"
                }`
              }
            >

              <Icon
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span className="font-medium text-[15px]">

                {label}

              </span>

            </NavLink>

          ))}

        </nav>
                {/* ================= USER ================= */}

        <div className="border-t border-slate-200 p-5">

          <div className="rounded-3xl bg-[#EEF4FF] p-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-[#0E4B8E] flex items-center justify-center">

                <UserCircle2
                  size={34}
                  className="text-white"
                />

              </div>

              <div>

                <h3 className="font-semibold text-[#111827]">

                  {user?.full_name ??
                    user?.name ??
                    "Recruiter"}

                </h3>

                <p className="text-sm text-slate-500 mt-1">

                  {user?.email}

                </p>

              </div>

            </div>

            <button
              onClick={logout}
              className="mt-6 w-full flex items-center justify-center gap-3 rounded-2xl bg-red-50 py-3 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >

              <LogOut size={18} />

              Sign Out

            </button>

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 overflow-y-auto">

        {/* ================= HEADER ================= */}

        <header className="bg-white border-b border-slate-200 px-10 py-6 flex items-center justify-between">

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-slate-400">

              Recruiter Portal

            </p>

            <h1 className="font-display text-3xl mt-2 text-[#111827]">

              Welcome Back 👋

            </h1>

            <p className="text-slate-500 mt-2">

              Monitor interviews, review AI evaluations,
              and manage candidates from one place.

            </p>

          </div>

          <div className="flex items-center gap-6">

            <button className="relative">

             <Bell
    size={24}
    className="text-slate-600"
/>

{stats?.running_interviews > 0 && (

    <span
        className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1"
    >

        {stats.running_interviews}

    </span>

)}

            </button>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-[#0E4B8E] flex items-center justify-center">

                <UserCircle2
                  size={24}
                  className="text-white"
                />

              </div>

              <div>

                <p className="font-semibold">

                  {user?.full_name ??
                    user?.name ??
                    "Recruiter"}

                </p>

                <p className="text-xs text-slate-500">

                  Recruiter

                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ================= PAGE ================= */}

        <div className="p-10">

          <Outlet />

        </div>

      </main>

    </div>

  );

}