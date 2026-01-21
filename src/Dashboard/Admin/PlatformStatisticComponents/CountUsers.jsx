import React, { use } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import useAxiosSecure from "../../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading/Loading";

const CountUsers = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["countUser"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/countUser`);
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

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Total Users: {users.length}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-4 p-4 rounded-lg shadow hover:shadow-md transition bg-white"
          >
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
              {u.photoURL ? (
                <img
                  src={u.photoURL}
                  alt={u.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-600">
                  {u.displayName?.charAt(0) || "U"}
                </span>
              )}
            </div>

            {/* User Info */}
            <div>
              <p className="font-semibold text-gray-800">
                {u.displayName || u.name}
              </p>
              <p className="text-gray-500 text-sm">{u.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountUsers;
