import React, { use } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import GoogleLogin from "./googleLogin";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Components/Loading/Loading";

const Register = () => {
  const { createUser, updateUserProfile, loading } = use(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#ffffff",
      });
      return;
    }

    const profileImg = data.photo[0];

    createUser(data.email, data.password)
      .then((result) => {
        const formData = new FormData();
        formData.append("image", profileImg);

        const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${
          import.meta.env.VITE_image_host
        }`;
        axios
          .post(image_API_URL, formData)
          .then((res) => {
            const updateProfileData = {
              displayName: data.name,
              photoURL: res.data.data.display_url,
            };

            updateUserProfile(updateProfileData)
              .then(() => {
                Swal.fire({
                  title: "Registration Successful!",
                  text: `Welcome, ${data.name}!`,
                  icon: "success",
                  confirmButtonText: "Continue",
                  background: "#1f2937",
                  color: "#ffffff",
                }).then(() => {
                  navigate(location?.state?.from || "/");
                });
              })
              .catch((err) => {
                console.error(err);
                Swal.fire({
                  title: "Profile Update Failed",
                  text: err.message,
                  icon: "error",
                  confirmButtonText: "OK",
                  background: "#1f2937",
                  color: "#ffffff",
                });
              });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              title: "Image Upload Failed",
              text: err.message,
              icon: "error",
              confirmButtonText: "OK",
              background: "#1f2937",
              color: "#ffffff",
            });
          });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Registration Failed",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#ffffff",
        });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
          {/* ...rest of your form code remains unchanged */}
          {/* Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Profile Image */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Add Photo
            </label>
            <input
              type="file"
              {...register("photo", { required: true })}
              className="w-full border border-gray-300 rounded-md p-2 file-input file:border-none file:bg-gray-100 file:px-4"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">Photo is required!</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Address
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows="3"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              placeholder="Enter your address"
            ></textarea>
            {errors.address && (
              <p className="text-red-300 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300 shadow-lg"
          >
            Register
          </button>

          {/* Google Login */}
          <GoogleLogin />

          {/* Login Link */}
          <p className="text-center text-white/80 text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
