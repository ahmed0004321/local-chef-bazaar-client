import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Container } from "../UI";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";

const Newsletter = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/subscribers`, data);

            Swal.fire({
                title: "Subscribed!",
                text: "Thank you for joining our community newsletter.",
                icon: "success",
                confirmButtonColor: "var(--primary)",
                background: "var(--surface)",
                color: "var(--foreground)",
            });
            reset();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to subscribe. Please try again.";
            Swal.fire({
                title: "Notice",
                text: message,
                icon: error.response?.status === 400 ? "info" : "error",
                confirmButtonColor: "var(--primary)",
                background: "var(--surface)",
                color: "var(--foreground)",
            });
        }
    };

    return (
        <section className="py-24 bg-surface border-y border-primary/5 relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-12">
                        <FaEnvelope className="text-2xl text-primary -rotate-12" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Hungry for Updates?
                    </h2>
                    <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto">
                        Join our newsletter for exclusive recipes, chef stories, and special discounts delivered straight to your inbox.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 rounded-3xl sm:bg-background/50 backdrop-blur-sm sm:border sm:border-primary/10">
                        <div className="relative flex-1">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className={`w-full h-14 bg-background sm:bg-transparent border-none focus:outline-none px-6 text-foreground placeholder:text-foreground/30 ${errors.email ? "text-error" : ""}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <span className="absolute -bottom-6 left-6 text-[10px] text-error font-medium uppercase tracking-wider">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 px-8 rounded-2xl sm:rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    Subscribe
                                    <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-xs text-foreground/40 italic">
                        No spam, honestly. Just pure foodie joy. Unsubscribe anytime.
                    </p>
                </div>
            </Container>
        </section>
    );
};

export default Newsletter;
