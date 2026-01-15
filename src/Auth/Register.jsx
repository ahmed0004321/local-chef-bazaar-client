import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import GoogleLogin from "./googleLogin";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
// import useAxiosSecure from "../Hooks/AxiosSecure";

const Register = () => {
  const { createUser, updateUserProfile, } = use(AuthContext);
  const navigate = useNavigate();
  // const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleRegister = async (data) => {
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

    setIsSubmitting(true);

    try {
      
      // 2️⃣ Upload image
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host}`;
      const imgRes = await axios.post(image_API_URL, formData);
      
      // 1️⃣ Create user
      await createUser(data.email, data.password);
      await updateUserProfile (data.name, imgRes.data.data.url);
      // 5️⃣ Success message
      await Swal.fire({
        title: "Registration Successful!",
        text: `Welcome, ${data.name}!`,
        icon: "success",
        confirmButtonText: "Continue",
        background: "#1f2937",
        color: "#ffffff",
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Registration Failed",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#ffffff",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
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
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Profile Photo
            </label>

            <input
              type="file"
              {...register("photo", { required: true })}
              className="
      w-full
      file:mr-4
      file:py-2
      file:px-4
      file:rounded-lg
      file:border-0
      file:text-sm
      file:font-semibold
      file:bg-white
      file:text-purple-600
      bg-white/20
      text-white
      rounded-lg
      border
      border-white/30
      cursor-pointer
      hover:bg-white/30
      transition
    "
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Address
            </label>
            <textarea
              {...register("address", { required: true })}
              rows="3"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              placeholder="Enter your address"
            ></textarea>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", { required: true })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              placeholder="Confirm password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>


          {/* Login Link */}
          <p className="text-center text-white/80 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-semibold">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
