import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, LineChart, Line, AreaChart, Area
} from 'recharts';
import Loading from "../../Components/Loading/Loading";
import { Card } from '../../Components/UI';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaUtensils, FaChartLine, FaChartPie, FaBolt } from 'react-icons/fa';

const PlatformStats = () => {
    const axiosSecure = useAxiosSecure();
    const { data: rawData = {}, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/stats');
            return res.data;
        }
    });

    const { stats = {}, roleDistribution = [], revenueTrends: rawRevenueTrends = [], topMeals = [] } = rawData;

    // Process revenue trends to look better with sparse data
    const revenueTrends = React.useMemo(() => {
        if (rawRevenueTrends.length === 0) return [{ month: "No Data", revenue: 0 }];
        if (rawRevenueTrends.length === 1) {
            // If only one data point, add a dummy 0 point for the previous month to show growth
            const date = new Date(rawRevenueTrends[0].month + "-01");
            date.setMonth(date.getMonth() - 1);
            const prevMonth = date.toISOString().slice(0, 7);
            return [
                { month: prevMonth, revenue: 0 },
                ...rawRevenueTrends
            ];
        }
        return rawRevenueTrends;
    }, [rawRevenueTrends]);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const COLORS = ['#f38b0c', '#3b82f6', '#10b981', '#a855f7', '#ef4444'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <p className="text-sm font-black text-foreground">
                                {entry.name}: <span className="text-primary">
                                    {entry.name.toLowerCase().includes('revenue') ? `৳${entry.value.toLocaleString()}` : entry.value}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-orange-500 to-red-600 bg-clip-text text-transparent tracking-tight">Platform Analytics</h1>
                    <p className="text-foreground/60 mt-2 flex items-center gap-2">
                        <FaBolt className="text-yellow-500 animate-pulse" /> Real-time insights and business performance metrics
                    </p>
                </div>
                <div className="flex gap-2 bg-surface/50 p-1 rounded-2xl border border-white/5">
                    <div className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">All Time</div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: FaMoneyBillWave, color: 'from-green-500/20 to-emerald-600/20', text: 'text-green-500' },
                    { label: "Today's Sale", value: `৳${stats.todayRevenue?.toLocaleString()}`, icon: FaBolt, color: 'from-yellow-500/20 to-orange-600/20', text: 'text-yellow-500' },
                    { label: 'Platform Profit (20%)', value: `৳${stats.totalProfit?.toLocaleString()}`, icon: FaMoneyBillWave, color: 'from-emerald-500/20 to-green-600/20', text: 'text-emerald-500' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingCart, color: 'from-blue-500/20 to-indigo-600/20', text: 'text-blue-500' },
                    { label: 'Platform Users', value: stats.totalUsers, icon: FaUsers, color: 'from-primary/20 to-orange-600/20', text: 'text-primary' },
                    { label: 'Active Chefs', value: stats.totalChefs, icon: FaUtensils, color: 'from-purple-500/20 to-pink-600/20', text: 'text-purple-500' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: FaChartLine, color: 'from-red-500/20 to-rose-600/20', text: 'text-red-500' },
                    { label: 'Completed Orders', value: stats.deliveredOrders, icon: FaChartLine, color: 'from-teal-500/20 to-cyan-600/20', text: 'text-teal-500' },
                ].map((item, i) => (
                    <Card key={i} className="group hover:scale-[1.02] transition-all duration-300 !p-0 overflow-hidden relative border-white/5 bg-surface/50">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                        <div className="p-6 relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-40 mb-1">{item.label}</p>
                                <h3 className={`text-2xl font-black ${item.text}`}>{item.value || 0}</h3>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl ${item.text} border border-white/10 group-hover:rotate-12 transition-transform`}>
                                <item.icon />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1: Revenue Trends */}
            <div className="grid grid-cols-1 gap-8">
                <Card className="glass border-white/5 shadow-2xl relative overflow-hidden min-h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                                <FaChartLine className="text-primary" /> Revenue Growth Trajectory
                            </h3>
                            <p className="text-xs opacity-50 font-bold uppercase tracking-widest mt-1">Monthly platform earnings performance</p>
                        </div>
                    </div>
                    <div className="h-80 w-full px-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f38b0c" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#f38b0c" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#ffffff30"
                                    fontSize={10}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#ffffff60' }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#ffffff30"
                                    fontSize={10}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `৳${v}`}
                                    tick={{ fill: '#ffffff60' }}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                {/* Bottom Glowing Layer */}
                                <Area
                                    type="natural"
                                    dataKey="revenue"
                                    stroke="none"
                                    fill="url(#colorRev)"
                                    fillOpacity={1}
                                    animationDuration={2000}
                                />
                                {/* Main Line Layer */}
                                <Area
                                    type="natural"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="#f38b0c"
                                    strokeWidth={4}
                                    fill="none"
                                    dot={{ r: 6, strokeWidth: 3, fill: '#000', stroke: '#f38b0c' }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#f38b0c' }}
                                    filter="url(#glow)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Charts Row 2: Distribution & Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution */}
                <Card className="glass border-white/5 shadow-2xl h-[450px]">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 mb-8">
                        <FaChartPie className="text-primary" /> User Ecosystem
                    </h3>
                    <div className="h-full pb-16">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleDistribution}
                                    cx="50%" cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                    stroke="none"
                                >
                                    {roleDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    content={({ payload }) => (
                                        <div className="flex justify-center gap-6 mt-8">
                                            {payload.map((entry, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                                    <span className="text-[10px] uppercase tracking-widest font-black opacity-60">
                                                        {entry.value} ({roleDistribution[index]?.count})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Best Selling Meals */}
                <Card className="glass border-white/5 shadow-2xl h-[450px]">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 mb-8">
                        <FaUtensils className="text-primary" /> Top Performing Delicacies
                    </h3>
                    <div className="h-full pb-16">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMeals} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} width={100} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="sales" name="Orders" radius={[0, 10, 10, 0]} barSize={20}>
                                    {topMeals.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PlatformStats;
