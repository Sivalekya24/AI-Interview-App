import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight
} from "lucide-react";

import Logo from "../../assets/logo/company_logo.webp";
import ThemeToggle from "../ui/ThemeToggle";
export default function Navbar() {

  const [mobileMenu, setMobileMenu] = useState(false);

  return (
<header
  className="sticky top-0 z-50 border-b shadow-sm"
  style={{
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="h-16 md:h-20 lg:h-24 flex items-center justify-between">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-4"
          >

            <img
              src={Logo}
              alt="SHNOOR"
              width={56}
              height={56}
              className="h-10 md:h-12 lg:h-14 w-auto object-contain"
            />

            <div>

              <h2
                className="text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight"
               style={{ color: "var(--color-heading)" }}
              >

                SHNOOR

              </h2>

              <p className="uppercase text-[9px] sm:text-[10px] md:text-[12px] lg:text-[13px] tracking-[0.35em]"
              style={{ color: "var(--color-body)" }}>

                AI Interview Platform

              </p>

            </div>

          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-10">

            <a
              href="#features"
              className="font-medium hover:text-[#0E4B8E] transition-colors duration-300"
              style={{ color: "var(--color-heading)" }}
            >
              Features
            </a>

            <a
              href="#workflow"
              className="font-medium hover:text-[#0E4B8E] transition-colors duration-300"
             style={{ color: "var(--color-heading)" }}  
            >
              How It Works
            </a>

            <a
              href="#proctoring"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition-colors duration-300"
              style={{ color: "var(--color-heading)" }}
            >
              Proctoring
            </a>

            <a
              href="#contact"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition-colors duration-300"
              style={{ color: "var(--color-heading)" }}
            >
              Contact
            </a>

          </nav>

          {/* Desktop Buttons */}

          <div className="hidden lg:flex items-center gap-4">

             <ThemeToggle />

            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:border-[#0E4B8E] hover:text-[#0E4B8E] transition-colors duration-300"
              style={{
  borderColor: "var(--color-border)",
  color: "var(--color-heading)",
}}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E4B8E] hover:bg-[#0B3B70] text-white font-semibold transition-colors duration-300"
            >
              Get Started

              <ChevronRight size={18}/>
            </Link>

          </div>

          {/* Mobile Menu Button */}

          {/* Mobile Menu Button */}

            <div className="flex items-center gap-3 lg:hidden">

              <ThemeToggle />

              <button
                aria-label={mobileMenu ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenu(!mobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                {mobileMenu ? <X size={28} /> : <Menu size={28} />}
              </button>

            </div>

        </div>

      </div>

      {/* Mobile Navigation */}

      {mobileMenu && (

        <div className="lg:hidden border-t border-gray-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
  backgroundColor: "var(--color-surface)",
  borderTop: "1px solid var(--color-border)",
}}>

          <div className="px-4 sm:px-6 py-6 flex flex-col gap-6">

            <a
              href="#features"
              onClick={() => setMobileMenu(false)}
              className="font-medium"
              style={{ color: "var(--color-heading)" }}
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={() => setMobileMenu(false)}
              className="font-medium"
              style={{ color: "var(--color-heading)" }}
            >
              How It Works
            </a>

            <a
              href="#proctoring"
              onClick={() => setMobileMenu(false)}
              className="font-medium"
              style={{ color: "var(--color-heading)" }}
            >
              Proctoring
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenu(false)}
              className="font-medium"
              style={{ color: "var(--color-heading)" }}
            >
              Contact
            </a>

            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="w-full border  rounded-xl py-3 text-center font-semibold transition-colors duration-300 hover:border-[#0E4B8E] hover:text-[#0E4B8E]"
              style={{
  borderColor: "var(--color-border)",
  color: "var(--color-heading)",
}}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMobileMenu(false)}
             className="w-full bg-[#0E4B8E] hover:bg-[#0B3B70] rounded-xl py-3 text-center text-white font-semibold transition-colors duration-300"
            >
              Get Started
            </Link>

          </div>

        </div>

      )}

    </header>

  );

}