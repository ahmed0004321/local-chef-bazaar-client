import React from "react";
import GoogleLogin from "./googleLogin";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Welcome Back
        </h2>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300 shadow-lg"
          >
            Login
          </button>
          <GoogleLogin></GoogleLogin>
          {/* Register Link */}
          <p className="text-center text-white/80 text-sm mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-white font-semibold hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;