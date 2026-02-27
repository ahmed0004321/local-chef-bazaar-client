import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Container, Button } from "../UI";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const res = await axiosSecure.get(`/blogs/${id}`);
                setBlog(res.data);
            } catch (error) {
                console.error("Error fetching blog details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogDetails();
        window.scrollTo(0, 0);
    }, [id, axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-center p-4">
                <h1 className="text-4xl font-bold">Story Not Found</h1>
                <p className="text-foreground/50">The story you are looking for might have been moved or removed.</p>
                <Button onClick={() => navigate("/blog")} variant="primary">Back to Journal</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-foreground transition-colors duration-300">

            <main className="pt-32 pb-24">
                <Container>
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate("/blog")}
                        className="flex items-center gap-2 text-primary font-bold mb-12 hover:gap-3 transition-all"
                    >
                        <FaArrowLeft /> Back to Journal
                    </motion.button>

                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-6 mb-6">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    {blog.category}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                                    <FaCalendarAlt className="text-primary/50" />
                                    {blog.date}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-4 py-6 border-y border-foreground/5">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FaUser size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{blog.author}</p>
                                    <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest">Culinary Storyteller</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative aspect-[21/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl"
                        >
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-xl prose-invert max-w-none"
                        >
                            <p className="text-xl md:text-2xl leading-relaxed font-light text-foreground/80 whitespace-pre-wrap">
                                {blog.content}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-20 p-12 rounded-[40px] bg-surface border border-foreground/5 text-center"
                        >
                            <h3 className="text-2xl font-bold mb-4">Did you enjoy this story?</h3>
                            <p className="text-foreground/50 mb-8 max-w-md mx-auto">Share your thoughts with the community or explore more culinary traditions.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button onClick={() => navigate("/blog")} variant="primary" className="rounded-full px-8">Explore More</Button>
                                <Button variant="ghost" className="rounded-full px-8 border border-foreground/10">Share Story</Button>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default BlogDetails;
