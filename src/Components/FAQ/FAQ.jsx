import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaSearch, FaChevronDown, FaEnvelope, FaExclamationTriangle, FaQuestionCircle, FaUser, FaUtensils } from 'react-icons/fa';
import { Container, Button, Card, Input } from '../UI';
import axios from 'axios';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const faqData = [
        {
            category: "General",
            questions: [
                { q: "What is LocalChefBazaar?", a: "LocalChefBazaar is a platform connecting talented local home chefs with food lovers who want authentic, healthy homemade meals." },
                { q: "How do I place an order?", a: "Simply browse the 'Meals' section, choose your favorites, add them to your cart, and proceed to checkout." }
            ]
        },
        {
            category: "Food Quality",
            questions: [
                { q: "How do you ensure food safety?", a: "All our chefs are verified and must adhere to strict hygiene and food safety standards. We conduct regular quality checks." },
                { q: "What if the food is not as expected?", a: "We value your satisfaction. If you're unhappy with a meal, please use the complaint form below or contact our support." }
            ]
        },
        {
            category: "Delivery",
            questions: [
                { q: "What are the delivery charges?", a: "Delivery charges vary based on your distance from the chef's location. The final amount will be shown at checkout." },
                { q: "Can I schedule a delivery?", a: "Yes, you can select your preferred delivery time slot during the checkout process." }
            ]
        }
    ];

    const filteredFaqs = faqData.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    const onSubmit = async (data) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/complaints`, data);
            Swal.fire({
                title: 'Submitted!',
                text: 'Your question/complaint has been received. We will get back to you shortly.',
                icon: 'success',
                confirmButtonColor: '#f38b0c',
                background: 'var(--surface)',
                color: 'var(--foreground)'
            });
            reset();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to submit complaint. Please try again.',
                icon: 'error',
                confirmButtonColor: '#f38b0c',
                background: 'var(--surface)',
                color: 'var(--foreground)'
            });
        }
    };

    return (
        <div className="pt-24 min-h-screen pb-20 overflow-hidden relative">
            {/* Hero Section */}
            <section className="bg-surface py-16 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

                <Container className="text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we <span className="text-primary italic">help</span> you?</h1>
                        <p className="text-foreground/60 max-w-2xl mx-auto mb-10 text-lg">
                            Find quick answers to common questions or reach out to our team directly.
                        </p>

                        <div className="max-w-xl mx-auto relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" />
                            <input
                                type="text"
                                placeholder="Search for questions..."
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </Container>
            </section>

            <Container>
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* FAQ Accordion Side */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <FaQuestionCircle className="text-primary" /> Common Questions
                        </h2>

                        <div className="space-y-6">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((category, catIdx) => (
                                    <div key={catIdx} className="mb-10">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70 mb-4 px-2">{category.category}</h3>
                                        <div className="space-y-3">
                                            {category.questions.map((faq, faqIdx) => {
                                                const globalIdx = `${catIdx}-${faqIdx}`;
                                                return (
                                                    <Card
                                                        key={faqIdx}
                                                        className={`transition-all duration-300 border border-foreground/5 cursor-pointer ${activeIndex === globalIdx ? 'bg-primary/5 border-primary/20' : ''}`}
                                                        compact
                                                        onClick={() => setActiveIndex(activeIndex === globalIdx ? null : globalIdx)}
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <span className="font-semibold text-lg">{faq.q}</span>
                                                            <motion.div
                                                                animate={{ rotate: activeIndex === globalIdx ? 180 : 0 }}
                                                                className="text-primary flex-shrink-0"
                                                            >
                                                                <FaChevronDown />
                                                            </motion.div>
                                                        </div>
                                                        <AnimatePresence>
                                                            {activeIndex === globalIdx && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <p className="pt-4 text-foreground/70 leading-relaxed border-t border-foreground/5 mt-4">
                                                                        {faq.a}
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-surface/50 rounded-3xl border border-dashed border-foreground/10">
                                    <p className="text-foreground/50 italic">No questions found matching your search term.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Complaint/Contact Form Side */}
                    <div>
                        <div className="sticky top-28">
                            <Card className="p-8 shadow-xl border-t-4 border-primary">
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                    <FaExclamationTriangle className="text-primary" /> Need to Send a Complain?
                                </h2>
                                <p className="text-sm text-foreground/60 mb-8 italic">
                                    Is something wrong with your food or delivery? Tell us everything.
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        icon={<FaUser />}
                                        {...register("name", { required: "Name is required" })}
                                        error={errors.name}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        icon={<FaEnvelope />}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                        })}
                                        error={errors.email}
                                    />
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-medium text-foreground/80">Select Topic</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full bg-surface border-foreground/10 focus:border-primary focus:outline-none transition-all"
                                            {...register("topic", { required: "Please select a topic" })}
                                        >
                                            <option value="">Choose a topic...</option>
                                            <option value="complaint">Complaint about Food</option>
                                            <option value="delivery">Delivery Issue</option>
                                            <option value="question">Question for Chef</option>
                                            <option value="technical">Technical Support</option>
                                        </select>
                                        {errors.topic && <span className="text-error text-xs mt-1 ml-1">{errors.topic.message}</span>}
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-medium text-foreground/80">Your Message</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-32 bg-surface border-foreground/10 focus:border-primary focus:outline-none transition-all resize-none font-sans"
                                            placeholder="Please describe your issue in detail..."
                                            {...register("message", { required: "Message is required", minLength: { value: 20, message: "Minimum 20 characters" } })}
                                        ></textarea>
                                        {errors.message && <span className="text-error text-xs mt-1 ml-1">{errors.message.message}</span>}
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full rounded-xl py-4 font-bold text-lg"
                                    >
                                        Submit Report
                                    </Button>
                                </form>
                            </Card>

                            <div className="mt-8 flex flex-col gap-4 px-2">
                                <div className="flex items-center gap-4 text-foreground/60 text-sm">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="font-bold">Email us at</p>
                                        <p>oasifrk451@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-foreground/60 text-sm">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FaUtensils />
                                    </div>
                                    <div>
                                        <p className="font-bold">Quality Hotline</p>
                                        <p>+8801812926106</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

        </div>
    );
};

export default FAQ;