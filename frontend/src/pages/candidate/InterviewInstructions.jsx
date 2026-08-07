import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Camera,
  Mic,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Circle,
  Monitor,
  Wifi,
  Brain,
} from "lucide-react";

import { Card, Button } from "../../components/ui/primitives";
import PageTransition from "../../components/ui/PageTransition";

const RULES = [
  {
    icon: Camera,
    title: "Face Visibility",
    text: "Keep your face visible throughout the interview.",
  },
  {
    icon: Mic,
    title: "Voice Responses",
    text: "Answer every question using your microphone. Typing is disabled.",
  },
  {
    icon: ShieldCheck,
    title: "Single Candidate",
    text: "Only one person should be present during the interview.",
  },
  {
    icon: Clock,
    title: "Interview Format",
    text: "The interview contains 20 AI-generated questions.",
  },
];

export default function InterviewInstructions() {

  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);

  return (

<PageTransition>

<div className="interview-instructions-page max-w-6xl mx-auto space-y-8 pt-6 px-4">

{/* ================= HERO ================= */}

<div className="interview-hero relative overflow-hidden rounded-[32px] px-10 py-10 text-white shadow-xl">
<div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

<div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

<div className="relative flex flex-col lg:flex-row justify-between items-center">

<div>

<p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

Interview Instructions

</p>

<h1 className="font-display text-5xl mt-5">

Before You Begin

</h1>

<p className="mt-6 text-blue-100 text-lg leading-8 max-w-2xl">

Please read the following instructions carefully before
starting your AI-powered interview. Your interview will
be monitored using AI proctoring.

</p>

</div>

<div className="hidden lg:block">

<div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-7">

<p className="uppercase tracking-widest text-blue-200 text-sm">

Interview

</p>

<h2 className="text-4xl font-bold mt-4">

Ready

</h2>

<p className="mt-3 text-blue-100">

Waiting to Begin

</p>

</div>

</div>

</div>

</div>

{/* ================= SUMMARY ================= */}

<div className="grid md:grid-cols-2 gap-6">
<Card className="rounded-[30px] border-0 shadow-md p-8">

<p className="text-gray-500 text-sm">

Questions

</p>

<h2 className="font-display text-5xl mt-2">

20

</h2>

<p className="interview-primary-text mt-2 font-medium">

AI Generated

</p>

</Card>

<Card className="rounded-[30px] border-0 shadow-md p-8">

<p className="text-gray-500 text-sm">

Duration

</p>

<h2 className="font-display text-5xl mt-2">

45

</h2>

<p className="interview-primary-text mt-2 font-medium">

Minutes

</p>

</Card>

</div>
{/* ================= INSTRUCTIONS ================= */}

<Card className="rounded-[30px] border-0 shadow-md p-8">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-2xl interview-icon-bg flex items-center justify-center">

<Brain
size={28}
className="interview-primary-text"
/>

</div>

<div>

<p className="uppercase tracking-[0.35em] text-xs text-gray-400">

Instructions

</p>

<h2 className="text-2xl font-display mt-1">

Interview Guidelines

</h2>

</div>

</div>

<div className="mt-8 space-y-6">

{RULES.map(({ icon: Icon, title, text }, index) => (

<motion.div

key={title}

initial={{
opacity: 0,
x: -20,
}}

animate={{
opacity: 1,
x: 0,
}}

transition={{
delay: index * 0.08,
}}

className="flex gap-5"

>

<div className="w-14 h-14 rounded-2xl interview-icon-bg flex items-center justify-center flex-shrink-0">

<Icon
size={24}
className="interview-primary-text"
/>

</div>

<div>

<h3 className="text-lg font-semibold interview-heading">

{title}

</h3>

<p className="text-gray-500 mt-2 leading-7">

{text}

</p>

</div>

</motion.div>

))}

</div>

</Card>

{/* ================= SYSTEM CHECK ================= */}

<Card className="rounded-[30px] border-0 shadow-md p-8">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-2xl interview-icon-bg flex items-center justify-center">

<ShieldCheck
size={28}
className="interview-primary-text"
/>

</div>

<div>

<p className="uppercase tracking-[0.35em] text-xs text-gray-400">

System Check

</p>

<h2 className="text-2xl font-display mt-1">

Ready Verification

</h2>

</div>

</div>

<div className="mt-8 grid md:grid-cols-3 gap-5">

<div className="rounded-2xl border border-slate-200 p-6 text-center">

<Monitor

size={34}

className="mx-auto text-green-600"

/>

<h3 className="font-semibold mt-4">

Camera

</h3>

<p className="text-green-600 mt-2">

Ready

</p>

</div>

<div className="rounded-2xl border border-slate-200 p-6 text-center">

<Mic

size={34}

className="mx-auto text-green-600"

/>

<h3 className="font-semibold mt-4">

Microphone

</h3>

<p className="text-green-600 mt-2">

Ready

</p>

</div>

<div className="rounded-2xl border border-slate-200 p-6 text-center">

<Wifi

size={34}

className="mx-auto text-green-600"

/>

<h3 className="font-semibold mt-4">

Internet

</h3>

<p className="text-green-600 mt-2">

Stable

</p>

</div>

</div>

</Card>
{/* ================= AGREEMENT ================= */}

<Card className="rounded-[30px] border-0 shadow-md p-8">

<button

type="button"

onClick={() => setAgreed(!agreed)}

className={`w-full flex items-start gap-5 rounded-2xl border p-6 transition-all duration-300 ${
agreed
? "interview-consent-active"
: "border-slate-200 hover:border-[var(--color-primary)]"
}`}

>

{agreed ? (

<CheckCircle2

size={28}

className="interview-primary-text flex-shrink-0 mt-1"

/>

) : (

<Circle

size={28}

className="text-gray-400 flex-shrink-0 mt-1"

/>

)}

<div className="text-left">

<h3 className="text-lg font-semibold interview-heading">

Consent for AI Proctoring

</h3>

<p className="mt-2 text-gray-500 leading-7">

I understand that this interview records my camera,
microphone, browser activity and AI proctoring events
for assessment and security purposes.

</p>

</div>

</button>

</Card>

{/* ================= ACTION ================= */}

<Button

className="interview-button w-full h-14 rounded-2xl text-lg"

disabled={!agreed}

onClick={() =>
navigate("/candidate/interview")
}

>

Enter Interview Room

</Button>

{/* ================= SECURITY ================= */}

<div className="rounded-[28px] interview-security-bg border p-6">

<div className="flex items-start gap-4">

<div className="w-12 h-12 rounded-xl interview-card-white flex items-center justify-center">

<ShieldCheck

size={24}

className="interview-primary-text"

/>

</div>

<div>

<h3 className="font-semibold text-[#0E4B8E]">

Privacy & Security

</h3>

<p className="mt-3 text-gray-600 leading-7">

Your interview session is securely monitored to maintain
assessment integrity. Audio, video and proctoring events
are processed only for interview evaluation and are handled
according to SHNOOR's security policies.

</p>

</div>

</div>

</div>

</div>

</PageTransition>

);

}