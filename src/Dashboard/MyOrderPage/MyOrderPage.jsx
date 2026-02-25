import React, { use, useState } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaFileInvoice,
  FaFileExport,
  FaAngleDown,
  FaEllipsisH,
  FaEye,
  FaCreditCard,
  FaPlus,
  FaTimes
} from "react-icons/fa";

const MyOrderPage = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
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
        confirmButtonColor: "#f38b0c"
      });
    }
  });

  const [payingId, setPayingId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Payment Logic
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
        confirmButtonColor: "#f38b0c"
      });
    } finally {
      setPayingId(null);
    }
  };

  // Selection Logic
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const toggleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // View / Edit Order Logic
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Filtered Data Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.orderStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-sm text-gray-500">Every Order Counts</p>
        </div>
      </div>


      {/* Order List Container */}
      <div className="bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-white/10 overflow-hidden">

        {/* List Header & Search */}
        <div className="p-4 border-b border-neutral-200 dark:border-white/10 space-y-4">
          <h2 className="text-lg font-bold">Order list</h2>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search by Parcel ID, Name, or Phone..."
              className="input input-bordered w-full pl-10 bg-transparent focus:outline-none focus:border-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1
              }}
            />
          </div>

          {/* Bulk Selection Bar */}
          {selectedOrders.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-blue-700 dark:text-blue-400">
              <span className="font-semibold">{selectedOrders.length} Orders Selected</span>
              <div className="flex gap-2">
                <button className="btn btn-sm bg-white border-0 hover:bg-gray-50 text-gray-700 shadow-sm gap-2">
                  <FaFileInvoice /> Invoice Print
                </button>
                <button className="btn btn-sm bg-white border-0 hover:bg-gray-50 text-gray-700 shadow-sm gap-2">
                  <FaFileExport /> Export(CSV)
                </button>
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-sm bg-white border-0 hover:bg-gray-50 text-gray-700 shadow-sm gap-2">
                    Bulk Action <FaAngleDown />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="table w-full">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <th className="w-12">
                  <label>
                    <input type="checkbox" className="checkbox checkbox-sm border-white" onChange={toggleSelectAll} checked={selectedOrders.length === orders.length && orders.length > 0} />
                  </label>
                </th>
                <th>Order ID</th>
                <th>Customer Info</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50 dark:hover:bg-white/5 border-b border-neutral-100 dark:border-white/5 transition-colors">
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOrder(order._id)}
                        />
                      </label>
                    </th>
                    <td>
                      <span className="font-bold text-gray-700 dark:text-gray-300">#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td>
                      <div className="font-bold text-sm">{order.mealName}</div>
                      {/* Using logged in user info as placeholder for Customer Info since this is 'My Orders' */}
                      <div className="text-xs text-gray-500">{user?.displayName || "Local Chef User"}</div>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <div className="font-bold text-lg">৳ {order.price}</div>
                      <div className="text-[10px] text-gray-400">Qty: {order.quantity}</div>
                    </td>
                    <td>
                      <div className={`badge gap-1 p-3 font-medium border-0
                            ${order.orderStatus === 'active' || order.orderStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            order.orderStatus === 'delivered' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.orderStatus}
                      </div>
                      {order.paymentStatus === 'paid' ?
                        <div className="text-[10px] text-green-600 mt-1 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>Paid</div> :
                        <div className="text-[10px] text-orange-500 mt-1 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>Unpaid</div>
                      }
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {/* Pay Action */}
                        {(order.orderStatus === 'accepted' || order.orderStatus === 'pending') && order.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handlePay(order)}
                            disabled={payingId === order._id}
                            className="btn btn-xs btn-primary text-white"
                            title="Pay Now"
                          >
                            {payingId === order._id ? <span className="loading loading-spinner loading-xs"></span> : <FaCreditCard />} Pay
                          </button>
                        )}

                        {/* View Details Action */}
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="btn btn-square btn-ghost btn-sm text-gray-500 hover:text-primary hover:bg-primary/10"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredOrders.length > itemsPerPage && (
          <div className="p-4 border-t border-neutral-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>
              Showing <span className="font-bold text-gray-800 dark:text-gray-200">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span> of <span className="font-bold text-gray-800 dark:text-gray-200">{filteredOrders.length}</span> Orders
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm btn-ghost"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-primary text-white" : "btn-ghost"}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="join-item btn btn-sm btn-ghost"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View/Edit Order Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up">

            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-white/10">
              <h3 className="font-bold text-xl">Order Details #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meal Name</p>
                <p className="font-bold text-lg">{selectedOrder.mealName}</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                <p className="font-bold text-xl text-primary">৳ {selectedOrder.price}</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quantity</p>
                <p className="font-bold">{selectedOrder.quantity}</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`badge ${selectedOrder.orderStatus === 'accepted' ? 'badge-success' : 'badge-warning'} badge-lg border-0`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="md:col-span-2 p-4 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="font-medium text-sm">{selectedOrder.address || "No address details available."}</p>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-white/10 flex justify-end gap-2 bg-neutral-50/50 dark:bg-black/20">
              <button className="btn btn-ghost" onClick={closeModal}>Close</button>
              <button className="btn btn-primary text-white shadow-lg shadow-primary/20">Download Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;
