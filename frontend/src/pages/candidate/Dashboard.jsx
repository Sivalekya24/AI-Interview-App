import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Mic,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Activity,
  Sparkles,
} from "lucide-react";

import { getMyResume , getCurrentInterview,
} from "../../lib/api";
import { Card, Button } from "../../components/ui/primitives";

export default function CandidateDashboard() {

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

        try {

            const resumeResponse =
                await getMyResume();

            setResume(resumeResponse.data);

        }

        catch {

            setResume(null);

        }

        try {

            const interviewResponse =
                await getCurrentInterview();

            setInterview(interviewResponse.data);

        }

        catch {

            setInterview({

                status: "NOT_STARTED",

            });

        }

        setLoading(false);

    };

    loadDashboard();

}, []);

  return (

<div className="candidate-dashboard space-y-8">

{/* ================= HERO ================= */}

<div className="candidate-hero relative overflow-hidden rounded-[32px] px-10 py-10 shadow-xl">
<div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

<div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

<div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center">

<div>

<p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

Candidate Dashboard

</p>

<h1 className="font-display text-5xl mt-5">

Welcome to SHNOOR AI Interview Platform

</h1>

<p className="mt-6 max-w-2xl text-lg text-blue-100 leading-8">

Manage your resume, complete your AI interview,
and receive intelligent evaluation reports powered
by SHNOOR AI.

</p>

</div>

<div className="mt-10 lg:mt-0">

<div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-7 w-[260px]">

<div className="flex items-center gap-3">

<Activity className="text-green-300" />

<p className="uppercase tracking-wider text-blue-200 text-sm">

Platform Status

</p>

</div>

<h2 className="text-4xl font-bold mt-4">

Ready

</h2>

<p className="mt-3 text-blue-100">

All AI services are operational.

</p>

</div>

</div>

</div>

</div>

{/* ================= QUICK STATS ================= */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

<Card className="candidate-card rounded-3xl border-0 shadow-md p-6">
<p className="text-gray-500 text-sm">

Resume

</p>

<h2 className="font-display text-4xl mt-2">

{resume ? "01" : "00"}

</h2>

<p className="mt-2 font-medium text-green-600">

{resume ? "Uploaded" : "Pending"}

</p>

</Card>

<Card className="candidate-card rounded-3xl border-0 shadow-md p-6">

<p className="text-gray-500 text-sm">

Interview

</p>

<h2 className="font-display text-4xl mt-2">

20

</h2>

<p className="mt-2 font-medium text-[#0E4B8E]">

Questions

</p>

</Card>

<Card className="candidate-card rounded-3xl border-0 shadow-md p-6">

<p className="text-gray-500 text-sm">

Mode

</p>

<h2 className="font-display text-4xl mt-2">

AI

</h2>

<p className="mt-2 font-medium text-[#0E4B8E]">

Voice Based

</p>

</Card>

<Card className="candidate-card rounded-3xl border-0 shadow-md p-6">

<p className="text-gray-500 text-sm">

Duration

</p>

<h2 className="font-display text-4xl mt-2">

45

</h2>

<p className="mt-2 font-medium text-[#0E4B8E]">

Minutes

</p>

</Card>

</div>
{/* ================= MAIN CARDS ================= */}

<div className="grid lg:grid-cols-2 gap-6">

{/* Resume Status */}

<Card className="candidate-card rounded-[28px] border-0 shadow-md hover:shadow-xl transition-all duration-300 p-8">

<div className="flex items-start justify-between">

<div className="flex gap-4">

<div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center">

<FileText
size={26}
className="text-[#0E4B8E]"
/>

</div>

<div>

<p className="uppercase tracking-widest text-xs text-gray-400">

Resume Status

</p>

<h2 className="text-2xl font-display mt-2 text-[#111827]">

{loading
? "Checking..."
: resume
? "Resume Uploaded"
: "Upload Required"}

</h2>

</div>

</div>

{resume ? (

<div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">

Ready

</div>

) : (

<div className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">

Pending

</div>

)}

</div>

<div className="mt-8">

<p className="text-gray-500">

{loading
? "Checking uploaded resume..."
: resume
? resume.filename
: "Upload your latest resume before starting the interview."}

</p>

</div>

<div className="mt-8 flex justify-between items-center">

<div>

<p className="text-sm text-gray-400">

Supported Formats

</p>

<p className="font-semibold">

PDF • DOC • DOCX

</p>

</div>

<Button

variant="secondary"

className="rounded-xl px-6"

onClick={() =>
navigate("/candidate/resume")
}

>

{resume
? "Replace"
: "Upload"}

<ArrowRight
size={16}
/>

</Button>

</div>

</Card>

{/* Interview Status */}

<Card className="candidate-card rounded-[28px] border-0 shadow-md hover:shadow-xl transition-all duration-300 p-8">

<div className="flex items-start justify-between">

<div className="flex gap-4">

<div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center">

<Mic
size={26}
className="text-[#0E4B8E]"
/>

</div>

<div>

<p className="uppercase tracking-widest text-xs text-gray-400">

Interview

</p>

<h2 className="text-2xl font-display mt-2 text-[#111827]">

    {
        interview?.status === "IN_PROGRESS"

            ? "Interview In Progress"

            : interview?.status === "COMPLETED"

            ? "Interview Completed"

            : interview?.status === "TERMINATED"

            ? "Interview Terminated"

            : "Ready to Begin"
    }

</h2>

</div>

</div>

<div className="px-3 py-1 rounded-full bg-blue-100 text-[#0E4B8E] text-sm font-medium">

AI Ready

</div>

</div>

<div className="mt-8 space-y-4">

<div className="flex justify-between">

<span className="text-gray-500">

Questions

</span>

<span className="font-semibold">

20

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-500">

Interview Mode

</span>

<span className="font-semibold">

Voice Based

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-500">

Duration

</span>

<span className="font-semibold">

30-45 Minutes

</span>

</div>

</div>

<Button

    className="w-full mt-8 h-12 rounded-xl bg-[#0E4B8E] hover:bg-[#0B417C]"

    disabled={
        !resume ||

        interview?.status === "COMPLETED" ||

        interview?.status === "TERMINATED"
    }

    onClick={() => {

        if (
            interview?.status === "IN_PROGRESS"
        ) {

            navigate("/candidate/interview");

        }

        else {

            navigate("/candidate/instructions");

        }

    }}

>

{

interview?.status === "IN_PROGRESS"

? "Resume Interview"

: interview?.status === "COMPLETED"

? "Interview Completed"

: interview?.status === "TERMINATED"

? "Interview Terminated"

: "Start AI Interview"

}

<ArrowRight
size={16}
/>

</Button>

</Card>

</div>
{/* ================= BOTTOM SECTION ================= */}

<div className="grid lg:grid-cols-[55%_45%] gap-6">

{/* Interview Process */}

<Card className="candidate-card rounded-[28px] border-0 shadow-md hover:shadow-xl transition-all duration-300 p-8">

<div className="flex items-center gap-3">

<div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center">

<Sparkles
size={24}
className="text-[#0E4B8E]"
/>

</div>

<div>

<p className="uppercase tracking-widest text-xs text-gray-400">

Process

</p>

<h2 className="text-2xl font-display mt-1">

Interview Journey

</h2>

</div>

</div>

<p className="text-gray-500 mt-5">

Complete the following steps to finish your AI interview.

</p>

<div className="mt-10 space-y-8">

<div className="flex gap-5">

<div className="flex flex-col items-center">

<div className="w-11 h-11 rounded-full bg-[#0E4B8E] text-white flex items-center justify-center font-semibold">

1

</div>

<div className="w-[2px] h-12 bg-[#D8E4F5] mt-2"></div>

</div>

<div>

<h3 className="font-semibold text-lg">

Upload Resume

</h3>

<p className="text-gray-500 mt-1">

Upload your latest resume in PDF or DOCX format.

</p>

</div>

</div>

<div className="flex gap-5">

<div className="flex flex-col items-center">

<div className="w-11 h-11 rounded-full bg-[#EEF4FF] text-[#0E4B8E] flex items-center justify-center font-semibold">

2

</div>

<div className="w-[2px] h-12 bg-[#D8E4F5] mt-2"></div>

</div>

<div>

<h3 className="font-semibold text-lg">

AI Resume Parsing

</h3>

<p className="text-gray-500 mt-1">

AI extracts skills, education, experience and projects.

</p>

</div>

</div>

<div className="flex gap-5">

<div className="flex flex-col items-center">

<div className="w-11 h-11 rounded-full bg-[#EEF4FF] text-[#0E4B8E] flex items-center justify-center font-semibold">

3

</div>

<div className="w-[2px] h-12 bg-[#D8E4F5] mt-2"></div>

</div>

<div>

<h3 className="font-semibold text-lg">

AI Interview

</h3>

<p className="text-gray-500 mt-1">

Answer 20 adaptive voice-based interview questions.

</p>

</div>

</div>

<div className="flex gap-5">

<div className="w-11 h-11 rounded-full bg-[#EEF4FF] text-[#0E4B8E] flex items-center justify-center font-semibold">

4

</div>

<div>

<h3 className="font-semibold text-lg">

Evaluation Report

</h3>

<p className="text-gray-500 mt-1">

Recruiters receive your AI-generated interview report.

</p>

</div>

</div>

</div>

</Card>

{/* System Status */}

<Card className="candidate-card rounded-[28px] border-0 shadow-md hover:shadow-xl transition-all duration-300 p-8">

<div className="flex items-center gap-3">

<div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center">

<ShieldCheck
size={24}
className="text-[#0E4B8E]"
/>

</div>

<div>

<p className="uppercase tracking-widest text-xs text-gray-400">

System

</p>

<h2 className="text-2xl font-display mt-1">

Ready Check

</h2>

</div>

</div>

<div className="mt-8 space-y-5">

<div className="flex items-center justify-between">

<span>Camera Access</span>

<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

Ready

</span>

</div>

<div className="flex items-center justify-between">

<span>Microphone</span>

<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

Ready

</span>

</div>

<div className="flex items-center justify-between">

<span>Internet</span>

<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

Stable

</span>

</div>

<div className="flex items-center justify-between">

<span>AI Proctoring</span>

<span className="px-3 py-1 rounded-full bg-blue-100 text-[#0E4B8E] text-sm">

Enabled

</span>

</div>

</div>

<div className="mt-10 rounded-2xl bg-[#EEF4FF] p-6">

<h3 className="font-semibold text-[#0E4B8E]">

Before You Begin

</h3>

<p className="text-gray-600 mt-3 leading-7 text-sm">

Choose a quiet environment with a stable internet connection. Keep your camera and microphone enabled throughout the interview for accurate AI evaluation.

</p>

</div>

</Card>

</div>
{/* ================= FOOTER ================= */}

<div className="candidate-footer rounded-[28px] shadow-md border  px-8 py-6 flex flex-col lg:flex-row items-center justify-between">

<div>

<h3 className="font-display text-2xl text-[#111827]">

Need Assistance?

</h3>

<p className="text-gray-500 mt-2">

If you experience any issues during your interview, please contact the recruitment team before starting.

</p>

</div>

<div className="mt-6 lg:mt-0 text-right">

<p className="text-[#0E4B8E] font-semibold">

SHNOOR AI Interview Platform

</p>

<p className="text-gray-500 text-sm mt-1">

© 2026 SHNOOR International LLC

</p>

</div>

</div>

</div>

);

}
