import React from "react";
import useAxiosSecure from "../../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading/Loading";

const OrderPending = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orderPending"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/pendingOrder`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loading />
      </div>
    );
  }

  // Count orders
  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;
  const deliveredCount = orders.filter(
    (o) => o.orderStatus === "delivered",
  ).length;

  return (
    <div className="flex gap-6">
      {/* Pending Orders Card */}
      <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
        <h3 className="text-lg font-medium mb-2">Pending Orders</h3>
        <p className="text-4xl font-bold">{pendingCount}</p>
      </div>

      {/* Delivered Orders Card */}
      <div className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
        <h3 className="text-lg font-medium mb-2">Delivered Orders</h3>
        <p className="text-4xl font-bold">{deliveredCount}</p>
      </div>
    </div>
  );
};

export default OrderPending;
