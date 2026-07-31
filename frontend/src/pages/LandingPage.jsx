import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Workflow from "../components/landing/Workflow";
import Proctoring from "../components/landing/Proctoring";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      <Navbar />

      <Hero />

      <Features />

      <Workflow />

      <Proctoring />

      <Contact />

      <Footer />

    </main>
  );
}