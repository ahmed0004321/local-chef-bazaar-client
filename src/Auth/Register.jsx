import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { Input, Button, Card } from "../Components/UI";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";

const Register = () => {
  const { createUser, updateUserProfile } = use(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const photoValue = watch('photo');

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "Error", text: "Passwords do not match!", icon: "error",
        confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
      });
      return;
    }

    setIsSubmitting(true);

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
        background: 'var(--surface)',
        color: 'var(--foreground)'
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#f38b0c",
        background: 'var(--surface)',
        color: 'var(--foreground)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <Button onClick={() => navigate("/")} variant="ghost" className="fixed top-6 left-6 z-10 gap-2">
        <FaArrowLeft /> Back to Home
      </Button>

      <Card className="w-full max-w-lg glass border border-white/20 relative z-10 shadow-2xl my-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2">Create Account</h1>
          <p className="text-foreground/60">Join our community of food lovers</p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
          />

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium text-foreground/80">Profile Photo</span></label>
            <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-center cursor-pointer">
              <input
                type="file"
                {...register("photo", { required: "Photo is required" })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 text-foreground/60">
                <FaCloudUploadAlt className="text-3xl" />
                <span className="text-sm font-medium">
                  {photoValue && photoValue[0] ? photoValue[0].name : "Click to upload or drag and drop"}
                </span>
              </div>
            </div>
            {errors.photo && <span className="text-error text-xs mt-1">{errors.photo.message}</span>}
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium text-foreground/80">Address</span></label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="textarea textarea-bordered h-24 bg-surface text-foreground"
              placeholder="Enter your full address"
            ></textarea>
            {errors.address && <span className="text-error text-xs mt-1">{errors.address.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required", minLength: 6 })}
              error={errors.password}
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              {...register("confirmPassword", { required: "Confirm Password is required" })}
              error={errors.confirmPassword}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full shadow-lg shadow-primary/25 mt-4" disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner"></span> : "Register"}
          </Button>

          <p className="text-center text-sm text-foreground/70 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;
