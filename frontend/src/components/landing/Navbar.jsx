import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight
} from "lucide-react";

import Logo from "../../assets/logo/company_logo.jpg";

export default function Navbar() {

  const [mobileMenu, setMobileMenu] = useState(false);

  return (

    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="h-24 flex items-center justify-between">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-4"
          >

            <img
              src={Logo}
              alt="SHNOOR"
              className="w-14 h-14 object-contain"
            />

            <div>

              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">

                SHNOOR

              </h2>

              <p className="uppercase text-[11px] tracking-[0.35em] text-gray-500">

                AI Interview Platform

              </p>

            </div>

          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-10">

            <a
              href="#features"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition"
            >
              How It Works
            </a>

            <a
              href="#proctoring"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition"
            >
              Proctoring
            </a>

            <a
              href="#contact"
              className="font-medium text-gray-700 hover:text-[#0E4B8E] transition"
            >
              Contact
            </a>

          </nav>

          {/* Desktop Buttons */}

          <div className="hidden lg:flex items-center gap-4">

            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:border-[#0E4B8E] hover:text-[#0E4B8E] transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E4B8E] hover:bg-[#0B3B70] text-white font-semibold transition"
            >
              Get Started

              <ChevronRight size={18}/>
            </Link>

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >

            {mobileMenu ? <X size={28}/> : <Menu size={28}/>}

          </button>

        </div>

      </div>

      {/* Mobile Navigation */}

      {mobileMenu && (

        <div className="lg:hidden border-t border-gray-200 bg-white">

          <div className="px-6 py-6 flex flex-col gap-6">

            <a
              href="#features"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              How It Works
            </a>

            <a
              href="#proctoring"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Proctoring
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Contact
            </a>

            <Link
              to="/login"
              className="border border-gray-300 rounded-xl py-3 text-center font-semibold"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#0E4B8E] rounded-xl py-3 text-center text-white font-semibold"
            >
              Get Started
            </Link>

          </div>

        </div>

      )}

    </header>

  );

}