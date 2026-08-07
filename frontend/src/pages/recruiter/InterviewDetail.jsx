import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  User,
  Mail,
  Clock3,
  Brain,
  FileText,
  ShieldAlert,
  CheckCircle2,
  SquareTerminal,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getInterview,
  getInterviewReport,
  getInterviewAnswers,
  getInterviewViolations,
  terminateInterview,viewResume,
downloadInterviewReport,
downloadResume,

downloadBlob,

} from "../../lib/api";

import { Card } from "../../components/ui/primitives";
import ViolationBadge from "../../components/proctoring/ViolationBadge";

const TABS = [
  {
    id: "Report",
    icon: Brain,
  },
  {
    id: "Answers",
    icon: FileText,
  },
  {
    id: "Violations",
    icon: ShieldAlert,
  },
];

export default function InterviewDetail() {

  const navigate = useNavigate();

  const { interviewId } = useParams();

  const socketRef = useRef(null);

  const [tab, setTab] = useState("Report");

  const [interview, setInterview] = useState(null);

  const [report, setReport] = useState(null);

  const [answers, setAnswers] = useState([]);

  const [violations, setViolations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [terminating, setTerminating] = useState(false);

  useEffect(() => {

    loadInterview();

  }, [interviewId]);

  async function loadInterview() {

    try {

      setLoading(true);

      const interviewRes =
        await getInterview(interviewId);

      setInterview(interviewRes.data);

      const reportRes =
        await getInterviewReport(interviewId);

      setReport(reportRes.data);

      const answersRes =
        await getInterviewAnswers(interviewId);

      setAnswers(
        answersRes.data.answers ??
        answersRes.data
      );

      const violationsRes =
        await getInterviewViolations(interviewId);

      setViolations(
        violationsRes.data.violations ??
        violationsRes.data
      );

    }

    catch (err) {

      console.error(err);

      toast.error(
        "Unable to load interview."
      );

    }

    finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    const socket = new WebSocket(

      `ws://127.0.0.1:8000/ws/recruiter/${interviewId}`

    );

    socket.onopen = () => {

      console.log("Recruiter Connected");

    };

    socket.onmessage = async (event) => {

      const message =
        JSON.parse(event.data);

      if (message.type === "VIOLATION") {

        toast.error(

          `${message.violation.replaceAll("_", " ")} detected`

        );

      }

      if (message.type === "TERMINATED") {

        toast.error(
          "Interview terminated."
        );

      }

      await loadInterview();

    };

    socketRef.current = socket;

    return () => {

      socket.close();

    };

  }, [interviewId]);

  async function handleTerminate() {

    const ok = window.confirm(

      "Terminate this interview?"

    );

    if (!ok) return;

    try {

      setTerminating(true);

      await terminateInterview(
        interviewId
      );

      socketRef.current?.send(

        JSON.stringify({

          type: "TERMINATED",

          interviewId,

        })

      );

      toast.success(
        "Interview terminated."
      );

      await loadInterview();

    }

    catch (err) {

      console.error(err);

      toast.error(
        "Unable to terminate interview."
      );

    }

    finally {

      setTerminating(false);

    }

  }

  if (loading) {

    return (

      <div className="flex items-center justify-center h-[60vh]">

        <p className="text-gray-500">

          Loading Interview...

        </p>

      </div>

    );

  }
    return (

    <div className="interview-detail-page space-y-8">
      {/* ================= HERO ================= */}

      <div className="interview-detail-hero relative overflow-hidden rounded-[32px] px-10 py-10 text-white shadow-xl">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start gap-8">

          <div>

            <p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

              Candidate Interview

            </p>

            <h1 className="font-display text-5xl mt-5">

              {interview?.candidate_name ??
                `Interview #${interviewId}`}

            </h1>

            <div className="flex items-center gap-3 mt-6 text-blue-100">

              <Mail size={18} />

              <span>

                {interview?.candidate_email ??
                  "--"}

              </span>

            </div>

          </div>

          {interview?.status ===
            "IN_PROGRESS" && (

            <button

              onClick={handleTerminate}

              disabled={terminating}

              className="rounded-2xl bg-red-600 hover:bg-red-700 transition px-6 py-3 font-semibold"

            >

              {terminating

                ? "Terminating..."

                : "Terminate Interview"}

            </button>

          )}

        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Candidate */}

        <Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

          <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

            <User
              size={28}
              className="interview-detail-primary"
            />

          </div>

          <p className="text-gray-500 mt-5">

            Candidate

          </p>

          <h2 className="font-display text-2xl mt-2">

            {interview?.candidate_name ??
              "--"}

          </h2>

          <p className="text-gray-500 mt-2 break-all">

            {interview?.candidate_email ??
              "--"}

          </p>

        </Card>

        {/* Status */}

        <Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

          <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

            <CheckCircle2
              size={28}
              className="text-green-600"
            />

          </div>

          <p className="text-gray-500 mt-5">

            Interview Status

          </p>

          <div className="mt-5">

            {interview?.status ===
              "COMPLETED" && (

              <span className="inline-flex rounded-full bg-green-100 text-green-700 px-4 py-2 font-semibold">

                ✅ Completed

              </span>

            )}

            {interview?.status ===
              "IN_PROGRESS" && (

              <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-4 py-2 font-semibold">

                🔵 In Progress

              </span>

            )}

            {interview?.status ===
              "TERMINATED" && (

              <span className="inline-flex rounded-full bg-red-100 text-red-700 px-4 py-2 font-semibold">

                ❌ Terminated

              </span>

            )}

          </div>

        </Card>

        {/* Resume */}

<Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

  <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

    <FileText
      size={28}
      className="interview-detail-primary"
    />

  </div>

  <p className="text-gray-500 mt-5">

    Resume

  </p>

  <h2 className="font-display text-lg mt-2 break-all">

    {interview?.resume_filename ??
      "Resume"}

  </h2>

  <div className="flex gap-3 mt-6">

    {/* View Resume */}

    <button

      onClick={async () => {

        try {

          const response =
            await viewResume(interviewId);

          const blob = new Blob(
            [response.data],
            {
              type:
                response.headers[
                  "content-type"
                ],
            }
          );

          const url =
            window.URL.createObjectURL(
              blob
            );

          // Open in same tab

          window.location.href = url;

        }

        catch (err) {

          console.error(err);

          toast.error(
            "Unable to open resume."
          );

        }

      }}

      className="flex items-center gap-2 rounded-xl interview-detail-blue-bg interview-detail-primary px-4 py-2 font-semibold"
    >

      <Eye size={18} />

      View Resume

    </button>

    {/* Download Resume */}

    <button

      onClick={async () => {

        try {

          const response =
            await downloadResume(
              interviewId
            );

          downloadBlob(

            response,

            interview?.resume_filename ??
            "Resume"

          );

        }

        catch (err) {

          console.error(err);

          toast.error(
            "Unable to download resume."
          );

        }

      }}

      className="flex items-center gap-2 rounded-xl interview-detail-blue-bg interview-detail-primary px-4 py-2 font-semibold"

    >

      <Download size={18} />

      Download Resume

    </button>

  </div>

</Card>

        {/* Difficulty */}

        <Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

          <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

            <SquareTerminal
              size={28}
              className="interview-detail-primary"
            />

          </div>

          <p className="text-gray-500 mt-5">

            Difficulty

          </p>

          <h2 className="font-display text-2xl mt-2">

            {interview?.difficulty ??
              "--"}

          </h2>

        </Card>

        {/* Started */}

        <Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

          <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

            <Clock3
              size={28}
              className="interview-detail-primary"
            />

          </div>

          <p className="text-gray-500 mt-5">

            Started

          </p>

          <h2 className="text-lg mt-2 leading-7">

            {interview?.started_at

              ? new Date(
                  interview.started_at
                ).toLocaleString()

              : "--"}

          </h2>

        </Card>

        {/* Completed */}

        <Card className="interview-detail-card rounded-[28px] border-0 shadow-lg p-6">

          <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

            <Clock3
              size={28}
              className="interview-detail-primary"
            />

          </div>

          <p className="text-gray-500 mt-5">

            Completed

          </p>

          <h2 className="text-lg mt-2 leading-7">

            {interview?.completed_at

              ? new Date(
                  interview.completed_at
                ).toLocaleString()

              : "--"}

          </h2>

        </Card>

      </div>

      {/* ================= TABS ================= */}

      <div className="flex gap-4">

        {TABS.map(
          ({ id, icon: Icon }) => (

            <button

              key={id}

              onClick={() =>
                setTab(id)
              }

              className={`flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-300 ${
                tab === id
                  ? "interview-detail-button shadow-lg"
                  : "interview-detail-card hover:interview-detail-blue-bg text-slate-600"
              }`}

            >

              <Icon size={18} />

              {id}

            </button>

          )
        )}

      </div>
            {/* ================= REPORT ================= */}

      {tab === "Report" && (

        <div className="space-y-6">

          {!report ? (

            <Card className="interview-detail-card rounded-[30px] p-8">

              <p className="text-gray-500">

                No AI report available.

              </p>

            </Card>

          ) : (

            <>

              {/* ================= SCORE CARDS ================= */}

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                {[
                  {
                    title: "Overall Score",
                    value: report.overall_score,
                    color: "text-[#0E4B8E]",
                  },
                  {
                    title: "Technical",
                    value: report.technical_score,
                    color: "text-green-600",
                  },
                  {
                    title: "Communication",
                    value: report.communication_score,
                    color: "text-orange-500",
                  },
                  {
                    title: "Problem Solving",
                    value: report.problem_solving_score,
                    color: "text-purple-600",
                  },
                ].map((item) => (

                  <Card
                    key={item.title}
                    className="interview-detail-card rounded-[28px] border-0 shadow-lg p-7"
                  >

                    <div className="w-14 h-14 rounded-2xl interview-detail-blue-bg flex items-center justify-center">

                      <Brain
                        size={28}
                        className={item.color}
                      />

                    </div>

                    <h2 className={`font-display text-5xl mt-6 ${item.color}`}>

                      {item.value ?? "--"}

                    </h2>

                    <p className="text-gray-500 mt-3">

                      {item.title}

                    </p>

                  </Card>

                ))}

              </div>

              {/* ================= RECOMMENDATION ================= */}

              <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8">

                <h2 className="font-display text-2xl">

                  AI Recommendation

                </h2>

                <div className="mt-6">

    <span
        className={`inline-flex rounded-full px-5 py-3 font-semibold text-lg
        ${
            report?.recommendation
                ?.toLowerCase()
                .includes("hire")
                ? "bg-green-100 text-green-700"

                : report?.recommendation
                    ?.toLowerCase()
                    .includes("reject")

                ? "bg-red-100 text-red-700"

                : "bg-yellow-100 text-yellow-700"
        }`}
    >

        {report.recommendation ??
            "No Recommendation"}

    </span>

</div>

              </Card>

              {/* ================= SUMMARY ================= */}

              <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8">

                <h2 className="font-display text-2xl">

                  Interview Summary

                </h2>

                <p className="mt-6 leading-8 whitespace-pre-line text-gray-700">

                  {report.summary ??
                    "No interview summary available."}

                </p>

              </Card>

              {/* ================= STRENGTHS & WEAKNESSES ================= */}

              <div className="grid lg:grid-cols-2 gap-6">

                <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8">

                  <h2 className="font-display text-2xl text-green-600">

                    Strengths

                  </h2>

                  <p className="mt-6 whitespace-pre-line leading-8 text-gray-700">

                    {report.strengths ??
                      "No strengths generated."}

                  </p>

                </Card>

                <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8">

                  <h2 className="font-display text-2xl text-red-600">

                    Areas for Improvement

                  </h2>

                  <p className="mt-6 whitespace-pre-line leading-8 text-gray-700">

                    {report.weaknesses ??
                      "No weaknesses generated."}

                  </p>

                </Card>

              </div>

            </>

          )}

        </div>

      )}

      {/* ================= ANSWERS ================= */}

{tab === "Answers" && (

<div className="space-y-6">

{answers.length === 0 ? (

<Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-10">

<div className="flex flex-col items-center">

<FileText
size={60}
className="interview-detail-primary"
/>

<h2 className="font-display text-3xl mt-6">

No Answers Submitted

</h2>

<p className="mt-4 text-gray-500">

The candidate has not answered any interview questions yet.

</p>

</div>

</Card>

) : (

answers.map((answer, index) => (

<Card
key={answer.id ?? index}
className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8"
>

{/* Header */}

<div className="flex justify-between items-center">

<div>

<p className="uppercase tracking-[0.3em] text-xs text-gray-400">

Question {index + 1}

</p>

</div>

<div className="rounded-xl interview-detail-blue-bg px-4 py-2">

<span className="font-semibold interview-detail-primary">

Score : {answer.ai_score ?? "--"} / 10

</span>

</div>

</div>

{/* Question */}

<div className="mt-8">

<p className="uppercase tracking-[0.3em] text-xs text-gray-400">

Question

</p>

<p className="mt-3 text-lg text-gray-800 leading-8">

{answer.question}

</p>

</div>

{/* Candidate Answer */}

<div className="mt-8">

<p className="uppercase tracking-[0.3em] text-xs text-gray-400">

Candidate Answer

</p>

<div className="mt-3 rounded-2xl interview-detail-surface interview-detail-border p-6">

<p className="leading-8 text-gray-700 whitespace-pre-line">

{answer.transcript ??
answer.answer ??
"No answer available."}

</p>

</div>

</div>

{/* Answer Time */}

<div className="mt-8 flex justify-between items-center">

<div>

<p className="uppercase tracking-[0.3em] text-xs text-gray-400">

Answered At

</p>

<p className="mt-2 text-gray-700">

{answer.created_at
? new Date(
answer.created_at
).toLocaleString()
: "--"}

</p>

</div>

<div>

<p className="uppercase tracking-[0.3em] text-xs text-gray-400">

Difficulty

</p>

<p className="mt-2 interview-detail-primary font-semibold">

{answer.difficulty ?? "--"}

</p>

</div>

</div>

</Card>

))

)}

</div>

)}        
   
            {/* ================= VIOLATIONS ================= */}

      {tab === "Violations" && (
        

        <div className="space-y-6">

          {violations.length === 0 && (

            <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-10">

              <div className="flex flex-col items-center">

                <ShieldAlert
                  size={60}
                  className="text-green-600"
                />

                <h2 className="font-display text-3xl mt-6">

                  No Violations Detected

                </h2>

                <p className="mt-4 text-gray-500">

                  The candidate completed the interview without any
                  AI proctoring violations.

                </p>

              </div>

            </Card>

          )}

          {violations.map((violation, index) => (

            <Card
              key={violation.id ?? index}
              className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                    Violation

                  </p>

                  <h2 className="font-display text-2xl mt-2">

                    {(violation.type ??
                      violation.violation_type ??
                      "UNKNOWN")
                      .replaceAll("_", " ")}

                  </h2>

                </div>

                <ViolationBadge
                  type={
                    violation.type ??
                    violation.violation_type
                  }
                  severity={violation.severity}
                />

              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">

                <div>

                  <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                    Detection Time

                  </p>

                  <p className="mt-3 text-gray-700">

                    {violation.detected_at
                      ? new Date(
                          violation.detected_at
                        ).toLocaleString()
                      : "--"}

                  </p>

                </div>

                <div>

                  <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                    Severity

                  </p>

                  <p className="mt-3 text-gray-700">

                    {violation.severity ?? "--"}

                  </p>

                </div>

              </div>

              {/* Description */}

              <div className="mt-8">

                <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                  Description

                </p>

                <p className="mt-3 leading-8 whitespace-pre-line text-gray-700">

                  {violation.description ??

                    "No additional description available."}

                </p>

              </div>

              {/* Recruiter Recommendation */}

              <div className="mt-8 rounded-2xl interview-detail-blue-bg interview-detail-border p-6">

                <h3 className="font-semibold interview-detail-primary">

                  Recruiter Recommendation

                </h3>

                <p className="mt-3 text-gray-700 leading-7">

                  Review this violation alongside the interview
                  recording before making the final hiring decision.
                </p>

              </div>

            </Card>

          ))}

        </div>

      )}
            {/* ================= RECRUITER ACTIONS ================= */}

      <Card className="interview-detail-card rounded-[30px] border-0 shadow-lg p-8">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>

            <h2 className="font-display text-2xl">

              Recruiter Actions

            </h2>

            <p className="text-gray-500 mt-3 leading-7">

              Review the interview, access the candidate's resume,
              download reports and return to the interview list.

            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            {/* Download Report */}

            <button

disabled={!report}

className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition

${

report

? "interview-detail-button text-white"

: "bg-gray-300 text-gray-500 cursor-not-allowed"

}`}

onClick={async () => {

if (!report) return;

try {

const response =
await downloadInterviewReport(interviewId);

downloadBlob(
response,
`Interview_Report_${interviewId}.pdf`
);

}

catch {

toast.error(
"Unable to download report."
);

}

}}

>

              <Download size={18} />

             {report
? "Download Report"
: "Report Not Available"}

            </button>

            {/* Back */}

            <button

              onClick={() =>

                navigate("/recruiter/interviews")

              }

              className="interview-detail-outline-button flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition"

            >

              <ArrowLeft size={18} />

              Back to Interviews

            </button>

          </div>

        </div>

      </Card>

    </div>

  );

}