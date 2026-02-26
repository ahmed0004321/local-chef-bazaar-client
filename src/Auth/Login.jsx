import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Loading from "../Components/Loading/Loading";
import { Input, Button, Card } from "../Components/UI";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../Components/Footer/Footer";
import { motion } from "framer-motion";

const Login = () => {
  const { signInUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    setIsSubmitting(true);
    setIsError(false);
    signInUser(data.email, data.password)
      .then((result) => {
        Swal.fire({
          title: "Welcome Back!",
          text: `Logged in as ${result.user.displayName || "User"}`,
          icon: "success",
          confirmButtonColor: "#f38b0c",
          background: "var(--surface)",
          color: "var(--foreground)",
        });
        navigate(location?.state?.from || "/");
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setIsError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleRetry = () => {
    setIsError(false);
    setErrorMessage("");
    reset();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      >
        {/* Overlay for better readability if needed */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="fixed top-6 left-6 z-10 gap-2 text-white hover:bg-white/10"
        >
          <FaArrowLeft /> Back to Home
        </Button>

        <div className="w-full max-w-lg glass-green p-8 rounded-2xl relative z-10 border border-white/20">
          {isError ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-error/20 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Login Failed
              </h2>
              <p className="text-white/80 mb-8">
                {errorMessage || "Invalid email or password. Please try again."}
              </p>
              <Button
                onClick={handleRetry}
                className="w-full bg-[#1e3a15] hover:bg-[#152a0f] text-white border-none py-6"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Login to your Account
                </h1>
                <p className="text-white/80">In cook, personal for better</p>
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  <motion.div
                    className="form-control"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 100 },
                      },
                    }}
                  >
                    <label className="label py-1">
                      <span className="label-text text-white/90 text-sm">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`input w-full bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none ${errors.email ? "border-red-500" : "border-transparent"}`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-400 text-xs mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </motion.div>

                  <motion.div
                    className="form-control"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 100 },
                      },
                    }}
                  >
                    <label className="label py-1">
                      <span className="label-text text-white/90 text-sm">
                        Password
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input w-full bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none ${
                        errors.password
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        validate: {
                          hasUppercase: (value) =>
                            /[A-Z]/.test(value) ||
                            "Password must contain at least one uppercase letter",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="text-red-400 text-xs mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </motion.div>
                </motion.div>

                <div className="flex items-center justify-between text-xs text-white/90">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs border-white/40"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1e3a15] hover:bg-[#152a0f] text-white border-none py-6 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center text-xs text-white/60">
                  Or Sign in with
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded-lg hover:bg-white/90 transition shadow-sm"
                  >
                    <img
                      src="https://www.facebook.com/favicon.ico"
                      className="w-4 h-4"
                      alt="FB"
                    />
                    <span className="font-medium">Facebook</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded-lg hover:bg-white/90 transition shadow-sm"
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      className="w-4 h-4"
                      alt="Google"
                    />
                    <span className="font-medium">Google</span>
                  </button>
                </div>

                <p className="text-center text-sm text-white/80 mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/register"
                    className="text-white font-bold hover:underline"
                  >
                    Register here?
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
