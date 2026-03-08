import React from 'react';
import { Container } from '../UI';
import { FaUserPlus, FaUtensils, FaTruck, FaStar } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <FaUserPlus />,
            title: "Create Account",
            description: "Join as a Customer or Chef. Complete your profile to get started with our local community.",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            id: 2,
            icon: <FaUtensils />,
            title: "Choose & Order",
            description: "Browse thousands of homemade meals. Filter by location, price, and category to find your favorite.",
            color: "bg-primary/10 text-primary"
        },
        {
            id: 3,
            icon: <FaTruck />,
            title: "Fast Delivery",
            description: "Our local delivery partners ensure your meal arrives hot and fresh right at your doorstep.",
            color: "bg-green-500/10 text-green-500"
        },
        {
            id: 4,
            icon: <FaStar />,
            title: "Rate & Enjoy",
            description: "Savor the flavor and share your experience. Your feedback helps our local chefs grow.",
            color: "bg-yellow-500/10 text-yellow-500"
        }
    ];

    return (
        <section className="py-24 bg-background">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-widest uppercase mb-2">Process</h2>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">How it Works</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="relative group p-8 rounded-3xl bg-surface border border-foreground/5 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                            {/* Connector Line (Desktop) */}
                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-foreground/10 z-0"></div>
                            )}

                            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-foreground/60 text-sm leading-relaxed">{step.description}</p>

                            <div className="absolute top-6 right-6 text-4xl font-black opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                0{step.id}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default HowItWorks;
