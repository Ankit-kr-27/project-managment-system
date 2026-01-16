import { LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <header className="relative h-16 px-8 flex items-center justify-between
      bg-[#0b0f1a]/70 backdrop-blur-xl
      border-b border-white/10">

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0
        bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),
        linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]
        bg-[size:32px_32px] opacity-10" />

      {/* Content */}
      <h2 className="relative z-10 text-lg font-semibold text-white">
        Dashboard
      </h2>

      <div className="relative z-10 flex items-center gap-4">

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full
          bg-indigo-600/80 backdrop-blur
          flex items-center justify-center
          text-white font-medium">
          A
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 px-4 py-2
          rounded-lg bg-white/5 hover:bg-white/10
          text-sm text-gray-300 transition">
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
}
