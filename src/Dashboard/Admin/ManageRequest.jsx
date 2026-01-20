import { use } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const ManageRequest = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const {
    data: roleRequest = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["roleRequest"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/getRoleRequest`);
      return res.data;
    },
  });
  const approveRequest = async (requestId) => {
    try {
      const res = await axiosSecure.patch(`/dashboard/beChef/${requestId}`);

      Swal.fire({
        icon: res.data?.message?.includes("already") ? "info" : "success",
        title: res.data?.message || "Request approved",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to approve request",
      });
    }
  };

  const getRejected = async (requestId) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You want to reject this request",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Reject",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) return;

      const res = await axiosSecure.patch(
        `/dashboard/rejectRoleRequest/${requestId}`,
      );

      Swal.fire({
        icon: res.data?.message?.includes("already") ? "info" : "success",
        title: res.data?.message || "Request rejected",
        timer: 1200,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to reject request",
      });
    }
  };

  console.log(roleRequest);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Requests</h2>

      <div className="overflow-x-auto rounded-xl border border-white/20">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Request Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Request Time</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roleRequest.map((req) => {
              const isDisabled = req.requestStatus !== "pending";

              return (
                <tr
                  key={req._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{req.userName}</td>
                  <td className="px-4 py-3">{req.userEmail}</td>

                  <td className="px-4 py-3 capitalize">{req.requestType}</td>

                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            req.requestStatus === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : req.requestStatus === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                    >
                      {req.requestStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">{req.requestTime}</td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => approveRequest(req._id)}
                        disabled={isDisabled}
                        className={`px-4 btn py-2 rounded-lg text-sm font-semibold transition
                            ${
                              isDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => getRejected(req._id)}
                        disabled={isDisabled}
                        className={` btn px-4 py-2 rounded-lg text-sm font-semibold transition
                            ${
                              isDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequest;
