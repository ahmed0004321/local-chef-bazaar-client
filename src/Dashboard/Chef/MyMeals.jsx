import React, { useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";

const MyMeals = () => {
  const { user } = React.useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const {
    data: myMeals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myMeals"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/myMeals?email=${user?.data?.email}`,
      );
      return res.data;
    },
  });

  const { register, handleSubmit, reset } = useForm();

  // Reset form when modal opens
  useEffect(() => {
    if (selectedMeal) {
      reset({
        foodName: selectedMeal.foodName,
        chefName: selectedMeal.chefName,
        price: selectedMeal.price,
        rating: selectedMeal.rating,
        estimatedDeliveryTime: selectedMeal.estimatedDeliveryTime,
        ingredients: selectedMeal.ingredients?.join(", "),
        chefExperience: selectedMeal.chefExperience,
        deliveryArea: selectedMeal.deliveryArea,
      });
    }
  }, [selectedMeal, reset]);

  const handleUpdateMeal = async (data) => {
    try {
      const updatedMealData = {
        ...data,
        ingredients: data.ingredients.split(",").map((i) => i.trim()),
        price: parseFloat(data.price),
        rating: data.rating ? parseFloat(data.rating) : 0,
      };

      // Handle image upload
      if (data.foodImage && data.foodImage[0]) {
        const formData = new FormData();
        formData.append("image", data.foodImage[0]);
        const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
        const res = await fetch(url, { method: "POST", body: formData });
        const imgData = await res.json();
        updatedMealData.foodImage = imgData.data.display_url;
      } else {
        updatedMealData.foodImage = selectedMeal.foodImage;
      }

      const response = await axiosSecure.patch(
        `/dashboard/myMeals/${selectedMeal._id}`,
        updatedMealData,
      );

      if (response.data.modifiedCount) {
        Swal.fire("Success", "Meal updated successfully!", "success");
        setIsOpen(false);
        refetch();
      } else {
        Swal.fire("Info", "No changes were made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update meal.", "error");
    }
  };
  const handleDelete = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the meal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.delete(
            `/dashboard/myMeals/${id}`,
          );
          if (response.data.deletedCount) {
            Swal.fire("Deleted!", "Meal has been deleted.", "success");
            refetch();
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to delete meal.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        My Meals ({myMeals.length})
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myMeals.map((meal) => (
          <div
            key={meal._id}
            className="backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl bg-white/10 border border-white/20"
          >
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-56 object-cover"
            />

            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-white">
                  {meal.foodName}
                </h2>
                <span className="text-yellow-400 font-semibold">
                  ⭐ {meal.rating}
                </span>
              </div>

              <p className="text-green-400 font-bold text-lg">৳{meal.price}</p>
              <p className="text-sm text-gray-300">
                ⏱ {meal.estimatedDeliveryTime}
              </p>
              <p className="text-sm text-gray-300">
                👨‍🍳 {meal.chefName} ({meal.chefId})
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {meal.ingredients?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/10 text-white px-3 py-1 rounded-full border border-white/20"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="btn btn-primary flex-1 py-2 rounded-lg text-white font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedMeal(meal);
                    setIsOpen(true);
                  }}
                  className="flex-1 py-2 rounded-lg btn btn-secondary text-white font-semibold"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && selectedMeal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Update Meal
            </h2>

            <form
              onSubmit={handleSubmit(handleUpdateMeal)}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <input
                {...register("foodName")}
                placeholder="Food Name"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                {...register("chefName")}
                placeholder="Chef Name"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                type="file"
                {...register("foodImage")}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-600 bg-white/20 text-white rounded-lg border border-white/30 cursor-pointer"
              />
              <input
                type="number"
                {...register("price")}
                placeholder="Price"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                type="number"
                {...register("rating")}
                placeholder="Rating"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                {...register("estimatedDeliveryTime")}
                placeholder="Estimated Delivery Time"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                {...register("ingredients")}
                placeholder="Ingredients (comma separated)"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white md:col-span-2"
              />
              <input
                {...register("chefExperience")}
                placeholder="Chef Experience"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
              />
              <input
                value={selectedMeal.chefId}
                readOnly
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white/70"
              />
              <input
                value={user?.data?.email}
                readOnly
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white/70 md:col-span-2"
              />
              <input
                {...register("deliveryArea")}
                placeholder="Delivery Area"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white md:col-span-2"
              />

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition duration-300"
                >
                  Update Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeals;
