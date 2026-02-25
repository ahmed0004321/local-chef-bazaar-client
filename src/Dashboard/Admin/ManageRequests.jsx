import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Swal from 'sweetalert2';
import { Card, Button } from '../../Components/UI';
import { FaUser, FaEnvelope, FaIdBadge, FaCheck, FaTimes, FaHistory, FaUserShield, FaUtensils } from 'react-icons/fa';
import Loading from '../../Components/Loading/Loading';

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
                background: 'var(--surface)',
                color: 'var(--foreground)',
                confirmButtonColor: '#f38b0c'
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update request.',
                icon: 'error',
                background: 'var(--surface)',
                color: 'var(--foreground)'
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
            confirmButtonColor: status === 'approved' ? '#10b981' : '#ef4444',
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

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loading /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Manage Role Requests</h1>
                    <p className="text-foreground/60 mt-2">Review and manage user applications for Chef and Admin roles</p>
                </div>
                <div className="bg-surface/50 backdrop-blur px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider font-bold opacity-40">Total Pending</p>
                        <p className="text-2xl font-black text-primary">{requests.filter(r => r.requestStatus === 'pending').length}</p>
                    </div>
                </div>
            </div>

            <Card className="glass !p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="table w-full border-collapse">
                        <thead>
                            <tr className="bg-neutral-900/50 text-foreground/50 uppercase text-[10px] tracking-[0.2em] font-black border-b border-white/5">
                                <th className="py-6 pl-8">Requester</th>
                                <th>Requested Role</th>
                                <th>Status</th>
                                <th className="text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length > 0 ? requests.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                                                <FaUser className="text-xl" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{req.userName}</div>
                                                <div className="text-sm opacity-50 flex items-center gap-2">
                                                    <FaEnvelope className="text-[10px]" /> {req.userEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${req.requestType === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {req.requestType === 'admin' ? <FaUserShield /> : <FaUtensils />}
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-widest">{req.requestType}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${req.requestStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                req.requestStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse'
                                            }`}>
                                            {req.requestStatus}
                                        </span>
                                    </td>
                                    <td className="pr-8">
                                        <div className="flex justify-end gap-3">
                                            {req.requestStatus === 'pending' ? (
                                                <>
                                                    <Button
                                                        onClick={() => handleAction(req, 'approved')}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-10 h-10 p-0 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-0"
                                                        title="Approve Request"
                                                    >
                                                        <FaCheck />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction(req, 'rejected')}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-10 h-10 p-0 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-0"
                                                        title="Reject Request"
                                                    >
                                                        <FaTimes />
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-30 uppercase tracking-widest">
                                                    <FaHistory /> Processed
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="opacity-20 text-6xl mb-4 text-primary">📑</div>
                                        <h3 className="text-xl font-bold opacity-40">No requests found</h3>
                                        <p className="text-sm opacity-30 mt-1">Applications will appear here once submitted</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManageRequests;
