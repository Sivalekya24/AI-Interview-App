import { lazy, Suspense } from "react";

import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import SectionLoader from "../components/ui/SectionLoader";
const Features = lazy(() => import("../components/landing/Features"));
const Workflow = lazy(() => import("../components/landing/Workflow"));
const Proctoring = lazy(() => import("../components/landing/Proctoring"));
const Contact = lazy(() => import("../components/landing/Contact"));
const Footer = lazy(() => import("../components/landing/Footer"));

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <Hero />

      <Suspense fallback={<SectionLoader />}>
        <Features />
        <Workflow />
        <Proctoring />
        <Contact />
        <Footer />
      </Suspense>
    </main>
  );
}