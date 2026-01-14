import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-40 pb-28 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage Projects. <br /> Deliver Faster.
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Plan tasks, collaborate with your team, and track progress
            using a modern project management platform.
          </p>

          <div className="flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Get Started Free
            </a>
            <a
              href="/login"
              className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10"
            >
              Login
            </a>
          </div>
        </motion.div>

        {/* Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex justify-center"
        >
          <div className="w-[420px] h-[300px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
            Dashboard Preview
          </div>
        </motion.div>
      </div>
    </section>
  );
}
