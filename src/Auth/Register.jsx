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
      <div
        className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="fixed top-6 left-6 z-10 gap-2 text-white hover:bg-white/10"
        >
          <FaArrowLeft /> Back to Home
        </Button>

        <div className="w-full max-w-2xl glass-green p-8 rounded-2xl relative z-10 border border-white/20 my-10">
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
                Registration Failed
              </h2>
              <p className="text-white/80 mb-8">
                {errorMessage ||
                  "Something went wrong during registration. Please try again."}
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
                  Register to your Account
                </h1>
                <p className="text-white/80">In cook, personal for better</p>
              </div>

              <motion.form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  {/* Name & Email Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-white/90 text-xs">
                          Full Name
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="input input-sm w-full bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <span className="text-red-400 text-[10px] mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-white/90 text-xs">
                          Email Address
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="input input-sm w-full bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
                        {...register("email", {
                          required: "Email is required",
                        })}
                      />
                      {errors.email && (
                        <span className="text-red-400 text-[10px] mt-1">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-white/90 text-xs">
                        Profile Photo
                      </span>
                    </label>
                    <div className="relative border-2 border-dashed border-white/20 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition text-center cursor-pointer">
                      <input
                        type="file"
                        {...register("photo", {
                          required: "Photo is required",
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-1 text-white/60">
                        <FaCloudUploadAlt className="text-2xl" />
                        <span className="text-xs">
                          {photoValue && photoValue[0]
                            ? photoValue[0].name
                            : "Click to upload your image"}
                        </span>
                      </div>
                    </div>
                    {errors.photo && (
                      <span className="text-red-400 text-[10px] mt-1">
                        {errors.photo.message}
                      </span>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-white/90 text-xs">
                          Password
                        </span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className={`input input-sm w-full bg-white text-gray-800 focus:outline-none ${
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
                        <span className="text-red-400 text-[10px] mt-1">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-white/90 text-xs">
                          Confirm Password
                        </span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-sm w-full bg-white text-gray-800 focus:outline-none"
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <span className="text-red-400 text-[10px] mt-1">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#1e3a15] hover:bg-[#152a0f] text-white border-none py-4 mt-2 font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>

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
                    <span className="font-medium text-xs">Facebook</span>
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
                    <span className="font-medium text-xs">Google</span>
                  </button>
                </div>

                <p className="text-center text-xs text-white/80">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-white font-bold hover:underline"
                  >
                    Login here?
                  </Link>
                </p>
              </motion.form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
