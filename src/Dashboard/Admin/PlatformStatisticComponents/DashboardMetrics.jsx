import React, { useMemo } from "react";
import useAxiosSecure from "../../../Hooks/AxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

const DashboardMetrics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/payments");
      return res.data;
    },
  });

  const chartData = useMemo(() => {
    const dailyMap = {};
    const mealMap = {};

    // Sort payments by date first to ensure the chart is chronological
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    sortedPayments.forEach((p) => {
      // 1. Fix Date Accuracy: Include year or unique identifier if data is large
      const dateObj = new Date(p.created_at);
      const label = dateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });

      // 2. Aggregate Daily Data
      if (!dailyMap[label]) {
        dailyMap[label] = { date: label, revenue: 0, orderCount: 0 };
      }
      // Use Number() to prevent string concatenation
      dailyMap[label].revenue += Number(p.price || 0);
      dailyMap[label].orderCount += 1;

      // 3. Aggregate Meal Data (Limit to top 5 for cleaner Pie)
      const mealName = p.mealName || "Unknown Meal";
      mealMap[mealName] = (mealMap[mealName] || 0) + Number(p.price || 0);
    });

    return {
      daily: Object.values(dailyMap),
      meals: Object.keys(mealMap)
        .map((name) => ({
          name,
          value: mealMap[name],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5), // Top 5 meals
    };
  }, [payments]);

  const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  if (isLoading) return <Loading />;

  // Better total calculation
  const totalRev = payments.reduce((s, i) => s + Number(i.price || 0), 0);

  return (
    <div className="p-4 md:p-8 min-h-screen text-slate-200">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
        <p className="text-slate-400 mt-1">
          Real-time revenue and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 1. METRIC CARDS */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Revenue",
              val: `৳${totalRev.toLocaleString()}`,
              color: "text-emerald-400",
            },
            {
              label: "Total Orders",
              val: payments.length,
              color: "text-blue-400",
            },
            {
              label: "Avg. Transaction",
              val: `৳${(totalRev / (payments.length || 1)).toFixed(2)}`,
              color: "text-amber-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#161926] p-6 rounded-2xl border border-white/5 shadow-xl"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </span>
              <div className={`text-3xl font-bold mt-1 ${stat.color}`}>
                {stat.val}
              </div>
            </div>
          ))}
        </div>

        {/* 2. MULTI-BAR CHART */}
        <div className="col-span-12 lg:col-span-8 bg-[#161926] p-6 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-lg font-semibold mb-6">Daily Performance</h3>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.daily}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff05"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />

                {/* Left Y-Axis for large Revenue numbers */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#818cf8"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />

                {/* Right Y-Axis for small Order Count numbers */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#34d399"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />

                <Bar
                  yAxisId="left"
                  name="Revenue (৳)"
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={15}
                />
                <Bar
                  yAxisId="right"
                  name="Orders"
                  dataKey="orderCount"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. PIE CHART */}
        <div className="col-span-12 lg:col-span-4 bg-[#161926] p-6 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-lg font-semibold mb-6">Top Meals Share</h3>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.meals}
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {chartData.meals.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  layout="vertical"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
