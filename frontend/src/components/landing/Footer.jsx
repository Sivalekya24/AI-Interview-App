import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUp,
  ShieldCheck
} from "lucide-react";

import Logo from "../../assets/logo/company_logo.jpg";

export default function Footer() {

  const scrollToTop = () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  return (

    <footer className="bg-[#0E4B8E] text-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* Company */}

          <div>

            <div className="flex items-center gap-4">

              <img
                src={Logo}
                alt="Logo"
                className="w-14 h-14 rounded-xl bg-white p-1"
              />

              <div>

                <h2 className="font-display text-3xl">

                  SHNOOR

                </h2>

                <p className="text-sm text-blue-100">

                  AI Interview Platform

                </p>

              </div>

            </div>

            <p className="mt-6 leading-8 text-blue-100">

              A next-generation AI recruitment platform
              that automates resume screening,
              AI interviews, live proctoring and
              recruiter analytics.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="font-display text-2xl mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              <a href="#features" className="block hover:text-[#F4A321] transition">

                Features

              </a>

              <a href="#workflow" className="block hover:text-[#F4A321] transition">

                How It Works

              </a>

              <a href="#proctoring" className="block hover:text-[#F4A321] transition">

                Proctoring

              </a>

              <a href="#contact" className="block hover:text-[#F4A321] transition">

                Contact

              </a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="font-display text-2xl mb-6">

              Contact

            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <Mail />

                admin@shnoor.com

              </div>

              <div className="flex gap-3">

                <Phone />

                +91 9876543210

              </div>

              <div className="flex gap-3">

                <MapPin />

                SHNOOR International LLC

              </div>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="font-display text-2xl mb-6">

              Connect

            </h3>

            <div className="flex gap-5">

              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-[#F4A321] flex items-center justify-center transition"
              >

                <Globe />

              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-[#F4A321] flex items-center justify-center transition"
              >

              </a>

            </div>

            <button
              onClick={scrollToTop}
              className="mt-10 flex items-center gap-3 bg-[#F4A321] hover:bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl transition"
            >

              <ArrowUp size={18}/>

              Back to Top

            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/20 mt-14 pt-8 flex flex-col lg:flex-row justify-between items-center">

          <p className="text-blue-100">

            © {new Date().getFullYear()} SHNOOR International LLC.
            All Rights Reserved.

          </p>

          <p className="flex gap-3">

            <ShieldCheck/> Secure Environment
          </p>

        </div>

      </div>

    </footer>

  );

}