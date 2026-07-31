import {
    Brain,
    FileText,
    ShieldCheck,
    Mic,
    BarChart3,
    Users,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "AI Resume Parsing",
        description:
            "Automatically extracts skills, education, certifications and experience from resumes.",
    },
    {
        icon: Brain,
        title: "AI Interview",
        description:
            "Generates personalized interview questions based on candidate profiles.",
    },
    {
        icon: Mic,
        title: "Voice Assessment",
        description:
            "Evaluates fluency, communication and confidence during interviews.",
    },
    {
        icon: ShieldCheck,
        title: "Live Proctoring",
        description:
            "Detects tab switching, multiple faces, mobile phones and fullscreen violations.",
    },
    {
        icon: BarChart3,
        title: "AI Evaluation",
        description:
            "Provides intelligent scores, recommendations and interview summaries.",
    },
    {
        icon: Users,
        title: "Recruiter Dashboard",
        description:
            "Monitor interviews live, terminate suspicious sessions and download reports.",
    },
];

export default function Features() {

    return (

        <section
            id="features"
            className="py-24 bg-[#F8FAFC]"
        >

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                <div className="text-center">

                    <span className="text-[#F4A321] font-semibold uppercase tracking-widest">

                        FEATURES

                    </span>

                    <h2 className="font-display text-5xl mt-5 text-gray-900">

                        Everything You Need
                        <br />
                        For Modern Recruitment

                    </h2>

                    <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-600">

                        From resume screening to AI interviews,
                        live monitoring and recruiter analytics,
                        everything is managed from a single platform.

                    </p>

                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

                    {features.map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="group bg-white rounded-3xl border border-gray-200 p-8 hover:border-[#0E4B8E] hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                            >

                                <div className="w-16 h-16 rounded-2xl bg-[#FFF8EE] flex items-center justify-center">

                                    <Icon
                                        className="text-[#F4A321]"
                                        size={30}
                                    />

                                </div>

                                <h3 className="font-display text-2xl mt-6 text-gray-900">

                                    {feature.title}

                                </h3>

                                <p className="mt-4 text-gray-600 leading-7">

                                    {feature.description}

                                </p>

                            </div>

                        );

                    })}

                </div>

            </div>

        </section>

    );

}