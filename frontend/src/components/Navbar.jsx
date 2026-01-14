import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 backdrop-blur bg-black/30 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold">ProjectFlow</h1>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
