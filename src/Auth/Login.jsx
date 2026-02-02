import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Loading from "../Components/Loading/Loading";
import { Input, Button, Card } from "../Components/UI";
import GoogleLogin from "./googleLogin";
import { FaArrowLeft } from "react-icons/fa";

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
        Swal.fire({
          title: "Welcome Back!",
          text: `Logged in as ${result.user.displayName || "User"}`,
          icon: "success",
          confirmButtonColor: "#f38b0c",
          background: 'var(--surface)',
          color: 'var(--foreground)'
        });
        navigate(location?.state?.from || "/");
      })
      .catch((err) => {
        Swal.fire({
          title: "Login Failed",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#f38b0c",
          background: 'var(--surface)',
          color: 'var(--foreground)'
        });
      });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <Button onClick={() => navigate("/")} variant="ghost" className="fixed top-6 left-6 z-10 gap-2">
        <FaArrowLeft /> Back to Home
      </Button>

      <Card className="w-full max-w-md glass border border-white/20 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
          <p className="text-foreground/60">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <Input
            label="Email Address"
            placeholder="name@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            error={errors.password}
          />

          <Button type="submit" variant="primary" className="w-full shadow-lg shadow-primary/25">
            Login
          </Button>

          <div className="divider text-foreground/40 text-sm">Or continue with</div>

          <div className="flex justify-center">
            <GoogleLogin />
          </div>

          <p className="text-center text-sm text-foreground/70 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
