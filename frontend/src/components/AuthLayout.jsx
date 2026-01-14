export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-16 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">ProjectFlow</h1>
          <p className="text-lg text-indigo-100 max-w-md">
            Plan, track, and manage your projects with clarity and confidence.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-500 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>

    </div>
  );
}
