import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaUser, FaEnvelope, FaHistory, FaUserShield, FaUtensils } from 'react-icons/fa';
import Loading from '../../Components/Loading/Loading';
import { motion } from 'framer-motion';

const ManageRequests = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/requests');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async ({ id, status, userEmail, requestType }) => {
            return axiosSecure.patch(`/requests/${id}`, { status, userEmail, requestType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['requests']);
            Swal.fire({
                title: 'Success!',
                text: 'Member request has been updated.',
                icon: 'success',
                confirmButtonColor: '#f38b0c',
                background: "var(--surface)",
                color: "var(--foreground)"
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update request.',
                icon: 'error',
                confirmButtonColor: '#f38b0c',
                background: "var(--surface)",
                color: "var(--foreground)"
            });
        }
    });

    const handleAction = (request, status) => {
        const actionText = status === 'approved' ? 'Approve' : 'Reject';

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${actionText.toLowerCase()} this request for ${request.userName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: status === 'approved' ? '#f38b0c' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${actionText}!`,
            background: 'var(--surface)',
            color: 'var(--foreground)'
        }).then((result) => {
            if (result.isConfirmed) {
                mutation.mutate({
                    id: request._id,
                    status,
                    userEmail: request.userEmail,
                    requestType: request.requestType
                });
            }
        });
    };

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loading /></div>;

    const pendingCount = requests.filter(r => r.requestStatus === 'pending').length;

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Role Requests</h1>
                    <p className="text-foreground/50 mt-1">Review and manage user applications for Chef and Admin roles</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                    {pendingCount} Pending Requests
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-surface rounded-3xl border border-foreground/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="border-b border-foreground/5 bg-foreground/5">
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Requester</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Requested Role</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Status</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((req, index) => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-foreground/5 transition-colors border-b border-foreground/5 last:border-0"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                                                    <FaUser size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{req.userName}</div>
                                                    <div className="text-[10px] opacity-40 font-medium">{req.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${req.requestType === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                    {req.requestType === 'admin' ? <FaUserShield size={14} /> : <FaUtensils size={14} />}
                                                </div>
                                                <span className="font-bold text-[10px] uppercase tracking-wider">{req.requestType}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.requestStatus === 'approved' ? 'bg-success/10 text-success border-success/20' :
                                                req.requestStatus === 'rejected' ? 'bg-error/10 text-error border-error/20' :
                                                    'bg-warning/10 text-warning border-warning/20'
                                                }`}>
                                                {req.requestStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {req.requestStatus === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(req, 'approved')}
                                                            className="p-2.5 rounded-xl bg-foreground/5 hover:bg-success/10 hover:text-success transition-all group"
                                                            title="Approve Request"
                                                        >
                                                            <FaCheck size={14} className="group-hover:scale-110 transition-transform" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req, 'rejected')}
                                                            className="p-2.5 rounded-xl bg-foreground/5 hover:bg-error/10 hover:text-error transition-all group"
                                                            title="Reject Request"
                                                        >
                                                            <FaTimes size={14} className="group-hover:scale-110 transition-transform" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-30 uppercase tracking-widest pr-2">
                                                        <FaHistory /> Processed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <p className="text-foreground/30 font-medium">No role requests found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRequests;
