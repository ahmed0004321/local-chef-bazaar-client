import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router";
import { Button, Card, Container } from "../UI";
import Loading from "../Loading/Loading";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const BlogPreview = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ["homepage-blogs"],
        queryFn: async () => {
            const res = await axiosSecure.get("/blogs");
            return res.data.slice(0, 3); // Latest 3 blogs
        },
    });

    if (isLoading) {
        return (
            <div className="py-20 flex justify-center">
                <Loading />
            </div>
        );
    }

    if (blogs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background/50">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                            Latest from Our Blog
                        </h2>
                        <p className="text-foreground/70 text-lg">
                            Tips, stories, and recipes from our local chef community.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/blog")}
                        variant="outline"
                        className="rounded-full shadow-sm"
                    >
                        View All Stories
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Card
                            key={blog._id}
                            className="p-0 border-0 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full bg-surface border border-primary/5 overflow-hidden cursor-pointer"
                            onClick={() => navigate(`/blog/${blog._id}`)}
                        >
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={blog.image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-foreground/50 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-primary/70" />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <FaUser className="text-primary/70" />
                                        {blog.authorName || "Chef"}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                                    {blog.title}
                                </h3>

                                <p className="text-foreground/60 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                                    {blog.description?.substring(0, 120)}...
                                </p>

                                <div className="pt-4 border-t border-primary/5">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/blog/${blog._id}`);
                                        }}
                                        className="text-primary font-bold inline-flex items-center gap-2 group/link"
                                    >
                                        Read More
                                        <span className="block w-4 h-[2px] bg-primary scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left"></span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default BlogPreview;
