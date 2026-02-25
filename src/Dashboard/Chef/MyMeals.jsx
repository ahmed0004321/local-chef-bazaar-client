import React, { useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { Card, Button, Input } from "../../Components/UI";
import { FaEdit, FaTrash, FaStar, FaClock, FaUser, FaLeaf, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

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
        Swal.fire({
          title: "Success",
          text: "Meal updated successfully!",
          icon: "success",
          background: 'var(--surface)',
          color: 'var(--foreground)',
          confirmButtonColor: '#ff6600'
        });
        setIsOpen(false);
        refetch();
      } else {
        Swal.fire({
          title: "Info",
          text: "No changes were made.",
          icon: "info",
          background: 'var(--surface)',
          color: 'var(--foreground)',
          confirmButtonColor: '#ff6600'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to update meal.",
        icon: "error",
        background: 'var(--surface)',
        color: 'var(--foreground)'
      });
    }
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the meal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      background: 'var(--surface)',
      color: 'var(--foreground)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.delete(
            `/dashboard/myMeals/${id}`,
          );
          if (response.data.deletedCount) {
            Swal.fire({
              title: "Deleted!",
              text: "Meal has been deleted.",
              icon: "success",
              background: 'var(--surface)',
              color: 'var(--foreground)',
              confirmButtonColor: '#ff6600'
            });
            refetch();
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete meal.",
            icon: "error",
            background: 'var(--surface)',
            color: 'var(--foreground)'
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            My Kitchen
          </h1>
          <p className="text-foreground/60 mt-1">Manage your {myMeals.length} listed meals</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myMeals.map((meal) => (
          <Card key={meal._id} className="p-0 overflow-hidden flex flex-col h-full bg-surface border border-white/5 shadow-xl group hover:shadow-2xl transition-all duration-300">
            <div className="relative h-56 overflow-hidden">
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <FaStar className="text-yellow-400" /> {meal.rating}
              </div>
              <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                ৳{meal.price}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1 line-clamp-1">{meal.foodName}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60">
                  <span className="flex items-center gap-1"><FaClock className="text-primary/70" /> {meal.estimatedDeliveryTime}</span>
                  <span className="flex items-center gap-1"><FaUser className="text-primary/70" /> {meal.chefName}</span>
                </div>
                <div className="text-xs text-foreground/40 mt-1">ID: {meal.chefId}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {meal.ingredients?.map((item, idx) => (
                  <span key={idx} className="text-xs bg-neutral-100 dark:bg-white/5 text-foreground/80 px-2 py-1 rounded-md border border-neutral-200 dark:border-white/10 flex items-center gap-1">
                    <FaLeaf className="text-green-500/70 text-[10px]" /> {item}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-white/5 mt-auto">
                <Button
                  onClick={() => {
                    setSelectedMeal(meal);
                    setIsOpen(true);
                  }}
                  variant="primary"
                  className="flex-1 gap-2"
                >
                  <FaEdit /> Update
                </Button>
                <Button
                  onClick={() => handleDelete(meal._id)}
                  variant="outline"
                  className="flex-1 gap-2 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10"
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {myMeals.length === 0 && (
        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/10">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-foreground/70">No meals listed yet</h3>
          <p className="text-foreground/40 mt-2">Start cooking and add your first meal!</p>
        </div>
      )}

      {/* Update Modal */}
      {isOpen && selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="w-full max-w-3xl bg-surface border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-neutral-900/50">
              <h2 className="text-2xl font-bold text-foreground">Update Meal</h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-foreground transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit(handleUpdateMeal)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Food Name"
                  {...register("foodName")}
                  placeholder="e.g. Chicken Biryani"
                  containerClassName="w-full"
                />
                <Input
                  label="Chef Name"
                  {...register("chefName")}
                  containerClassName="w-full"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Food Image</label>
                  <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-white/5">
                    <input
                      type="file"
                      {...register("foodImage")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FaCloudUploadAlt className="text-4xl text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60 font-medium">Click to upload new image</p>
                    <p className="text-xs text-foreground/40 mt-1">Leave empty to keep current image</p>
                  </div>
                </div>

                <Input
                  label="Price"
                  type="number"
                  {...register("price")}
                  containerClassName="w-full"
                />
                <Input
                  label="Rating"
                  type="number"
                  {...register("rating")}
                  containerClassName="w-full"
                />
                <Input
                  label="Delivery Time"
                  {...register("estimatedDeliveryTime")}
                  placeholder="e.g. 30 mins"
                  containerClassName="w-full"
                />
                <Input
                  label="Chef Experience"
                  {...register("chefExperience")}
                  containerClassName="w-full"
                />
                <div className="md:col-span-2">
                  <Input
                    label="Ingredients (comma separated)"
                    {...register("ingredients")}
                    containerClassName="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Delivery Area"
                    {...register("deliveryArea")}
                    containerClassName="w-full"
                  />
                </div>

                {/* Read Only Fields */}
                <Input
                  label="Chef ID"
                  value={selectedMeal.chefId}
                  readOnly
                  disabled
                  containerClassName="w-full opacity-60"
                />
                <Input
                  label="User Email"
                  value={user?.data?.email}
                  readOnly
                  disabled
                  containerClassName="w-full opacity-60"
                />

                <div className="md:col-span-2 mt-4 pt-4 border-t border-white/5 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeals;
