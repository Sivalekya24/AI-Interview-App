import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUp,
  ShieldCheck,
 
} from "lucide-react";

import Logo from "../../assets/logo/company_logo.webp";

export default function Footer() {

  const scrollToTop = () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  return (

    <footer className="footer-section bg-[#0E4B8E] text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company */}

          <div>

            <div className="flex items-center gap-4">

              <img
                src={Logo}
                alt="Logo"
                width={40}
height={40}
                className="h-10 md:h-12 lg:h-14 w-auto object-contain"
              />

              <div>

                <h3 className="footer-heading font-display text-2xl md:text-3xl">

                  SHNOOR

                </h3>

                <p className="text-sm text-blue-100">

                  AI Interview Platform

                </p>

              </div>

            </div>

            <p className="footer-text mt-6 leading-8 text-blue-100">

              A next-generation AI recruitment platform
              that automates resume screening,
              AI interviews, live proctoring and
              recruiter analytics.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="footer-heading font-display text-2xl mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              <a href="#features" className="footer-link block hover:text-[#F4A321] transition-colors duration-300">

                Features

              </a>

              <a href="#workflow" className="footer-link block hover:text-[#F4A321] transition-colors duration-300">

                How It Works

              </a>

              <a href="#proctoring" className="footer-link block hover:text-[#F4A321] transition-colors duration-300">

                Proctoring

              </a>

              <a href="#contact" className="footer-link block hover:text-[#F4A321] transition-colors duration-300">

                Contact

              </a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="footer-heading font-display text-2xl mb-6">

              Contact

            </h3>

            <div className="space-y-5">

              <div className="footer-text flex gap-3">

                <Mail />

                admin@shnoor.com

              </div>

              <div className="footer-text flex gap-3">

                <Phone />

                +91 9876543210

              </div>

              <div className="footer-text flex gap-3">

                <MapPin />

                SHNOOR International LLC

              </div>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="footer-heading font-display text-2xl mb-6">

              Connect

            </h3>

            <div className="flex gap-5">

              <a
                href="https://www.shnoor.com/"
                aria-label="Website"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-[#F4A321] flex items-center justify-center transition-colors duration-300"
              >

                <Globe />

              </a>

              <a
                href="https://www.linkedin.com/company/shnoor-international/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-[#F4A321] flex items-center justify-center transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M4.98 3.5C4.98 4.6 4.1 5.5 3 5.5S1.02 4.6 1.02 3.5 1.9 1.5 3 1.5s1.98.9 1.98 2zM1.5 8h3V22h-3V8zm7.5 0h2.87v1.91h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.58 1.99 3.58 4.58V22h-3v-6.17c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V22h-3V8z"/>
                </svg>
              </a>

            </div>

            <button
              onClick={scrollToTop}
              className="mt-10 flex items-center gap-3 bg-[#F4A321] hover:bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
            >

              <ArrowUp size={18}/>

              Back to Top

            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/20 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="footer-text text-blue-100">

            © {new Date().getFullYear()} SHNOOR International LLC.
            All Rights Reserved.

          </p>

          <p className="footer-text flex gap-3">

            <ShieldCheck/> Secure Environment
          </p>

        </div>

      </div>

    </footer>

  );

}