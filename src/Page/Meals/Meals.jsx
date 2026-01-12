import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router";

const Meals = () => {
  const axiosSecure = useAxiosSecure();
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals");
      return res.data;
    },
  });
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
        Total Meals: {meals.length}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-4 hover:scale-[1.02] transition-transform duration-300"
          >
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-44 object-cover rounded-xl mb-4"
            />

            <h2 className="text-lg font-semibold text-white">
              {meal.foodName}
            </h2>

            <p className="text-sm text-gray-200 mt-1">Chef: {meal.chefName}</p>

            <p className="text-sm text-gray-200">
              Delivery Area: {meal.deliveryArea}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-white">
                $ {meal.price}
              </span>

              <span className="text-sm text-yellow-300">
                ⭐ {meal.rating || 0}
              </span>
            </div>
            <Link to={`/mealDetails/${meal._id}`}>
              <button className="w-full mt-4 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
                See Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
