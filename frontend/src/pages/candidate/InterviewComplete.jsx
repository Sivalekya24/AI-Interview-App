import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Card, Button } from "../../components/ui/primitives";
import PageTransition from "../../components/ui/PageTransition";

export default function InterviewComplete() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#EEF3FA] px-8 py-8">

        <div className="interview-complete-page max-w-6xl mx-auto space-y-8">

          {/* ================= HERO ================= */}

          <div className="interview-complete-hero rounded-[32px] shadow-xl px-10 py-10 text-white relative overflow-hidden">

            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>

            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">

                <CheckCircle2 size={48} />

              </div>

              <h1 className="font-display text-5xl mt-8">

                Interview Submitted Successfully

              </h1>

              <p className="mt-6 text-lg text-blue-100 max-w-3xl leading-8">

                Thank you for completing your AI interview.
                Your interview responses have been securely submitted and are
                now awaiting recruiter review.

              </p>

            </motion.div>

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="grid md:grid-cols-3 gap-6">

            <Card className="interview-complete-card rounded-[28px] border-0 shadow-lg p-8 text-center">
              <ClipboardCheck
                size={34}
                className="mx-auto interview-complete-primary"
              />

              <p className="interview-complete-text mt-5">

                Interview Status

              </p>

              <h2 className="font-display text-3xl mt-2">

                Completed

              </h2>

            </Card>

            <Card className="rounded-[28px] border-0 shadow-lg p-8 text-center">

              <Clock3
                size={34}
                className="mx-auto interview-complete-primary"
              />

              <p className="interview-complete-text mt-5">

                Questions Answered

              </p>

              <h2 className="font-display text-3xl mt-2">

                20 / 20

              </h2>

            </Card>

            <Card className="rounded-[28px] border-0 shadow-lg p-8 text-center">

              <Briefcase
                size={34}
                className="mx-auto interview-complete-primary"
              />

              <p className="interview-complete-text mt-5">

                Interview Type

              </p>

              <h2 className="font-display text-3xl mt-2">

                AI Interview

              </h2>

            </Card>

          </div>

          {/* ================= NEXT STEPS ================= */}

          <Card className="interview-complete-card rounded-[28px] border-0 shadow-lg p-8">
            <h2 className="font-display text-3xl">

              What Happens Next?

            </h2>

            <div className="mt-8 space-y-6">

              {[
                {
                  title: "Resume Uploaded",
                  status: "Completed",
                },
                {
                  title: "Interview Completed",
                  status: "Completed",
                },
                {
                  title: "AI Processing Completed",
                  status: "Completed",
                },
                {
                  title: "Recruiter Review",
                  status: "Pending",
                },
                {
                  title: "Final Hiring Decision",
                  status: "Pending",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-5"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.status === "Completed"
                          ? "bg-green-100"
                          : "interview-complete-blue-bg"
                      }`}
                    >

                      <CheckCircle2
                        size={22}
                        className={
                          item.status === "Completed"
                            ? "text-green-600"
                            : "interview-complete-primary"
                        }
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-lg">

                        {item.title}

                      </h3>

                    </div>

                  </div>

                  <span
                    className={`font-medium ${
                      item.status === "Completed"
                        ? "text-green-600"
                        : "interview-complete-primary"
                    }`}
                  >

                    {item.status}

                  </span>

                </div>

              ))}

            </div>

          </Card>

          {/* ================= PRIVACY ================= */}

          <Card className="interview-complete-card rounded-[28px] border-0 shadow-lg p-8">

            <div className="flex items-start gap-5">

              <div className="w-16 h-16 rounded-2xl bg-interview-complete-blue-bg flex items-center justify-center">

                <ShieldCheck
                  size={30}
                  className="text-interview-complete-primary"
                />

              </div>

              <div>

                <h2 className="font-display text-3xl">

                  Privacy & Confidentiality

                </h2>

                <p className="mt-5 interview-complete-text leading-8">

                  Your resume, interview recording, transcript,
                  AI analysis and proctoring information have been
                  securely stored.

                </p>

                <p className="mt-4 interview-complete-text leading-8">

                  Interview scores, recruiter comments and AI evaluation
                  are available only to authorised recruiters and are
                  not displayed to candidates.

                </p>

              </div>

            </div>

          </Card>

          {/* ================= ACTION ================= */}

          <div className="flex justify-center">

            <Button
              onClick={() => navigate("/candidate/dashboard")}
             className="interview-complete-button h-14 px-10 rounded-2xl text-lg flex items-center gap-3"
            >

              Back to Dashboard

              <ArrowRight size={20} />

            </Button>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}