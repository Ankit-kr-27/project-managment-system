import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Layout,
  Shield,
  Users,
  BarChart3,
  Sparkles,
  MousePointer2,
  Layers,
  CheckCircle2,
  Clock,
  MessageSquare,
  Twitter,
  Github,
  Linkedin
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Premium Dark Theme Landing Page for Taskora
export default function LandingPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-primary/30" ref={containerRef}>
      <div className="grain" />

      {/* Dynamic Background Elements */}
      <BackgroundGlow />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[60] py-6 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-premium rounded-2xl px-6 py-3 border border-white/5">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
              T
            </div>
            <span className="text-xl font-bold tracking-tight">Taskora</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <NavLink label="Features" href="#features" />
            <NavLink label="Workflow" href="#workflow" />
            <NavLink label="Security" href="#security" />
            <NavLink label="Metrics" href="#metrics" />
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* SECTION 1: HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
          <HeroContent mouseX={mouseX} mouseY={mouseY} navigate={navigate} />
          <HeroIllustration scrollYProgress={scrollYProgress} />
        </section>

        {/* SECTION 2: FEATURES */}
        <section id="features" className="py-40 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-4">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-primary text-[10px] font-black uppercase tracking-[0.4em]"
              >
                Engineered for Excellence
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Everything you need to <br /><span className="text-muted-foreground">ship faster.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Layers className="w-6 h-6 text-blue-500" />}
                title="Unified Workspace"
                description="Consolidate projects, tasks, and documentation into a single, cohesive command center."
                delay={0}
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-amber-500" />}
                title="Hyper-Speed Search"
                description="Instant access to every detail across your entire organization with milli-second latency."
                delay={0.1}
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6 text-emerald-500" />}
                title="Precision Analytics"
                description="Visualizes progress and team performance with data-driven clarity that teams rely on."
                delay={0.2}
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-purple-500" />}
                title="Bank-Grade Security"
                description="Your data is shielded with enterprise-level encryption and rigorous access controls."
                delay={0.3}
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-pink-500" />}
                title="Team Velocity"
                description="Optimize workflows with real-time collaboration signals and automated hand-offs."
                delay={0.4}
              />
              <FeatureCard
                icon={<MessageSquare className="w-6 h-6 text-sky-500" />}
                title="Smart Context"
                description="Threaded discussions and documentation linked directly to your active project nodes."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: WORKFLOW VISUALIZATION */}
        <section id="workflow" className="py-40 px-6 bg-white/[0.01] border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Optimized Workflow</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">The Kanban <br />Redefined for AI.</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Taskora adapts to your team's unique rhythm. Dynamic task flows and automated progression gates ensure nothing slips through the cracks.
              </p>
              <ul className="space-y-4">
                <WorkflowItem text="Automated task prioritization & sorting" />
                <WorkflowItem text="Real-time multi-user board state" />
                <WorkflowItem text="Customizable status lane logic" />
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative glass-premium p-6 rounded-[32px] border border-white/10 shadow-3xl overflow-hidden aspect-square flex items-center justify-center">
                <KanbanAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRODUCTIVITY PROOF */}
        <section id="metrics" className="py-40 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <StatCounter label="Active Teams" value="12k+" suffix="" />
              <StatCounter label="Tasks Completed" value="4.8" suffix="M" />
              <StatCounter label="Deployment Speed" value="2.4" suffix="x" />
              <StatCounter label="Uptime Guarantee" value="99.9" suffix="%" />
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full opacity-30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto relative z-10 space-y-12"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">Ready to orchestrate <br /><span className="text-muted-foreground">the future?</span></h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button
                onClick={() => navigate("/register")}
                className="group relative px-12 py-6 bg-white text-black text-lg font-black uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all"
              >
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors">Launch Taskora</span>
              </button>
              <button className="flex items-center gap-3 text-lg font-bold hover:text-primary transition-colors">
                Speak to Sales <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-24 px-10 border-t border-white/5 relative z-10 bg-[#060606]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">T</div>
                <span className="text-2xl font-bold tracking-tight">Taskora</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                The next-generation command center for world-class teams. Orchestrate complexity with precision.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon icon={<Twitter size={18} />} href="#" />
                <SocialIcon icon={<Github size={18} />} href="#" />
                <SocialIcon icon={<Linkedin size={18} />} href="#" />
              </div>
            </div>

            <FooterColumn title="Product">
              <FooterLink label="Features" href="#features" />
              <FooterLink label="Workflow" href="#workflow" />
              <FooterLink label="Analytics" href="#metrics" />
              <FooterLink label="Integrations" href="#" isNew />
            </FooterColumn>

            <FooterColumn title="Company">
              <FooterLink label="About Us" href="#" />
              <FooterLink label="Blog" href="#" />
              <FooterLink label="Careers" href="#" />
              <FooterLink label="Press" href="#" />
            </FooterColumn>

            <FooterColumn title="Resources">
              <FooterLink label="Documentation" href="#" />
              <FooterLink label="API Reference" href="#" />
              <FooterLink label="Community" href="#" />
              <FooterLink label="Support" href="#" />
            </FooterColumn>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <span>© 2024 Taskora Technologies</span>
              <span>YC S24 Portfolio</span>
            </div>
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Support Components

function FooterColumn({ title, children }) {
  return (
    <div className="space-y-6">
      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">{title}</h4>
      <ul className="space-y-4">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ label, href, isNew = false }) {
  return (
    <li>
      <a href={href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
        {label}
        {isNew && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">New</span>}
      </a>
    </li>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-xl glass-premium border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all"
    >
      {icon}
    </a>
  );
}

function NavLink({ label, href }) {
  return (
    <a href={href} className="hover:text-white transition-colors relative group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </a>
  );
}

function HeroContent({ mouseX, mouseY, navigate }) {
  const rotateX = useTransform(mouseY, [0, 1000], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1920], [-10, 10]);

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      className="text-center space-y-12 relative z-20 max-w-5xl"
    >

      <motion.h1
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.8] mix-blend-difference"
      >
        WORKFLOW <br />
        <span className="text-primary text-glow">REDEFINED.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium"
      >
        Taskora builds the technical scaffolding for modern teams to orchestrate, execute, and scale with absolute precision.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4"
      >
        <button
          onClick={() => navigate("/register")}
          className="group relative px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl overflow-hidden transition-all shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95"
        >
          Get Started For Free
        </button>
        <button className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors group">
          View Infrastructure <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function HeroIllustration({ scrollYProgress }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <motion.div
      style={{ y, rotate }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-7xl aspect-video opacity-20 pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/10 to-transparent blur-[120px]" />
      <div className="w-full h-full border-[0.5px] border-white/5 rounded-[120px] relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border-[0.2px] border-white/[0.02]" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="glass-premium p-10 rounded-[40px] border border-white/5 hover:border-white/20 transition-colors group cursor-default"
    >
      <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm font-medium">
        {description}
      </p>
    </motion.div>
  );
}

function WorkflowItem({ text }) {
  return (
    <li className="flex items-center gap-4 group">
      <div className="w-2 h-2 rounded-full bg-primary" />
      <span className="text-sm font-bold tracking-tight text-muted-foreground group-hover:text-white transition-colors">{text}</span>
    </li>
  );
}

function StatCounter({ label, value, suffix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-5xl md:text-7xl font-black tracking-tighter">
        {value}<span className="text-primary">{suffix}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function KanbanAnimation() {
  return (
    <div className="w-full h-full relative p-8 flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="w-1/3 h-2 rounded-full bg-primary/20" />
        <div className="w-1/3 h-2 rounded-full bg-white/5" />
        <div className="w-1/3 h-2 rounded-full bg-white/5" />
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1">
        <KanbanColumn count={3} primary />
        <KanbanColumn count={2} delay={1} />
        <KanbanColumn count={4} delay={0.5} />
      </div>
    </div>
  );
}

function KanbanColumn({ count, primary = false, delay = 0 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0.5], y: 0 }}
          transition={{
            repeat: Infinity,
            duration: 4,
            delay: delay + (i * 0.5),
            repeatDelay: 1
          }}
          className={`h-24 rounded-2xl border border-white/10 ${primary ? 'bg-primary/5 border-primary/20' : 'bg-white/5'}`}
        />
      ))}
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 opacity-20" />
    </div>
  );
}
