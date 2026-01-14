import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#0b0f1a] overflow-hidden">

      {/* SAME background theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full top-1/3 left-1/3"></div>

      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
