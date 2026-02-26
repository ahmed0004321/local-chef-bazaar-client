import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaHeart, FaLeaf, FaClock, FaHandHoldingHeart } from 'react-icons/fa';
import { GiChefToque } from 'react-icons/gi';
import { Container, Button, Card } from '../UI';
import aboutHero from '../../assets/images/about_hero.png';
import ourStoryImg from '../../assets/images/our_story.png';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const stats = [
        { label: "Active Home Chefs", value: "500+", icon: <GiChefToque className="text-primary text-2xl" /> },
        { label: "Meals Delivered", value: "10k+", icon: <FaUtensils className="text-primary text-2xl" /> },
        { label: "Happy Customers", value: "5k+", icon: <FaHeart className="text-primary text-2xl" /> },
        { label: "Cities Reached", value: "12+", icon: <FaLeaf className="text-primary text-2xl" /> }
    ];

    const features = [
        {
            title: "Homemade Quality",
            description: "Every meal is prepared with love and care in local home kitchens, ensuring authentic taste and quality.",
            icon: <FaHandHoldingHeart className="text-3xl text-primary" />
        },
        {
            title: "Fresh Ingredients",
            description: "Our chefs use only the freshest, locally-sourced ingredients to prepare your favourite dishes.",
            icon: <FaLeaf className="text-3xl text-primary" />
        },
        {
            title: "Timely Delivery",
            description: "Enjoy hot and fresh homemade meals delivered right to your doorstep exactly when you need them.",
            icon: <FaClock className="text-3xl text-primary" />
        }
    ];

    return (
        <div className="pt-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center bg-surface">
                <Container className="grid lg:grid-cols-2 gap-12 items-center py-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-6 inline-block">
                            About LocalChefBazaar
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            Bringing <span className="text-primary italic">Home</span> To Your <span className="text-primary italic">Table</span>
                        </h1>
                        <p className="text-lg text-foreground/80 mb-8 max-w-lg leading-relaxed">
                            We bridge the gap between talented local home chefs and food enthusiasts who crave authentic, healthy, and soulful homemade meals.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button to="/meals" variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/20">
                                Explore Meals
                            </Button>
                            <Button to="/register" variant="outline" size="lg" className="rounded-full">
                                Join as Chef
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                            <img
                                src={aboutHero}
                                alt="Diverse homemade meals"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-6 -right-6 w-full h-full bg-primary/10 rounded-3xl -z-10 blur-2xl"></div>
                    </motion.div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-surface-variant/30 border-y border-foreground/5 mb-20">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">{stat.icon}</div>
                                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                                <p className="text-sm text-foreground/60 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-background relative overflow-hidden">
                <Container className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn} className="order-2 lg:order-1 relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl">
                            <img src={ourStoryImg} alt="Local home chef" className="w-full h-auto" />
                        </div>
                        <div className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl hidden md:block border border-white/20">
                            <p className="text-primary font-bold italic text-lg leading-tight">
                                "Bringing people together<br />through the love of food."
                            </p>
                        </div>
                    </motion.div>
                    <motion.div {...fadeIn} className="order-1 lg:order-2">
                        <h2 className="text-4xl font-bold mb-6">Our <span className="text-primary">Story</span></h2>
                        <div className="space-y-4 text-foreground/70 leading-relaxed">
                            <p>
                                LocalChefBazaar started with a simple observation: there are thousands of incredibly talented home chefs whose culinary masterpieces never leave their kitchens, and millions of people who miss the taste of a truly homemade meal.
                            </p>
                            <p>
                                Founded in 2024, our platform was built to empower local culinary artists by providing them with a space to showcase their skills and earn from their passion. We believe that food is more than just sustenance; it's a bridge between cultures, a carrier of traditions, and a medium for love.
                            </p>
                            <p>
                                Today, we are proud to support a growing community of chefs and foodies, ensuring that every bite you take supports a local household and celebrates authentic culinary heritage.
                            </p>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Why Choose Us / Features */}
            <section className="py-24 bg-surface relative">
                <Container>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-primary">Us?</span></h2>
                        <p className="text-foreground/60">We prioritize quality, trust, and the unique connection that only a homemade meal can provide.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                            >
                                <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 border-none bg-background/50 backdrop-blur-sm group">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-foreground/70">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 mb-20">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-gradient-to-br from-primary to-orange-600 p-12 text-center text-white relative overflow-hidden"
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to taste the magic of home?</h2>
                            <p className="text-lg opacity-90 mb-10">
                                Join thousands of food lovers who have already discovered their new favourite local chefs. Authentic taste is just a few clicks away.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Button to="/meals" variant="secondary" size="lg" className="rounded-full px-10 bg-white text-primary hover:bg-neutral-100 border-none font-bold">
                                    Order Now
                                </Button>
                                <Button to="/register" variant="outline" size="lg" className="rounded-full px-10 border-white text-white hover:bg-white hover:text-primary font-bold">
                                    Join Our Community
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
};

export default About;