import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { Card, Container } from "../../Components/UI";
import { FaExclamationCircle, FaUser, FaEnvelope, FaTag, FaClock } from "react-icons/fa";

const ManageComplaints = () => {
    const axiosSecure = useAxiosSecure();

    const { data: complaints = [], isLoading } = useQuery({
        queryKey: ["admin-complaints"],
        queryFn: async () => {
            const res = await axiosSecure.get("/complaints");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="py-20 flex justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manage Complaints</h1>
                    <p className="text-foreground/50 mt-1">Review and manage user feedback and complaints.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <Card key={complaint._id} className="p-0 overflow-hidden border border-foreground/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div className="flex flex-col lg:flex-row">
                                {/* Status Sidebar */}
                                <div className={`w-full lg:w-2 bg-primary/20`}></div>

                                <div className="p-6 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <FaExclamationCircle />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg capitalize">{complaint.topic?.replace('_', ' ')}</h3>
                                                <div className="flex items-center gap-3 text-xs text-foreground/40 mt-0.5">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <FaClock /> {new Date(complaint.createdAt).toLocaleString()}
                                                    </span>
                                                    <span className="badge badge-sm badge-primary bg-primary/10 text-primary border-none font-bold uppercase tracking-wider px-2 py-2">
                                                        {complaint.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm bg-surface/50 px-4 py-2 rounded-xl border border-foreground/5">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-primary/50" />
                                                <span className="font-medium">{complaint.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 border-l border-foreground/10 pl-4">
                                                <FaEnvelope className="text-primary/50" />
                                                <span className="text-foreground/60">{complaint.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-background/50 p-4 rounded-2xl border border-foreground/5">
                                        <p className="text-foreground/80 leading-relaxed italic pr-4">
                                            "{complaint.message}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-24 bg-surface/30 rounded-3xl border border-dashed border-foreground/10">
                        <div className="text-6xl mb-4 opacity-20">📬</div>
                        <h3 className="text-2xl font-bold text-foreground">No Complaints Yet</h3>
                        <p className="text-foreground/50 mt-2">All quiet on the feedback front.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageComplaints;
