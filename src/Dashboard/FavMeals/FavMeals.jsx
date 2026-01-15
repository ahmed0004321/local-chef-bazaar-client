import React, { use } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import { AuthContext } from "../../Context/AuthContext";

const FavMeals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const {
    data: favMeals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["favMeals"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favMeal?email=${user?.data?.email}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await axiosSecure.delete(`/favMeal/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        My Favorite Meals
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-white/20 text-white">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 border-b border-white/20 text-left">
                Meal Name
              </th>
              <th className="px-4 py-2 border-b border-white/20 text-left">
                Chef Name
              </th>
              <th className="px-4 py-2 border-b border-white/20 text-left">
                Price
              </th>
              <th className="px-4 py-2 border-b border-white/20 text-left">
                Date Added
              </th>
              <th className="px-4 py-2 border-b border-white/20 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {favMeals.length > 0 ? (
              favMeals.map((meal) => (
                <tr key={meal._id} className="hover:bg-white/10 transition">
                  <td className="px-4 py-2 border-b border-white/20">
                    {meal.mealName}
                  </td>
                  <td className="px-4 py-2 border-b border-white/20">
                    {meal.chefName}
                  </td>
                  <td className="px-4 py-2 border-b border-white/20">
                    ৳{meal.price || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-white/20">
                    {new Date(meal.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b border-white/20">
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No favorite meals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavMeals;
