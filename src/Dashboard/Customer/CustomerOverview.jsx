import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import Loading from "../../Components/Loading/Loading";
import { Card } from '../../Components/UI';
import { FaBagShopping, FaStar, FaHeart, FaMoneyBillWave } from 'react-icons/fa6';

const CustomerOverview = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['customer-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/customer/stats/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loading /></div>;

    const cards = [
        { label: 'Total Orders', value: stats.totalOrders || 0, icon: FaBagShopping, color: 'text-primary' },
        { label: 'Reviews Given', value: stats.totalReviews || 0, icon: FaStar, color: 'text-success' },
        { label: 'Favorite Meals', value: stats.totalFavorites || 0, icon: FaHeart, color: 'text-red-500' },
        { label: 'Total Spent', value: `৳${stats.totalSpent?.toLocaleString()}`, icon: FaMoneyBillWave, color: 'text-blue-500' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold">Welcome Home, {user?.displayName.split(' ')[0]}!</h1>
                <p className="text-foreground/50 mt-1">Here's a quick look at your culinary journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="!p-6 !bg-surface border-foreground/5 shadow-xl rounded-3xl">
                        <div className={`w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center ${card.color} mb-4`}>
                            <card.icon size={20} />
                        </div>
                        <p className="text-foreground/40 text-sm font-medium">{card.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 !p-8 !bg-surface border-foreground/5 shadow-xl rounded-3xl overflow-hidden">
                    <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-foreground/40 uppercase text-[10px] tracking-widest font-bold border-b border-foreground/5">
                                    <th className="py-4">Meal</th>
                                    <th className="py-4">Date</th>
                                    <th className="py-4">Price</th>
                                    <th className="py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders?.map((order, i) => (
                                    <tr key={i} className="border-b border-foreground/5 last:border-0">
                                        <td className="py-4 font-bold">{order.mealName}</td>
                                        <td className="py-4 text-sm text-foreground/50">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-bold text-primary">৳{order.price}</td>
                                        <td className="py-4 text-right">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold ${order.orderStatus === 'delivered' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-foreground/30">No orders yet. Time to feast!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="!p-8 !bg-primary border-none shadow-xl rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-8">Loyalty Level</h2>
                        <div className="text-center py-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                                <span className="text-3xl font-black">{stats.totalOrders > 5 ? 'Gold' : 'Silver'}</span>
                            </div>
                            <p className="text-sm opacity-70 font-medium">Keep ordering to unlock premium badges and exclusive rewards!</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CustomerOverview;
