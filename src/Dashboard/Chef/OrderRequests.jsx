import React, { use } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const OrderRequests = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const {
    data: orderRequest = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/dashboard/orderRequest", user?.data?.chefId],
    enabled: !!user?.data?.chefId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/orderRequest/${user?.data?.chefId}`,
      );
      return res.data;
    },
  });

  const handleUpdate = async (orderId, status) => {
    try {
      await axiosSecure.patch(`/dashboard/orderUpdate/${orderId}`, { status });

      // Optional: alert
      Swal.fire({
        title: "Success",
        text: `Order ${status} successfully`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch(); // Live update for chef and user
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to update order status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  console.log(orderRequest);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Order Requests ({orderRequest.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orderRequest.map((order) => {
          const isCancelled = order.orderStatus === "cancelled";
          const isAccepted = order.orderStatus === "accepted";
          const isDelivered = order.orderStatus === "delivered";

          return (
            <div
              key={order._id}
              className="backdrop-blur-lg rounded-3xl shadow-xl bg-white/10 border border-white/20 p-5 space-y-3"
            >
              <h2 className="text-xl font-bold text-white">{order.foodName}</h2>
              <p className="text-green-400 font-bold">৳{order.price}</p>
              <p className="text-gray-300">Quantity: {order.quantity}</p>
              <p className="text-gray-300">
                Status:{" "}
                <span className="font-semibold text-yellow-400">
                  {order.orderStatus}
                </span>
              </p>
              <p className="text-gray-300">User: {order.userEmail}</p>
              <p className="text-gray-300">Address: {order.userAddress}</p>
              <p className="text-gray-300">
                Order Time: {new Date(order.orderTime).toLocaleString()}
              </p>
              <p className="text-gray-300">Payment: {order.paymentStatus}</p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {/* Cancel */}
                <button
                  disabled={isAccepted || isDelivered || isCancelled}
                  onClick={() => handleUpdate(order._id, "cancelled")}
                  className="flex-1 py-2 rounded-lg bg-red-600/80 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                {/* Accept */}
                <button
                  disabled={isAccepted || isDelivered || isCancelled}
                  onClick={() => handleUpdate(order._id, "accepted")}
                  className="flex-1 py-2 rounded-lg bg-blue-600/80 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Accept
                </button>

                {/* Deliver */}
                <button
                  disabled={!isAccepted || isDelivered || isCancelled}
                  onClick={() => handleUpdate(order._id, "delivered")}
                  className="flex-1 py-2 rounded-lg bg-green-600/80 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Deliver
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderRequests;
