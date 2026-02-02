
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/admin');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (id) => {
            return axiosSecure.patch(`/users/fraud/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                title: 'Success',
                text: 'User marked as fraud',
                icon: 'success',
                confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
            });
        }
    });

    const handleMakeFraud = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make fraud!',
            background: 'var(--surface)', color: 'var(--foreground)'
        }).then((result) => {
            if (result.isConfirmed) {
                mutation.mutate(id);
            }
        });
    };

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="w-full p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-foreground">Manage Users <span className="opacity-50 text-base font-normal">({users.length})</span></h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="input input-bordered w-full max-w-xs bg-surface border-white/10 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-lg bg-surface">
                <table className="table w-full">
                    <thead className="bg-neutral-900/50 text-foreground/70 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="py-4">User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10">
                                                <img src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.displayName} alt="Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.displayName || user.name}</div>
                                            <div className="text-sm opacity-50">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="capitalize font-medium">{user.role || 'user'}</td>
                                <td>
                                    <span className={`badge border-0 font-bold ${user.status === 'fraud' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td>
                                    {user.role !== 'admin' && user.status !== 'fraud' && (
                                        <button
                                            onClick={() => handleMakeFraud(user._id)}
                                            className="btn btn-sm btn-error btn-outline"
                                        >
                                            Make Fraud
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
