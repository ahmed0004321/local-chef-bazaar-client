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
      <div className="min-h-screen flex items-center justify-center bg-background font-sans p-4 relative overflow-hidden transition-colors duration-300">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-foreground/5 rounded-full blur-[120px] pointer-events-none"></div>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="absolute top-6 left-6 z-10 gap-2 text-foreground/50 hover:text-primary transition-colors hover:bg-foreground/5"
        >
          <FaArrowLeft /> Back to Home
        </Button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-primary text-xl font-bold tracking-widest uppercase mb-2">LocalChef Bazaar</h2>
            <h1 className="text-4xl font-bold text-foreground mb-3">Sign In</h1>
            <p className="text-foreground/50 text-sm italic">"Good food is the foundation of genuine happiness."</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-foreground/5 p-8 rounded-2xl shadow-2xl relative z-10">
            {isError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Login Failed</h2>
                <p className="text-sm text-foreground/50 mb-6">{errorMessage || "Invalid details. Please try again."}</p>
                <Button onClick={handleRetry} className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12">
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-foreground/70">Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="chef@example.com"
                      className={`input input-bordered w-full h-12 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.email ? "border-error" : ""}`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" },
                      })}
                    />
                    {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                  </div>

                  <div className="form-control">
                    <div className="flex justify-between items-center mb-1">
                      <label className="label p-0 py-1">
                        <span className="label-text font-medium text-foreground/70">Password</span>
                      </label>
                      <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input input-bordered w-full h-12 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.password ? "border-error" : ""}`}
                      {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded border-foreground/20 bg-background" />
                  <span className="text-xs text-foreground/50">Keep me logged in</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Sign In"}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-foreground/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-3 text-foreground/30 font-medium">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-foreground/10 rounded-lg hover:bg-foreground/5 transition-colors">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                    <span className="text-sm font-medium text-foreground/70">Google</span>
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-foreground/10 rounded-lg hover:bg-foreground/5 transition-colors">
                    <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="F" />
                    <span className="text-sm font-medium text-foreground/70">Facebook</span>
                  </button>
                </div>

                <p className="text-center text-sm text-foreground/50">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-bold hover:underline">
                    Create one now
                  </Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
