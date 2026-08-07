import {
  Upload,
  FileSearch,
  Brain,
  ShieldCheck,
  BarChart3,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    description:
      "Candidates register and upload their resumes securely.",
  },
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description:
      "AI extracts skills, experience, education and certifications.",
  },
  {
    icon: Brain,
    title: "AI Interview",
    description:
      "The platform generates adaptive interview questions based on the resume.",
  },
  {
    icon: ShieldCheck,
    title: "Live Proctoring",
    description:
      "Face, mobile, tab switching and fullscreen monitoring run throughout the interview.",
  },
  {
    icon: BarChart3,
    title: "AI Evaluation",
    description:
      "Answers are evaluated and scored automatically with detailed feedback.",
  },
  {
    icon: Users,
    title: "Recruiter Dashboard",
    description:
      "Recruiters monitor interviews live, review reports and make hiring decisions.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="workflow-section py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="text-center">

          <span className="text-[#C97A00] font-semibold uppercase tracking-[0.25em]">
            HOW IT WORKS
          </span>

          <h2 className="workflow-heading font-display text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-4">
            A Simple Recruitment Workflow
          </h2>

          <p className="workflow-text mt-6 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-7 sm:leading-8">
            Our AI platform streamlines every stage of the hiring process,
            enabling recruiters to evaluate candidates efficiently while
            ensuring interview integrity through live proctoring.
          </p>

        </div>

        <div className="relative mt-14 md:mt-20">

          {/* Vertical Line */}

          <div className="workflow-line hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2"></div>

          <div className="space-y-12">

            {steps.map((step, index) => {

              const Icon = step.icon;

              const reverse = index % 2 !== 0;

              return (

                <div
                  key={step.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >

                  {/* Card */}

                  <div
                    className={`workflow-card${
                      reverse
                        ? "lg:text-left"
                        : "lg:text-right"
                    }`}
                  >

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFF7ED]">

                      <Icon
                        className="text-[#F4A321]"
                        size={30}
                      />

                    </div>

                    <h3 className="workflow-heading font-display text-2xl md:text-3xl mt-6 text-gray-900">
                      {step.title}
                    </h3>

                    <p className="workflow-text mt-4 text-gray-600 leading-7 sm:leading-8">
                      {step.description}
                    </p>

                  </div>

                  {/* Timeline Circle */}

                  <div className="hidden lg:flex justify-center">

                    <div className="workflow-circle w-8 h-8 rounded-full bg-[#0E4B8E] border-4 border-white shadow-lg"></div>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
}