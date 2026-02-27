import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { Input, Button, Card } from "../Components/UI";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import Footer from "../Components/Footer/Footer";
import { motion } from "framer-motion";

const Register = () => {
  const { createUser, updateUserProfile } = use(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const photoValue = watch("photo");
  const password = watch("password");

  const handleRegister = async (data) => {
    setIsSubmitting(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
      const imgRes = await axios.post(image_API_URL, formData);

      await createUser(data.email, data.password);
      await updateUserProfile(data.name, imgRes.data.data.url);

      Swal.fire({
        title: "Registration Successful!",
        text: `Welcome, ${data.name}!`,
        icon: "success",
        confirmButtonColor: "#f38b0c",
        background: "var(--surface)",
        color: "var(--foreground)",
      });

      navigate("/");
    } catch (err) {
      setErrorMessage(err.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setIsError(false);
    setErrorMessage("");
    reset();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background font-sans p-4 relative overflow-hidden transition-colors duration-300">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-foreground/5 rounded-full blur-[120px] pointer-events-none"></div>

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
          className="w-full max-w-2xl my-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-primary text-xl font-bold tracking-widest uppercase mb-2">LocalChef Bazaar</h2>
            <h1 className="text-4xl font-bold text-foreground mb-3">Create Account</h1>
            <p className="text-foreground/50 text-sm italic">Join our community of local chefs and food lovers.</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-foreground/5 p-8 rounded-2xl shadow-2xl relative z-10">
            {isError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Registration Failed</h2>
                <p className="text-foreground/50 mb-8">{errorMessage || "Something went wrong. Please try again."}</p>
                <Button onClick={handleRetry} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-bold">
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-foreground/70">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Chef John"
                      className={`input input-bordered w-full h-11 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary transition-all ${errors.name ? "border-error" : ""}`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-foreground/70">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="chef@example.com"
                      className={`input input-bordered w-full h-11 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary transition-all ${errors.email ? "border-error" : ""}`}
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-foreground/70">Profile Photo</span>
                  </label>
                  <div className="relative border-2 border-dashed border-foreground/10 rounded-xl p-4 bg-background/30 hover:bg-background/50 hover:border-primary transition-all text-center cursor-pointer overflow-hidden group">
                    <input
                      type="file"
                      {...register("photo", { required: "Photo is required" })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-1 text-foreground/40 group-hover:text-primary transition-colors">
                      <FaCloudUploadAlt className="text-3xl" />
                      <span className="text-sm font-medium">
                        {photoValue && photoValue[0] ? photoValue[0].name : "Upload your chef profile picture"}
                      </span>
                    </div>
                  </div>
                  {errors.photo && <span className="text-error text-xs mt-1">{errors.photo.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-foreground/70">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input input-bordered w-full h-11 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary transition-all ${errors.password ? "border-error" : ""}`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min 6 chars" },
                        validate: { hasUppercase: (v) => /[A-Z]/.test(v) || "Needs uppercase" }
                      })}
                    />
                    {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-foreground/70">Confirm</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input input-bordered w-full h-11 bg-background border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-primary transition-all ${errors.confirmPassword ? "border-error" : ""}`}
                      {...register("confirmPassword", {
                        required: "Required",
                        validate: (v) => v === password || "Match failed"
                      })}
                    />
                    {errors.confirmPassword && <span className="text-error text-xs mt-1">{errors.confirmPassword.message}</span>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 mt-2 transition-all hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Account"}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-foreground/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-3 text-foreground/30 font-medium">Alternative sign up</span></div>
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
                  Already a member?{" "}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Login here
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

export default Register;
