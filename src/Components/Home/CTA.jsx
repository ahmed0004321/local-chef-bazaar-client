import React from "react";
import { useNavigate } from "react-router";
import { Button, Container } from "../UI";
import { FaUtensils, FaUserShield } from "react-icons/fa";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-background overflow-hidden">
            <Container>
                <div className="relative rounded-[3rem] bg-primary/5 border border-primary/10 p-8 md:p-16 overflow-hidden group">
                    {/* Decorative background elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="text-center lg:text-left max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                                Cook, Share, and <span className="text-primary italic">Savor</span> the Moment.
                            </h2>
                            <p className="text-lg md:text-xl text-foreground/70 mb-10 leading-relaxed">
                                Whether you're looking for an authentic home-cooked meal or ready to turn your kitchen into a business, LocalChef Bazaar is your community.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Button
                                    onClick={() => navigate("/meals")}
                                    variant="primary"
                                    size="lg"
                                    className="rounded-full px-8 shadow-xl shadow-primary/20 group/btn"
                                >
                                    <FaUtensils className="mr-2 group-hover/btn:rotate-12 transition-transform" />
                                    Order Fresh Meals
                                </Button>
                                <Button
                                    onClick={() => navigate("/dashboard/myProfile")}
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8"
                                >
                                    <FaUserShield className="mr-2" />
                                    Become a Chef
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <div className="w-80 h-80 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                                    alt="Chef cooking"
                                    className="w-72 h-72 rounded-full object-cover shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-surface p-4 rounded-2xl shadow-xl border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <FaUtensils />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">1k+ Chefs</p>
                                            <p className="text-[10px] text-foreground/50">Across the country</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CTA;
