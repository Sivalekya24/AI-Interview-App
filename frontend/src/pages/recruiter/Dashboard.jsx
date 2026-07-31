import { useEffect, useState } from "react";
import {
  Users,
  ListVideo,
  Radio,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";

import { getRecruiterDashboard } from "../../lib/api";
import { Card } from "../../components/ui/primitives";
import { useNavigate } from "react-router-dom";

const STAT_CONFIG = [
  {
    key: "total_users",
    label: "Total Candidates",
    icon: Users,
    accent: "text-[#0E4B8E]",
  },
  {
    key: "total_interviews",
    label: "Interviews Conducted",
    icon: ListVideo,
    accent: "text-[#0E4B8E]",
  },
  {
    key: "running_interviews",
    label: "Live Interviews",
    icon: Radio,
    accent: "text-green-600",
  },
  {
    key: "completed_interviews",
    label: "Completed",
    icon: CheckCircle2,
    accent: "text-blue-600",
  },
  {
    key: "terminated_interviews",
    label: "Terminated",
    icon: XCircle,
    accent: "text-red-600",
  },
  {
    key: "total_violations",
    label: "Violations",
    icon: ShieldAlert,
    accent: "text-orange-500",
  },
  {
    key: "average_score",
    label: "Average AI Score",
    icon: Award,
    accent: "text-yellow-500",
  },
];

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    getRecruiterDashboard().then(({ data }) => setStats(data)).catch((err) => {
    console.error(err)
    setStats({})
})
  }, [])

  return (
  <div className="space-y-8">

    {/* ================= HERO ================= */}

    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0E4B8E] via-[#1659A5] to-[#2C6CC2] px-10 py-10 text-white shadow-xl">

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

      <div className="relative flex flex-col lg:flex-row justify-between items-center">

        <div>

          <p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

            Recruiter Dashboard

          </p>

          <h1 className="font-display text-5xl mt-5">

            Welcome Back

          </h1>

          <p className="mt-6 text-blue-100 text-lg leading-8 max-w-2xl">

            Monitor AI interviews, review candidate
            performance, track live interviews,
            analyse reports and manage recruitment
            from one central dashboard.

          </p>

        </div>

        <div className="hidden lg:block">

          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-7">

            <p className="uppercase tracking-widest text-blue-200 text-sm">

              Live Interviews

            </p>

            <h2 className="text-5xl font-bold mt-4">

              {stats?.running_interviews ?? 0}

            </h2>

            <p className="mt-3 text-blue-100">

              Currently Running

            </p>

          </div>

        </div>

      </div>

    </div>

    {/* ================= STATISTICS ================= */}

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {STAT_CONFIG.map(
        ({ key, label, icon: Icon, accent }) => (

          <Card
            key={key}
            className="rounded-[28px] border-0 shadow-lg p-7 hover:shadow-xl transition-all duration-300"
          >

            <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center">

              <Icon
                size={28}
                className={accent}
              />

            </div>

            <h2 className="font-display text-4xl mt-6">

              {stats?.[key] ?? "--"}

            </h2>

            <p className="text-gray-500 mt-2">

              {label}

            </p>

          </Card>

        )
      )}

    </div>
        {/* ================= QUICK ACTIONS ================= */}

    <div className="grid lg:grid-cols-3 gap-6">

      <Card className="rounded-[28px] border-0 shadow-lg p-7">

        <h2 className="font-display text-2xl">

          Quick Actions

        </h2>

        <div className="mt-6 space-y-4">

          <button
            onClick={() => navigate("/recruiter/live")}
            className="w-full rounded-2xl bg-[#EEF4FF] hover:bg-[#DDEBFF] transition-colors py-4 font-semibold text-[#0E4B8E]"
          >
            View Live Interviews
          </button>

          <button
            onClick={() => navigate("/recruiter/reports")}
            className="w-full rounded-2xl bg-[#EEF4FF] hover:bg-[#DDEBFF] transition-colors py-4 font-semibold text-[#0E4B8E]"
          >
            View Candidate Reports
          </button>

          <button
            onClick={() => navigate("/recruiter/users")}
            className="w-full rounded-2xl bg-[#EEF4FF] hover:bg-[#DDEBFF] transition-colors py-4 font-semibold text-[#0E4B8E]"
          >
            Manage Users
          </button>

        </div>

      </Card>

      {/* ================= RECENT ACTIVITY ================= */}

      <Card className="rounded-[28px] border-0 shadow-lg p-7">

        <h2 className="font-display text-2xl">

          Recent Activity

        </h2>

        <div className="mt-6 space-y-5">

          <div className="border-b pb-4">

            <p className="font-semibold">

              Interview Completed

            </p>

            <p className="text-gray-500 text-sm mt-2">

              Candidate completed the AI interview successfully.

            </p>

          </div>

          <div className="border-b pb-4">

            <p className="font-semibold">

              AI Report Generated

            </p>

            <p className="text-gray-500 text-sm mt-2">

              Candidate report is ready for recruiter review.

            </p>

          </div>

          <div>

            <p className="font-semibold">

              Resume Uploaded

            </p>

            <p className="text-gray-500 text-sm mt-2">

              Resume parsed successfully and ready for interview.

            </p>

          </div>

        </div>

      </Card>

      {/* ================= RECENT VIOLATIONS ================= */}

      <Card className="rounded-[28px] border-0 shadow-lg p-7">

        <h2 className="font-display text-2xl">

          Recent Violations

        </h2>

        <div className="mt-6 space-y-5">

          <div className="flex justify-between">

            <span>

              Fullscreen Exit

            </span>

            <span className="text-red-500 font-medium">

              High

            </span>

          </div>

          <div className="flex justify-between">

            <span>

              Multiple Faces

            </span>

            <span className="text-orange-500 font-medium">

              Medium

            </span>

          </div>

          <div className="flex justify-between">

            <span>

              Tab Switch

            </span>

            <span className="text-yellow-500 font-medium">

              Low

            </span>

          </div>

        </div>

      </Card>

    </div>
        {/* ================= SYSTEM STATUS ================= */}

    <div className="grid lg:grid-cols-2 gap-6">

      <Card className="rounded-[28px] border-0 shadow-lg p-8">

        <h2 className="font-display text-2xl">

          Platform Status

        </h2>

        <div className="mt-6 space-y-5">

          <div className="flex items-center justify-between">

            <span className="text-gray-600">

              AI Interview Engine

            </span>

            <span className="text-green-600 font-semibold">

              ● Online

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-gray-600">

              Live Proctoring

            </span>

            <span className="text-green-600 font-semibold">

              ● Active

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-gray-600">

              Resume Parser

            </span>

            <span className="text-green-600 font-semibold">

              ● Running

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-gray-600">

              Report Generator

            </span>

            <span className="text-green-600 font-semibold">

              ● Healthy

            </span>

          </div>

        </div>

      </Card>

      <Card className="rounded-[28px] border-0 shadow-lg p-8">

        <h2 className="font-display text-2xl">

          Recruiter Information

        </h2>

        <div className="mt-6 space-y-4 text-gray-600 leading-7">

          <p>

            Use this dashboard to monitor AI interviews,
            review candidate performance, analyse
            interview reports and manage users.

          </p>

          <p>

            Candidate interview scores, AI reports,
            transcripts and proctoring events are
            securely stored and available for review.

          </p>

          <p className="text-[#0E4B8E] font-semibold">

            SHNOOR AI Interview Platform

          </p>

        </div>

      </Card>

    </div>

  </div>
);
}
