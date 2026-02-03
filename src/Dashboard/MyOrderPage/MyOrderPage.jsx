import React, { use } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const MyOrderPage = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: order = [], isLoading } = useQuery({
    queryKey: ['/dashboard/myOrders', user?.data?.email],
    enabled: !!user?.data?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/myOrders?email=${user?.data?.email}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/dashboard/orderUpdate/${id}`, { paymentStatus: 'paid' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/dashboard/myOrders']);
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Thank you for your order.',
        icon: 'success',
        confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
      });
    }
  });

  const [payingId, setPayingId] = React.useState(null);

  const handlePay = async (orderItem) => {
    setPayingId(orderItem._id);
    try {
      const paymentData = {
        orderId: orderItem._id,
        mealName: orderItem.mealName,
        price: orderItem.price,
        userEmail: user?.data?.email,
      };

      const res = await axiosSecure.post('/create-checkout-session', paymentData);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to initiate payment.',
        icon: 'error',
        confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
      });
    } finally {
      setPayingId(null);
    }
  };

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
      <h1 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        My Orders <span className="badge badge-primary badge-lg">{order.length}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {order?.map((order) => (
          <div
            key={order._id}
            className="group relative bg-surface border border-white/5 rounded-2xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10 block">
              <span className={`badge font-bold border-0 ${order.orderStatus === 'active' || order.orderStatus === 'accepted' ? 'bg-green-500 text-white' :
                order.orderStatus === 'cancelled' ? 'bg-red-500 text-white' :
                  order.orderStatus === 'delivered' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="p-6 pt-12 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                  {order.mealName}
                </h2>
                <div className="text-xs text-foreground/50 font-mono uppercase tracking-wider">
                  ID: {order._id.slice(-6)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-900/40 p-3 rounded-xl border border-white/5">
                <div>
                  <p className="text-foreground/50 text-xs">Quantity</p>
                  <p className="font-bold text-foreground">{order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground/50 text-xs">Total Price</p>
                  <p className="font-bold text-primary text-lg">৳{order.price}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-foreground/70">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Ordered Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chef ID</span>
                  <span className="font-mono text-xs opacity-60">{order.chefId}</span>
                </div>
              </div>

              {/* Payment Status & Action */}
              <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-warning'}`}></div>
                  <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-warning'}`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>

                {(order.orderStatus === 'accepted' || order.orderStatus === 'pending') && order.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => handlePay(order)}
                    disabled={payingId === order._id}
                    className="btn btn-sm btn-primary shadow-lg shadow-primary/20"
                  >
                    {payingId === order._id ? <span className="loading loading-spinner loading-xs"></span> : 'Pay Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default MyOrderPage;
