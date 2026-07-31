import {
  ShieldCheck,
  Smartphone,
  Monitor,
  UserRound,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function Proctoring() {
  return (
    <section
      id="proctoring"
      className="py-24 bg-[#F8FAFC]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            <span className="text-[#F4A321] uppercase tracking-[0.25em] font-semibold">

              LIVE PROCTORING

            </span>

            <h2 className="font-display text-5xl mt-4 text-gray-900">

              AI Powered
              <br />

              Live Interview Monitoring

            </h2>

            <p className="mt-8 text-lg leading-8 text-gray-600">

              Ensure every interview is secure with
              intelligent AI monitoring.
              Detect suspicious activities in real-time
              and instantly notify recruiters.

            </p>

            <div className="space-y-6 mt-10">

              <div className="flex items-start gap-4">

                <CheckCircle2
                  className="text-green-600 mt-1"
                  size={22}
                />

                <div>

                  <h3 className="font-semibold text-xl">

                    Face Detection

                  </h3>

                  <p className="text-gray-600">

                    Detects no face and multiple faces.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <CheckCircle2
                  className="text-green-600 mt-1"
                  size={22}
                />

                <div>

                  <h3 className="font-semibold text-xl">

                    Mobile Detection

                  </h3>

                  <p className="text-gray-600">

                    Detects mobile phone usage during interviews.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <CheckCircle2
                  className="text-green-600 mt-1"
                  size={22}
                />

                <div>

                  <h3 className="font-semibold text-xl">

                    Browser Monitoring

                  </h3>

                  <p className="text-gray-600">

                    Detects tab switching,
                    fullscreen exit and browser blur.

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="rounded-3xl border border-gray-200 bg-white shadow-lg p-8">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-display text-2xl">

                    Live Session

                  </h3>

                  <p className="text-gray-500">

                    Candidate Monitoring

                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

                  LIVE

                </div>

              </div>

              <div className="mt-8 rounded-2xl bg-gray-100 h-72 flex items-center justify-center">

                <UserRound
                  size={90}
                  className="text-gray-400"
                />

              </div>

              <div className="grid grid-cols-2 gap-5 mt-8">

                <div className="rounded-xl bg-green-50 p-5">

                  <ShieldCheck
                    className="text-green-600"
                  />

                  <h4 className="mt-3 font-semibold">

                    Face Verified

                  </h4>

                </div>

                <div className="rounded-xl bg-red-50 p-5">

                  <Smartphone
                    className="text-red-600"
                  />

                  <h4 className="mt-3 font-semibold">

                    Mobile Detected

                  </h4>

                </div>

                <div className="rounded-xl bg-yellow-50 p-5">

                  <Monitor
                    className="text-yellow-600"
                  />

                  <h4 className="mt-3 font-semibold">

                    Tab Switch

                  </h4>

                </div>

                <div className="rounded-xl bg-blue-50 p-5">

                  <AlertTriangle
                    className="text-[#0E4B8E]"
                  />

                  <h4 className="mt-3 font-semibold">

                    AI Monitoring

                  </h4>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}