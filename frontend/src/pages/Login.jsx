import { useState } from "react";
import { Link } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // backend login later
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f1a] overflow-hidden">

      {/* Background (UNCHANGED) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full top-1/3 left-1/3"></div>

      {/* Login Card */}
      <div className="relative z-10 glow-border w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT: Login Form */}
          <div className="p-10 md:p-14">
            <h1 className="text-3xl font-semibold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-300 mb-10">
              Login to continue managing your projects
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

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

              <div className="flex justify-end text-sm text-indigo-400 hover:underline cursor-pointer">
                Forgot password?
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
              >
                Login
              </button>
            </form>

<p className="text-gray-400 text-sm text-center mt-8">
  Don’t have an account?{" "}
  <Link
    to="/register"
    className="text-indigo-400 hover:underline"
  >
    Register
  </Link>
</p>

          </div>

          {/* RIGHT: Illustration Placeholder */}
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
