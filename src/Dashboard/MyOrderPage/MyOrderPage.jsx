import React, { use } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";

const MyOrderPage = () => {
    const {user} = use(AuthContext);
    console.log(user);
    const axiosSecure = useAxiosSecure();
    const { data: order = [], isLoading } = useQuery({
        queryKey: ['/dashboard/myOrders', user?.data?.email],
        enabled: !!user?.data?.email,
        queryFn: async () => {
          const res = await axiosSecure.get(`/dashboard/myOrders?email=${user?.data?.email}`);
          return res.data;
        },
      });
      console.log(order);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        My Orders ({order.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {order?.map((order) => (
          <div
            key={order._id}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-5 hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Food Name */}
            <h2 className="text-lg font-semibold text-white mb-2">
              {order.mealName}
            </h2>

            {/* Order Status */}
            <p className="text-sm text-gray-200">
              <span className="font-medium">Order Status:</span>{" "}
              {order.orderStatus}
            </p>

            {/* Price */}
            <p className="text-sm text-gray-200">
              <span className="font-medium">Price:</span> ৳{order.price}
            </p>

            {/* Quantity */}
            <p className="text-sm text-gray-200">
              <span className="font-medium">Quantity:</span>{" "}
              {order.quantity}
            </p>

            {/* Delivery Time */}
            <p className="text-sm text-gray-200">
              <span className="font-medium">Delivery Time:</span>{" "}
              {order.created_at}
            </p>

             

            <p className="text-sm text-gray-200">
              <span className="font-medium">Chef ID:</span>{" "}
              {order.chefId}
            </p>

            {/* Payment Status */}
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm text-gray-200">
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentStatus}
              </span>

              <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white">
                {order.orderStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrderPage;
