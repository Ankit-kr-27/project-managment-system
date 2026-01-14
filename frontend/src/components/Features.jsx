import { motion } from "framer-motion";
import { CheckSquare, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    desc: "Organize tasks with priorities and deadlines.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Work together with real-time updates.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Track performance and project status visually.",
  },
];

export default function Features() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-white text-center mb-14">
          Everything you need to stay productive
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
            >
              <f.icon className="mx-auto mb-5 text-indigo-400" size={32} />
              <h3 className="text-white text-xl mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
