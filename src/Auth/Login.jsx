import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Loading from "../Components/Loading/Loading";
import { Input, Button, Card } from "../Components/UI";
import { FaArrowLeft } from "react-icons/fa";

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
          background: 'var(--surface)',
          color: 'var(--foreground)'
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
        {isError ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Failed</h2>
            <p className="text-foreground/60 mb-8">{errorMessage || "Invalid email or password. Please try again."}</p>
            <Button onClick={handleRetry} variant="primary" className="w-full shadow-lg shadow-primary/25">
              Try Again
            </Button>
          </div>
        ) : (
          <>
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Must contain at least one uppercase letter and one number"
                  }
                })}
                error={errors.password}
              />

              <Button type="submit" variant="primary" className="w-full shadow-lg shadow-primary/25" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Login"}
              </Button>

              <div className="divider text-foreground/40 text-sm">Or continue with</div>

              <div className="flex justify-center">
              </div>

              <p className="text-center text-sm text-foreground/70 mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;
