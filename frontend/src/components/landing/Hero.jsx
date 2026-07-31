import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  FileText,
  Brain,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import { Link } from "react-router-dom";
import HeroImage from "../../assets/logo/hero.png";

export default function Hero() {
  const handleExploreFeatures = () => {
  document.getElementById("features")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  return (

    <section className="bg-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-14">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ---------------- Left Content ---------------- */}

          <div>

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#F4A321]/30 bg-[#FFF8EE]">

              <span className="w-2 h-2 rounded-full bg-[#F4A321]" />

              <span className="text-[#0E4B8E] text-sm font-semibold">

                AI Powered Recruitment Platform

              </span>

            </div>

            {/* Heading */}

            <h1 className="font-display mt-8 text-5xl lg:text-7xl leading-tight text-gray-900">

              Hire Better

              <br />

              With

              <span className="text-[#0E4B8E]">

                {" "}Artificial Intelligence

              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 text-lg leading-9 text-gray-600 max-w-xl">

              Transform recruitment with AI-driven interviews,
              resume analysis, live proctoring, voice assessment,
              and intelligent candidate evaluation.

            </p>

            {/* Buttons */}

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#0E4B8E] hover:bg-[#08386d] text-white px-8 py-4 rounded-xl font-semibold transition duration-300 shadow-sm"
              >

                Get Started

                <ArrowRight size={18} />

              </Link>

              <button
                onClick={handleExploreFeatures}
                className="inline-flex items-center gap-2 border-2 border-[#0E4B8E] text-[#0E4B8E] hover:bg-[#0E4B8E] hover:text-white px-8 py-4 rounded-xl font-semibold transition duration-300"
              >

                <PlayCircle size={18} />

                Explore Features

              </button>

            </div>

            {/* Highlights */}

            
          </div>

          {/* ---------------- Right Side ---------------- */}

          <div className="relative flex justify-center -translate-y-24">

            {/* Hero Card */}

            <div className="relative rounded-[30px] border border-gray-200 bg-white shadow-lg overflow-hidden">

              <img
                src={HeroImage}
                alt="AI Interview Platform"
                className="w-full max-w-2xl"
              />

            </div>

            {/* Floating Card 1 */}

            <div className="absolute top-10 -left-8 bg-white rounded-2xl border border-gray-200 shadow-md px-6 py-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#FFF5E6] flex items-center justify-center">

                  <Brain
                    size={24}
                    className="text-[#F4A321]"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">

                    AI Interview

                  </h3>

                  <p className="text-sm text-gray-500">

                    Smart Questions

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card 2 */}

            <div className="absolute bottom-12 -right-8 bg-white rounded-2xl border border-gray-200 shadow-md px-6 py-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#EEF7FF] flex items-center justify-center">

                  <ShieldCheck
                    size={24}
                    className="text-[#0E4B8E]"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">

                    Live Proctoring

                  </h3>

                  <p className="text-sm text-gray-500">

                    Active Monitoring

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* -------- Feature Cards Start -------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

          {/* Card 1 */}

          <div className="group bg-white rounded-3xl border border-gray-200 p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] flex items-center justify-center">

              <FileText
                size={30}
                className="text-[#F4A321]"
              />

            </div>

            <h3 className="font-display text-2xl text-gray-900 mt-6">

              Resume Parsing

            </h3>

            <p className="text-gray-600 mt-4 leading-7">

              Automatically extract skills, education,
              projects and experience from uploaded resumes.

            </p>

          </div>

          {/* Card 2 */}

          <div className="group bg-white rounded-3xl border border-gray-200 p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">

              <Brain
                size={30}
                className="text-[#0E4B8E]"
              />

            </div>

            <h3 className="font-display text-2xl text-gray-900 mt-6">

              AI Interview

            </h3>

            <p className="text-gray-600 mt-4 leading-7">

              Adaptive AI generates technical questions
              based on every candidate's profile.

            </p>

          </div>

          {/* Card 3 */}

          <div className="group bg-white rounded-3xl border border-gray-200 p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEFDF5] flex items-center justify-center">

              <ShieldCheck
                size={30}
                className="text-green-600"
              />

            </div>

            <h3 className="font-display text-2xl text-gray-900 mt-6">

              Live Proctoring

            </h3>

            <p className="text-gray-600 mt-4 leading-7">

              Monitor face detection, mobile usage,
              fullscreen mode and tab switching.

            </p>

          </div>

          {/* Card 4 */}

          <div className="group bg-white rounded-3xl border border-gray-200 p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">

              <BarChart3
                size={30}
                className="text-[#0E4B8E]"
              />

            </div>

            <h3 className="font-display text-2xl text-gray-900 mt-6">

              AI Evaluation

            </h3>

            <p className="text-gray-600 mt-4 leading-7">

              Generate intelligent reports,
              scores and recruiter recommendations instantly.

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}