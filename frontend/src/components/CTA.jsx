import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-28 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-xl mx-auto px-6"
      >
        <h2 className="text-4xl font-bold text-white mb-6">
          Start managing projects smarter
        </h2>
        <p className="text-gray-400 mb-8">
          Create your free account and boost your productivity today.
        </p>
        <a
          href="/register"
          className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
        >
          Create Free Account
        </a>
      </motion.div>
    </section>
  );
}
