import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { Container, Button } from "../../Components/UI";
import Swal from "sweetalert2";
import { FaTrash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

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
    }, [axiosSecure]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This blog will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f38b0c",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            background: "var(--surface)",
            color: "var(--foreground)"
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/blogs/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The blog post has been removed.",
                        icon: "success",
                        confirmButtonColor: "#f38b0c",
                        background: "var(--surface)",
                        color: "var(--foreground)"
                    });
                    setBlogs(blogs.filter(blog => blog._id !== id));
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete the blog.",
                    icon: "error",
                    confirmButtonColor: "#f38b0c"
                });
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
                    <p className="text-foreground/50 mt-1">Review and manage all community stories</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                    {blogs.length} Total Posts
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="bg-surface rounded-3xl border border-foreground/5 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-foreground/5 bg-foreground/5">
                                    <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Blog Info</th>
                                    <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Category</th>
                                    <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Author</th>
                                    <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog, index) => (
                                    <motion.tr
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-foreground/5 transition-colors border-b border-foreground/5 last:border-0"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm line-clamp-1">{blog.title}</div>
                                                    <div className="text-[10px] opacity-40 font-medium">{blog.date}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="bg-foreground/5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-xs font-medium">{blog.author}</div>
                                            <div className="text-[10px] opacity-40">{blog.authorEmail}</div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/blog`, '_blank')}
                                                    className="p-2.5 rounded-xl bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-all group"
                                                    title="View Blog"
                                                >
                                                    <FaEye size={14} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    className="p-2.5 rounded-xl bg-foreground/5 hover:bg-error/10 hover:text-error transition-all group"
                                                    title="Delete Blog"
                                                >
                                                    <FaTrash size={14} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {blogs.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-foreground/30 font-medium">No blog posts found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageBlogs;
