import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import Loading from "../../Components/Loading/Loading";
import { Card } from '../../Components/UI';
import { FaShoppingCart, FaMoneyBillWave, FaChartLine, FaChevronDown, FaExpandAlt, FaUsers } from 'react-icons/fa';

const COLORS = ['var(--primary)', '#10B981', '#3B82F6', '#F59E0B'];

const PlatformStats = () => {
    const axiosSecure = useAxiosSecure();
    const { data: rawData = {}, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/stats');
            return res.data;
        }
    });

    const { stats = {}, roleDistribution = [], dailySales = [], recentOrders = [], topMeals = [] } = rawData;

    // Process daily sales to day names
    const chartData = React.useMemo(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const last7Days = [];

        // Generate last 7 days with 0 revenue
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

        // Merge actual data if exists
        if (dailySales.length > 0) {
            return last7Days.map(day => {
                const actualData = dailySales.find(d => d.date === day.date);
                return actualData ? { ...day, revenue: actualData.revenue } : day;
            });
        }

        return last7Days;
    }, [dailySales]);

    const pieData = React.useMemo(() => {
        return roleDistribution.map(item => ({
            name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) + 's',
            value: item.count
        }));
    }, [roleDistribution]);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Revenue', value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: FaMoneyBillWave, trend: '+12.5%', color: 'text-primary' },
        { label: "Today's Sale", value: `৳${stats.todayRevenue?.toLocaleString()}`, icon: FaChartLine, trend: '+5.2%', color: 'text-success' },
        { label: 'Platform Profit', value: `৳${stats.totalProfit?.toLocaleString()}`, icon: FaMoneyBillWave, trend: '+8.1%', color: 'text-primary' },
        { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingCart, trend: '+14.2%', color: 'text-blue-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Insights</h1>
                    <p className="text-foreground/50 mt-1">Detailed performance metrics and growth analytics</p>
                </div>
                <div className="bg-surface p-1 rounded-2xl border border-foreground/5 shadow-sm inline-flex">
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20">All Time</button>
                    <button className="px-4 py-2 text-foreground/40 hover:text-foreground/70 rounded-xl text-xs font-bold transition-colors">This Month</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((item, i) => (
                    <Card key={i} className="!p-6 !bg-surface border-foreground/5 shadow-xl rounded-3xl group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-foreground/5 ${item.color} group-hover:bg-primary group-hover:text-white transition-colors`}>
                                <item.icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">{item.trend}</span>
                        </div>
                        <p className="text-foreground/40 text-sm font-medium">{item.label}</p>
                        <h3 className="text-2xl font-bold text-foreground mt-1">{item.value || 0}</h3>
                    </Card>
                ))}
            </div>

            {/* Row 2: Sales Chart & Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <Card className="lg:col-span-2 !p-8 !bg-surface border-foreground/5 shadow-xl rounded-3xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">Sales Trends</h2>
                            <p className="text-xs text-foreground/40 font-medium mt-1">Daily revenue performance over the last week</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-sm font-bold transition-all hover:bg-primary hover:text-white">Last 7 Days</button>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--foreground)" strokeOpacity={0.05} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 500, opacity: 0.5 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 500, opacity: 0.5 }}
                                    tickFormatter={(v) => `৳${v >= 1000 ? `${v / 1000}k` : v}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fill="url(#colorSales)"
                                    dot={{ r: 5, fill: 'var(--surface)', stroke: 'var(--primary)', strokeWidth: 3 }}
                                    activeDot={{ r: 7, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Role Distribution Pie Chart */}
                <Card className="!p-8 !bg-surface border-foreground/5 shadow-xl rounded-3xl">
                    <h2 className="text-xl font-bold mb-2">User Distribution</h2>
                    <p className="text-xs text-foreground/40 font-medium mb-8">Platform composition by user role</p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface)',
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-2xl bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest">
                            <FaUsers /> {stats.totalUsers} Active Members
                        </div>
                    </div>
                </Card>
            </div>

            {/* Row 3: Recent Orders & Top Meals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 !p-0 !bg-surface border-foreground/5 shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <button className="text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors"><FaExpandAlt /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-foreground/5 text-foreground/70 uppercase text-[10px] tracking-widest font-bold border-b border-foreground/5">
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-foreground/[0.02] transition-colors border-b border-foreground/5 last:border-0">
                                        <td className="px-8 py-5 font-bold text-[11px] uppercase opacity-40">#{order.orderId?.toString().slice(-6)}</td>
                                        <td className="px-8 py-5 text-xs font-bold">{order.customer}</td>
                                        <td className="px-8 py-5 text-xs font-black text-primary">৳{order.amount?.toLocaleString()}</td>
                                        <td className="px-8 py-5 text-right font-bold">
                                            <span className={`
                                                px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider
                                                ${order.status === 'delivered' ? 'bg-success/10 text-success' :
                                                    order.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-primary/10 text-primary'}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Top Selling Products */}
                <Card className="!p-8 !bg-surface border-foreground/5 shadow-xl rounded-3xl">
                    <h2 className="text-xl font-bold mb-8">Top Selling Meals</h2>
                    <div className="space-y-6">
                        {topMeals.length > 0 ? topMeals.map((meal, idx) => (
                            <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:bg-foreground/5 p-2 rounded-2xl transition-all">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                                    <img loading="lazy"
                                        src={meal.image || "/placeholder.jpg"}
                                        alt={meal.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-sm truncate">{meal.name}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">{meal.sales} Sold</span>
                                        <span className="text-[10px] font-medium text-foreground/40">{Math.round((meal.sales / stats.totalOrders) * 100)}% of total</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-foreground/30 font-medium">No sales data recorded</div>
                        )}
                    </div>
                    <div className="mt-8 pt-6 border-t border-foreground/5">
                        <button className="w-full py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground/70 rounded-2xl text-xs font-bold transition-all">View All Products</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PlatformStats;
