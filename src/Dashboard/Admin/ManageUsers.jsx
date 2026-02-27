
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../Components/Loading/Loading';
import { FaEye, FaTrash, FaTimes, FaUserSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [viewUser, setViewUser] = useState(null);

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/admin');
            return res.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => axiosSecure.patch(`/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({ title: 'Success!', text: 'User status updated.', icon: 'success', confirmButtonColor: "#f38b0c" });
        }
    });


    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

    const COLORS = { primary: '#f38b0c', secondary: '#D6E2C3', textMain: '#1F2937', textLight: '#6B7280', tableHeader: '#f38b0c' };

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
                    <p className="text-foreground/50 mt-1">Oversee community members and access control</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                    {users.length} Total Users
                </div>
            </div>


            {/* Main Content Card */}
            <div className="bg-surface rounded-3xl border border-foreground/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="border-b border-foreground/5 bg-foreground/5">
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">User Info</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Role & Status</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50">Activity</th>
                                <th className="py-4 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-foreground/5 transition-colors border-b border-foreground/5 last:border-0"
                                >
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-foreground/10 shadow-sm">
                                                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.name}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{user.displayName || user.name}</div>
                                                <div className="text-[10px] opacity-40 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit">
                                                {user.role}
                                            </span>
                                            <span className={`text-[10px] font-medium uppercase tracking-wider ${user.status === 'active' ? 'text-success' : user.status === 'fraud' ? 'text-error' : 'text-warning'}`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="text-xs font-semibold">৳{user.totalSpent?.toFixed(2) || '0.00'}</div>
                                        <div className="text-[10px] opacity-40">{user.ordersCount || 0} Orders</div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setViewUser(user)} className="p-2.5 rounded-xl bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-all group" title="View Details">
                                                <FaEye size={14} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                            {user.status !== 'fraud' && (
                                                <button
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Mark as Fraud?',
                                                            text: "This user will be flagged as fraud.",
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#f38b0c',
                                                            confirmButtonText: 'Yes, Mark Fraud!',
                                                            background: "var(--surface)",
                                                            color: "var(--foreground)"
                                                        }).then(r => r.isConfirmed && updateMutation.mutate({ id: user._id, data: { status: 'fraud' } }))
                                                    }}
                                                    className="p-2.5 rounded-xl bg-foreground/5 hover:bg-warning/10 hover:text-warning transition-all group"
                                                    title="Mark as Fraud"
                                                >
                                                    <FaUserSlash size={14} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Delete User?',
                                                        text: "This will permanently remove the user.",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#d33',
                                                        confirmButtonText: 'Delete',
                                                        background: "var(--surface)",
                                                        color: "var(--foreground)"
                                                    }).then(r => r.isConfirmed && updateMutation.mutate({ id: user._id, data: { status: 'deleted' } }))
                                                }}
                                                className="p-2.5 rounded-xl bg-foreground/5 hover:bg-error/10 hover:text-error transition-all group"
                                                title="Remove User"
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

            </div>

            {/* View User Modal */}
            {
                viewUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-surface rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                            <div className="p-8 pb-0 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#f38b0c]/20 shadow-sm">
                                        <img src={viewUser.photoURL || `https://ui-avatars.com/api/?name=${viewUser.displayName || viewUser.name}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{viewUser.displayName || viewUser.name}</h2>
                                        <p className="text-gray-500">{viewUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewUser(null)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><FaTimes size={24} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                                        <p className="font-bold text-gray-900 text-xl">{viewUser.ordersCount || 0}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Spent</p>
                                        <p className="text-xl font-bold text-[#f38b0c]">৳{viewUser.totalSpent?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-gray-500">Phone Number</span>
                                        <span className="font-semibold">{viewUser.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-gray-500">Membership Since</span>
                                        <span className="font-semibold">{viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-gray-500">Last Transaction</span>
                                        <span className="font-semibold">{viewUser.lastOrder ? new Date(viewUser.lastOrder).toLocaleDateString() : 'No Orders'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-gray-500">Current Role</span>
                                        <span className="px-3 py-1 bg-[#f38b0c]/10 text-[#f38b0c] rounded-lg text-sm font-bold uppercase">{viewUser.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-gray-500">Account Status</span>
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${viewUser.status === 'fraud' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{viewUser.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default ManageUsers;
