import {
  ArrowRight,
  PlayCircle,
 
  FileText,
  Brain,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import { Link } from "react-router-dom";
import HeroImage from "../../assets/logo/hero.webp";
import HeroMobile from "../../assets/logo/hero-mobile.webp";

export default function Hero() {
  const handleExploreFeatures = () => {
  document.getElementById("features")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  return (

    <section className="hero-section bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 md:pt-14 lg:pt-16 pb-12 md:pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* ---------------- Left Content ---------------- */}

          <div>

            {/* Badge */}

           <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full border border-[#F4A321]/30 bg-[#FFF8EE]">

              <span className="w-2 h-2 rounded-full bg-[#F4A321]" />

              <span className="text-[#0E4B8E] text-xs sm:text-sm font-semibold">

                AI Powered Recruitment Platform

              </span>

            </div>

            {/* Heading */}

           <h1 className="hero-title font-display mt-6 md:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-gray-900">

              Hire Better

              <br />

              With

              <span className="text-[#0E4B8E]">

                {" "}Artificial Intelligence

              </span>

            </h1>

            {/* Description */}

           <p className="hero-description mt-6 md:mt-8 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-xl">

              Transform recruitment with AI-driven interviews,
              resume analysis, live proctoring, voice assessment,
              and intelligent candidate evaluation.

            </p>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8 md:mt-10">

              <Link
                to="/register"
                className="inline-flex justify-center items-center gap-2 w-full sm:w-auto bg-[#0E4B8E] hover:bg-[#08386d] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-colors duration-300 shadow-sm"
              >

                Get Started

                <ArrowRight size={18} />

              </Link>

              <button
                onClick={handleExploreFeatures}
                className="inline-flex items-center gap-2 border-2 border-[#0E4B8E] text-[#0E4B8E] hover:bg-[#0E4B8E] hover:text-white w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-colors duration-300"
              >

                <PlayCircle size={18} />

                Explore Features

              </button>

            </div>

            {/* Highlights */}

            
          </div>

          {/* ---------------- Right Side ---------------- */}

          <div className="relative flex justify-center mt-12 lg:mt-0 lg:-translate-y-20">

            {/* Hero Card */}

            <div className="hero-card relative rounded-[24px] md:rounded-[30px] border border-gray-200 bg-white shadow-lg overflow-hidden">
              <picture>
  <source
    media="(max-width: 768px)"
    srcSet={HeroMobile}
  />
  <source
    media="(min-width: 769px)"
    srcSet={HeroImage}
  />
  <img
    src={HeroImage}
    alt="AI Interview Platform"
    width="1200"
    height="800"
    loading="eager"
    fetchPriority="high"
    decoding="async"
    className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl h-auto"
  />
</picture>

            </div>

            {/* Floating Card 1 */}

            <div className="hero-floating-card hidden lg:block absolute top-10 -left-8 bg-white rounded-2xl border border-gray-200 shadow-md px-6 py-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#FFF5E6] flex items-center justify-center">

                  <Brain
                    size={24}
                    className="text-[#F4A321]"
                  />

                </div>

                <div>

                  <h3 className="hero-heading font-semibold text-gray-900">

                    AI Interview

                  </h3>

                  <p className="hero-text text-sm text-gray-500">

                    Smart Questions

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card 2 */}

            <div className="hero-floating-card hidden lg:block absolute bottom-12 -right-8 bg-white rounded-2xl border border-gray-200 shadow-md px-6 py-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#EEF7FF] flex items-center justify-center">

                  <ShieldCheck
                    size={24}
                    className="text-[#0E4B8E]"
                  />

                </div>

                <div>

                  <h3 className="hero-heading font-semibold text-gray-900">

                    Live Proctoring

                  </h3>

                  <p className="hero-text text-sm text-gray-500">

                    Active Monitoring

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* -------- Feature Cards Start -------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 md:mt-14">

          {/* Card 1 */}

          <div className="hero-feature-card group h-full  bg-white rounded-3xl border border-gray-200 p-6 md:p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-colors transition-shadow duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] flex items-center justify-center">

              <FileText
                 className="w-7 h-7 md:w-8 md:h-8 text-[#F4A321]"
              />

            </div>

            <h3 className="hero-heading font-display text-xl md:text-2xl text-gray-900 mt-6">

              Resume Parsing

            </h3>

            <p className="hero-text text-gray-600 mt-4 leading-7">

              Automatically extract skills, education,
              projects and experience from uploaded resumes.

            </p>

          </div>

          {/* Card 2 */}

          <div className="hero-feature-card group h-full  bg-white rounded-3xl border border-gray-200 p-6 md:p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-colors transition-shadow duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">

              <Brain
                 className="w-7 h-7 md:w-8 md:h-8 text-[#0E4B8E]"
              />

            </div>

            <h3 className="hero-heading font-display text-xl md:text-2xl text-gray-900 mt-6">

              AI Interview

            </h3>

            <p className="hero-text text-gray-600 mt-4 leading-7">

              Adaptive AI generates technical questions
              based on every candidate's profile.

            </p>

          </div>

          {/* Card 3 */}

          <div className="hero-feature-card group h-full  bg-white rounded-3xl border border-gray-200 p-6 md:p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-colors transition-shadow duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEFDF5] flex items-center justify-center">

              <ShieldCheck
                 className="w-7 h-7 md:w-8 md:h-8 text-[#F4A321]"
              />

            </div>

            <h3 className="hero-heading font-display text-xl md:text-2xl text-gray-900 mt-6">

              Live Proctoring

            </h3>

            <p className="hero-text text-gray-600 mt-4 leading-7">

              Monitor face detection, mobile usage,
              fullscreen mode and tab switching.

            </p>

          </div>

          {/* Card 4 */}

          <div className="hero-feature-card group h-full  bg-white rounded-3xl border border-gray-200 p-6 md:p-7 hover:border-[#0E4B8E] hover:shadow-xl transition-colors transition-shadow duration-300">

            <div className="w-16 h-16 rounded-2xl bg-[#EEF7FF] flex items-center justify-center">

              <BarChart3
                 className="w-7 h-7 md:w-8 md:h-8 text-[#F4A321]"
              />

            </div>

            <h3 className="hero-heading font-display text-xl md:text-2xl text-gray-900 mt-6">

              AI Evaluation

            </h3>

            <p className="hero-text text-gray-600 mt-4 leading-7">

              Generate intelligent reports,
              scores and recruiter recommendations instantly.

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}