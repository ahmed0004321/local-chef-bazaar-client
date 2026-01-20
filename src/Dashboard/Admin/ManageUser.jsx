import React, { use } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const ManageUser = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const {
    data: manageUser = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manageUser"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/manageUser`);
      return res.data;
    },
  });
  const updateUserFraud = async (id) => {
    try {
      const response = await axiosSecure.patch(
        `/dashboard/manageUserRoleFraud/${id}`,
      );

      // Success alert
      Swal.fire({
        title: "Success",
        text: "User marked as fraud successfully",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      refetch(); // refresh table
      return response.data;
    } catch (err) {
      console.error(err);

      // Error alert
      Swal.fire({
        title: "Error",
        text: "Failed to mark user as fraud",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  console.log(manageUser);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>

      <div className="overflow-x-auto rounded-xl border border-neutral-700/40">
        <table className="table w-full text-neutral-200">
          <thead className="bg-neutral-900/60 text-neutral-300">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Role</th>
              <th>User Status</th>
              <th>Make Fraud</th>
            </tr>
          </thead>

          <tbody>
            {manageUser.map((user, index) => (
              <tr key={user._id} className="hover:bg-neutral-800/40">
                <td>{index + 1}</td>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>
                <td>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => updateUserFraud(user._id)}
                      disabled={user.status === "fraud"}
                      className={`btn px-4 py-1.5 rounded-md text-white text-sm ${
                        user.status === "fraud"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-sky-600"
                      }`}
                    >
                      Make Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
