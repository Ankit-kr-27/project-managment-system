import { useState } from "react";
import { Link } from "react-router-dom";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f1a] overflow-hidden">

      {/* Glowing Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full top-1/4 left-1/3"></div>


      {/* Register Card */}
<div className="relative z-10 glow-border w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">


  <div className="grid grid-cols-1 md:grid-cols-2">

    {/* LEFT: Form Section */}
    <div className="p-10 md:p-14">
      <h1 className="text-3xl font-semibold text-white mb-3">
        Create Account
      </h1>
      <p className="text-gray-300 mb-10">
        Start managing your projects efficiently
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
        >
          Create Account
        </button>
      </form>

<p className="text-gray-400 text-sm text-center mt-8">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-indigo-400 hover:underline"
  >
    Login
  </Link>
</p>

    </div>

    {/* RIGHT: Image Placeholder */}
    <div className="hidden md:flex items-center justify-center bg-white/5 border-l border-white/10">
      <div className="text-gray-400 text-center px-10">
        <div className="w-48 h-48 rounded-2xl border border-dashed border-white/30 flex items-center justify-center">
          <span className="text-sm">
            3D Illustration<br />Placeholder
          </span>
        </div>
      </div>
    </div>

  </div>
</div>

    </div>
  );
}
