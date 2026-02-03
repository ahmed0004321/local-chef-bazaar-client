
import React, { use } from 'react';
import useAxiosSecure from '../../Hooks/AxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';
import Swal from 'sweetalert2';
import Loading from '../../Components/Loading/Loading';

const OrderRequests = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orderRequests', user?.data?.chefId],
    enabled: !!user?.data?.chefId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/orderRequest/${user?.data?.chefId}`);
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axiosSecure.patch(`/dashboard/orderUpdate/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orderRequests']);
      Swal.fire({
        title: 'Success!',
        text: 'Order status updated.',
        icon: 'success',
        confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)'
      });
    }
  });

  const handleStatusUpdate = (id, status) => {
    mutation.mutate({ id, status });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full p-4 md:p-5">
      <h2 className="text-2xl md:text-3xl font-bold mb-5">Order Requests</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Qty</th>
              <th>Total Price</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  <div className="font-bold">{order.mealName}</div>
                  <div className="text-sm opacity-50">{order.created_at?.split('T')[0]}</div>
                </td>
                <td>{order.quantity}</td>
                <td>৳{order.price * order.quantity}</td>
                <td>
                  <div>{order.userEmail}</div>
                  <div className="text-xs">{order.userAddress}</div>
                </td>
                <td>
                  <span className={`badge ${order.orderStatus === 'active' ? 'badge-success' :
                    order.orderStatus === 'cancelled' ? 'badge-error' :
                      order.orderStatus === 'delivered' ? 'badge-info' : 'badge-ghost'
                    }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="capitalize">{order.paymentStatus}</td>
                <td>
                  <div className="join lg:join-horizontal join-vertical w-full lg:w-auto">
                    <button
                      disabled={order.orderStatus !== 'pending'}
                      onClick={() => handleStatusUpdate(order._id, 'accepted')}
                      className="btn btn-xs btn-success join-item disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      disabled={order.orderStatus !== 'accepted'}
                      onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      className="btn btn-xs btn-info join-item disabled:opacity-50"
                    >
                      Deliver
                    </button>
                    <button
                      disabled={order.orderStatus !== 'pending'}
                      onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                      className="btn btn-xs btn-error join-item disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderRequests;
