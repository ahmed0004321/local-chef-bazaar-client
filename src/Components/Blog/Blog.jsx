import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Button } from "../UI";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";
import {
    FaPen,
    FaArrowRight,
    FaTimes,
    FaCloudUploadAlt,
    FaCalendarAlt,
    FaUser,
    FaTag,
} from "react-icons/fa";

const Blog = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = use(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Recipes");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axiosSecure.get("/blogs");
                setBlogs(res.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
        window.scrollTo(0, 0);
    }, [axiosSecure]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setTitle("");
        setCategory("Recipes");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content || !imageFile) {
            Swal.fire({
                title: "Missing Fields",
                text: "Please fill in all fields and upload an image.",
                icon: "warning",
                confirmButtonColor: "#f38b0c",
                background: "var(--surface)",
                color: "var(--foreground)",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload image to ImgBB
            const formData = new FormData();
            formData.append("image", imageFile);
            const imgRes = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
                { method: "POST", body: formData }
            );
            const imgData = await imgRes.json();
            if (!imgData.data) throw new Error("Image upload failed");

            const blogData = {
                title,
                category,
                content,
                image: imgData.data.display_url,
                author: user?.data?.displayName || "Anonymous",
                authorEmail: user?.data?.email || "",
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            };

            const res = await axiosSecure.post("/blogs", blogData);
            if (res.data?.insertedId) {
                Swal.fire({
                    title: "Published!",
                    text: "Your story has been shared with the community.",
                    icon: "success",
                    confirmButtonColor: "#f38b0c",
                    background: "var(--surface)",
                    color: "var(--foreground)",
                });
                // Re-fetch blogs
                const updatedBlogs = await axiosSecure.get("/blogs");
                setBlogs(updatedBlogs.data);
                resetForm();
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to publish your story. Please try again.",
                icon: "error",
                confirmButtonColor: "#f38b0c",
                background: "var(--surface)",
                color: "var(--foreground)",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        "Recipes",
        "Culture",
        "Tips & Tricks",
        "Chef Stories",
        "Ingredients",
        "Health",
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
                        alt="Culinary Journal Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
                </div>
                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">
                            The Culinary Journal
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight mt-2">
                            Stories from
                            <br />
                            <span className="text-primary">the Kitchen</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-light leading-relaxed">
                            Discover recipes, culinary traditions, and untold stories from
                            local chefs around your community.
                        </p>
                    </motion.div>
                </Container>
            </section>

            {/* Main Content */}
            <main className="py-20">
                <Container>
                    {/* Header with Write Button */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Latest Stories
                            </h2>
                            <p className="text-foreground/50 mt-2">
                                Fresh perspectives from our community of chefs and food lovers.
                            </p>
                        </div>
                        {user && (
                            <Button
                                variant="primary"
                                onClick={() => setShowModal(true)}
                                className="rounded-full px-8 flex items-center gap-2"
                            >
                                <FaPen size={12} /> Write a Story
                            </Button>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold mb-2">No stories yet</h3>
                            <p className="text-foreground/50">
                                Be the first to share a culinary story with the community!
                            </p>
                        </div>
                    ) : (
                        /* Blog Feed */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, index) => (
                                <motion.article
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-5 shadow-lg">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            {blog.category}
                                        </span>
                                    </div>
                                    <div className="px-1">
                                        <div className="flex items-center gap-3 mb-3 text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-primary/50" />
                                                {blog.date}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5">
                                                <FaUser className="text-primary/50" />
                                                {blog.author}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-foreground/50 text-sm mt-2 line-clamp-2 leading-relaxed">
                                            {blog.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-primary text-sm font-bold group-hover:gap-3 transition-all duration-300">
                                            Read Story <FaArrowRight size={12} />
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </Container>
            </main>

            {/* Write Story Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && resetForm()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-surface rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-foreground/5"
                        >
                            <div className="p-8">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold">Write a Story</h2>
                                        <p className="text-foreground/40 text-sm mt-1">
                                            Share your culinary journey with the community
                                        </p>
                                    </div>
                                    <button
                                        onClick={resetForm}
                                        className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                                            Story Title
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Give your story a catchy title..."
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                                            Cover Image
                                        </label>
                                        <div className="relative border-2 border-dashed border-foreground/10 rounded-2xl p-6 hover:bg-foreground/5 transition text-center cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-foreground/40 py-4">
                                                    <FaCloudUploadAlt className="text-4xl text-primary" />
                                                    <span className="text-sm font-medium">
                                                        Upload a cover image
                                                    </span>
                                                    <span className="text-xs opacity-60">
                                                        JPG, PNG up to 5MB
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                                            Your Story
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Start writing your culinary story..."
                                            rows={8}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={resetForm}
                                            className="rounded-full px-6"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isSubmitting}
                                            className="rounded-full px-8"
                                        >
                                            {isSubmitting ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                "Publish Story"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Blog;