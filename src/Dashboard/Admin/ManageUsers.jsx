
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../Components/Loading/Loading';
import { LuSearch, LuPlus, LuEye, LuPencil, LuTrash, LuArrowDown, LuX } from 'react-icons/lu';

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/admin');
            return res.data;
        }
    });

    const mutationFraud = useMutation({
        mutationFn: async (id) => axiosSecure.patch(`/users/fraud/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({ title: 'Success', text: 'User marked as fraud', icon: 'success', confirmButtonColor: "#f38b0c" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => axiosSecure.patch(`/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setEditUser(null);
            Swal.fire({ title: 'Updated!', text: 'User information updated successfully.', icon: 'success', confirmButtonColor: "#f38b0c" });
        }
    });

    const addCustomerMutation = useMutation({
        mutationFn: async (userData) => axiosSecure.post('/users', userData),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setIsModalOpen(false);
            Swal.fire({ title: 'Success', text: 'Customer added successfully', icon: 'success', confirmButtonColor: "#f38b0c" });
        }
    });

    const handleAddCustomer = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const role = form.role.value;
        addCustomerMutation.mutate({ displayName: name, email, role, status: 'active' });
    };

    const handleEditCustomer = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const role = form.role.value;
        const status = form.status.value;
        const phone = form.phone.value;
        updateMutation.mutate({
            id: editUser._id,
            data: { displayName: name, role, status, phone }
        });
    };

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

    const COLORS = { primary: '#f38b0c', secondary: '#D6E2C3', textMain: '#1F2937', textLight: '#6B7280', tableHeader: '#f38b0c' };

    return (
        <div className="space-y-6 animate-fade-in text-foreground relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer List</h1>
                    <p className="text-gray-500 text-sm mt-1">Serving Creates Success</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    <LuPlus size={20} /> Add Customer
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-white/10 overflow-hidden">
                <div className="p-6">
                    {/* Table Section */}
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="text-white">
                                    <th className="p-4 font-semibold text-sm bg-primary rounded-l-xl">Customer Name</th>
                                    <th className="p-4 font-semibold text-sm bg-primary">Phone</th>
                                    <th className="p-4 font-semibold text-sm bg-primary"><div className="flex items-center gap-1">Registered On <LuArrowDown size={14} /></div></th>
                                    <th className="p-4 font-semibold text-sm bg-primary"><div className="flex items-center gap-1">Orders <LuArrowDown size={14} /></div></th>
                                    <th className="p-4 font-semibold text-sm bg-primary"><div className="flex items-center gap-1">Total Spent <LuArrowDown size={14} /></div></th>
                                    <th className="p-4 font-semibold text-sm rounded-r-xl bg-primary">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                                                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.name}`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.displayName || user.name}</div>
                                                    <div className="text-xs text-gray-400 capitalize">{user.role} • {user.status}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{user.phone || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-4 text-gray-900 font-medium text-center">{user.ordersCount || 0}</td>
                                        <td className="p-4 font-bold text-gray-900">৳{user.totalSpent?.toFixed(2) || '0.00'}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setViewUser(user)} className="text-gray-400 hover:text-[#f38b0c] transition-colors"><LuEye size={18} /></button>
                                                <button onClick={() => setEditUser(user)} className="text-gray-400 hover:text-blue-500 transition-colors"><LuPencil size={18} /></button>
                                                <button onClick={() => { Swal.fire({ title: 'Delete?', text: "Remove this user?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Delete' }).then(r => r.isConfirmed && updateMutation.mutate({ id: user._id, data: { status: 'deleted' } })) }} className="text-gray-400 hover:text-red-500 transition-colors"><LuTrash size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-50">
                        <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                            Showing <span className="font-semibold text-gray-900">{filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-semibold text-gray-900">{filteredUsers.length}</span> Customers
                        </p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-gray-500 font-medium hover:text-[#f38b0c] disabled:opacity-30">Previous</button>
                            <div className="flex gap-1 mx-2">
                                {totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold transition-all ${page === currentPage ? 'text-white shadow-sm' : 'text-foreground/70 hover:bg-primary/10'}`} style={page === currentPage ? { backgroundColor: COLORS.primary } : {}}>{page}</button>
                                )) : <button className="w-10 h-10 rounded-lg font-bold text-white bg-gray-200" disabled>1</button>}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-4 py-2 text-gray-500 font-medium hover:text-[#f38b0c] disabled:opacity-30">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View User Modal */}
            {viewUser && (
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
                            <button onClick={() => setViewUser(null)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><LuX size={24} /></button>
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
            )}

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Edit Customer Info</h2>
                            <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-red-500 transition-colors"><LuX size={24} /></button>
                        </div>
                        <form onSubmit={handleEditCustomer} className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                                <input name="name" type="text" defaultValue={editUser.displayName || editUser.name} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input name="phone" type="text" defaultValue={editUser.phone || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none" placeholder="01XXX-XXXXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                    <select name="role" defaultValue={editUser.role} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none">
                                        <option value="customer">Customer</option>
                                        <option value="chef">Chef</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select name="status" defaultValue={editUser.status} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none">
                                        <option value="active">Active</option>
                                        <option value="fraud">Fraud</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditUser(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" className="flex-2 px-8 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#f38b0c]/20" style={{ backgroundColor: COLORS.primary }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><LuX size={24} /></button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input name="name" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input name="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Role</label>
                                <select name="role" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38b0c] outline-none">
                                    <option value="customer">Customer</option>
                                    <option value="chef">Chef</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 mt-4 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#f38b0c]/20" style={{ backgroundColor: COLORS.primary }}>
                                Create Customer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
