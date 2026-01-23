import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Box, Mail, Shield, Globe, Zap } from "lucide-react";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden" ref={containerRef}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center">T</div>
            <span>Taskora</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:text-[#8b5cf6] transition-colors">Sign in</a>
            <a href="/register" className="px-5 py-2.5 bg-[#8b5cf6] text-white text-sm font-bold rounded-full hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8b5cf6]/20">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative">
        <div className="max-w-5xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] text-[10px] font-bold tracking-widest uppercase mb-8"
          >
            <Sparkles className="w-3 h-3" />
            V2.4 IS NOW LIVE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Simplify Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#8b5cf6] to-[#d8b4fe]">Workflow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The premium project management ecosystem for modern teams. Orchestrate tasks, sync with teams, and scale your vision with precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="w-full sm:w-auto px-10 py-5 bg-[#8b5cf6] text-white font-black rounded-2xl hover:bg-[#7c3aed] transition-all shadow-2xl shadow-[#8b5cf6]/40 flex items-center justify-center gap-3 group text-lg">
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-lg">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* 3D Visual Section */}
        <motion.div
          style={{
            rotateX,
            scale,
            perspective: "1200px"
          }}
          className="max-w-5xl mx-auto mt-24 relative p-4 flex items-center justify-center min-h-[500px]"
        >
          <div className="absolute inset-0 bg-[#8b5cf6]/20 blur-[150px] -z-10 rounded-full"></div>

          {/* Animated 3D Floating Element */}
          <motion.div
            style={{ rotateY }}
            className="w-72 h-72 relative transform-gpu"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/30 to-[#d8b4fe]/30 blur-3xl opacity-50 animate-pulse"></div>
            <div className="w-full h-full bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <Box className="w-32 h-32 text-[#8b5cf6] drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]" />

              {/* Decorative floating bits */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-12 right-12 w-3 h-3 rounded-full bg-purple-400 blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-[#8b5cf6] blur-xs"
              />

              <div className="absolute bottom-10 text-[10px] font-black tracking-[0.4em] uppercase text-white/20">Taskora Core Engine</div>
            </div>

            {/* Spinning Rings */}
            <div className="absolute inset-[-100px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite] opacity-50"></div>
            <div className="absolute inset-[-150px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse] opacity-30"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-32 px-4 relative border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="text-[#8b5cf6]" />}
              title="Real-time Sync"
              desc="Orchestrate team tasks with sub-millisecond precision across the globe."
            />
            <FeatureCard
              icon={<Shield className="text-[#8b5cf6]" />}
              title="Eco-Encryption"
              desc="Secure architecture that scales with your team's privacy requirements."
            />
            <FeatureCard
              icon={<Globe className="text-[#8b5cf6]" />}
              title="Remote First"
              desc="Built for distributed teams who demand transparency and high velocity."
            />
            <FeatureCard
              icon={<Mail className="text-[#8b5cf6]" />}
              title="Pulse Alerts"
              desc="Stay ahead with predictive notification clusters and automatedbuild logs."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center text-gray-500 text-xs">
        <p>© 2024 TASKORA TECHNOLOGIES INC. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
