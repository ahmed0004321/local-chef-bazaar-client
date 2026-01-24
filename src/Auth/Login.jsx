import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Loading from "../Components/Loading/Loading";

const Login = () => {
  const { signInUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);

        Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${result.user.displayName || "User"}!`,
          icon: "success",
          confirmButtonText: "Continue",
          background: "#1f2937",
          color: "#ffffff",
        });

        navigate(location?.state?.from || "/");
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          title: "Login Failed",
          text: err.message,
          icon: "error",
          confirmButtonText: "Try Again",
          background: "#1f2937",
          color: "#ffffff",
        });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">

      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300 shadow-lg"
          >
            Login
          </button>


          <p className="text-center text-white/80 text-sm mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-white font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
