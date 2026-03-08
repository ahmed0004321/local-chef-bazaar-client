import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loading from "../../Components/Loading/Loading";
import { Card } from '../../Components/UI';
import { FaUtensils, FaMoneyBillWave, FaClipboardList, FaClock } from 'react-icons/fa';

const ChefOverview = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['chef-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/chef/stats/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const chartData = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push({
                date: dateStr,
                name: days[date.getDay()],
                revenue: 0
            });
        }
        if (stats.dailySales?.length > 0) {
            return last7Days.map(day => {
                const actual = stats.dailySales.find(d => d.date === day.date);
                return actual ? { ...day, revenue: actual.revenue } : day;
            });
        }
        return last7Days;
    }, [stats.dailySales]);

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loading /></div>;

    const cards = [
        { label: 'Total Revenue', value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: FaMoneyBillWave, color: 'text-primary' },
        { label: 'My Meals', value: stats.totalMeals || 0, icon: FaUtensils, color: 'text-success' },
        { label: 'Total Orders', value: stats.totalOrders || 0, icon: FaClipboardList, color: 'text-blue-500' },
        { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: FaClock, color: 'text-warning' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold">Chef Dashboard</h1>
                <p className="text-foreground/50 mt-1">Welcome back, {user?.displayName}. Here's your kitchen performance.</p>
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

            <Card className="!p-8 !bg-surface border-foreground/5 shadow-xl rounded-3xl">
                <h2 className="text-xl font-bold mb-8">Revenue Trends (Last 7 Days)</h2>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorChef" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.5, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.5, fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fill="url(#colorChef)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default ChefOverview;
