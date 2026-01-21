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

    payments.forEach((p) => {
      const date = new Date(p.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });

      // Aggregate both Revenue and Order Count
      if (!dailyMap[date]) {
        dailyMap[date] = { date, revenue: 0, orderCount: 0 };
      }
      dailyMap[date].revenue += p.price;
      dailyMap[date].orderCount += 1;

      mealMap[p.mealName] = (mealMap[p.mealName] || 0) + p.price;
    });

    return {
      daily: Object.values(dailyMap),
      meals: Object.keys(mealMap).map((name) => ({
        name,
        value: mealMap[name],
      })),
    };
  }, [payments]);

  const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  if (isLoading) return <Loading />;

  const totalRev = payments.reduce((s, i) => s + i.price, 0);

  return (
    <div className="p-4 md:p-8 bg-[#0f111a] min-h-screen text-slate-200">
      <div className="mb-8 border-b border-white/5 pb-6 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
        <p className="text-slate-400 mt-1">
          Multi-metric comparison of revenue and volume.
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

        {/* 2. MULTI-BAR CHART (REVENUE VS ORDERS) */}
        <div className="col-span-12 lg:col-span-8 bg-[#161926] p-6 rounded-3xl border border-white/5 min-w-0 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Performance Comparison</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span>{" "}
                Revenue
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-400 rounded-sm"></span>{" "}
                Orders
              </div>
            </div>
          </div>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="99%" height="100%">
              <BarChart
                data={chartData.daily}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff05"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#818cf8"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#34d399"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                />
                {/* Revenue Bar */}
                <Bar
                  yAxisId="left"
                  name="Revenue (৳)"
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                {/* Order Count Bar */}
                <Bar
                  yAxisId="right"
                  name="Order Count"
                  dataKey="orderCount"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. PIE CHART SECTION */}
        <div className="col-span-12 lg:col-span-4 bg-[#161926] p-6 rounded-3xl border border-white/5 min-w-0 shadow-2xl">
          <h3 className="text-lg font-semibold mb-6">Revenue Share</h3>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.meals}
                  innerRadius={70}
                  outerRadius={95}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.meals.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
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
