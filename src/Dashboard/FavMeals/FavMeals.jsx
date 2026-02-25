import React, { use } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";
import { AuthContext } from "../../Context/AuthContext";
import { Card, Button, Container } from "../../Components/UI";
import { FaTrash, FaStar, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import Swal from "sweetalert2";

const FavMeals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const {
    data: favMeals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["favMeals", user?.data?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favMeal?email=${user?.data?.email}`);
      return res.data;
    },
    enabled: !!user?.data?.email
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Remove from favorites?',
      text: "You can always add it back later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      background: 'var(--surface)',
      color: 'var(--foreground)'
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/favMeal/${id}`);
        Swal.fire({
          title: 'Removed!',
          text: 'Meal removed from favorites.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--surface)',
          color: 'var(--foreground)'
        });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          My Favorites
        </h1>
        <p className="text-foreground/60 mt-1">Found {favMeals.length} meals you loved</p>
      </div>

      {favMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {favMeals.map((fav) => (
            <Card key={fav._id} className="p-0 overflow-hidden flex flex-col h-full bg-surface border border-white/5 shadow-xl group hover:shadow-2xl transition-all duration-300">
              <div className="relative h-52 rounded-2xl m-2 overflow-hidden">
                <img
                  src={fav.mealDetails?.foodImage}
                  alt={fav.mealDetails?.foodName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <FaStar className="text-yellow-400" /> {fav.mealDetails?.rating || 0}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground line-clamp-1">{fav.mealDetails?.foodName}</h3>
                    <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                      <FaUtensils className="text-primary/70 text-xs" /> {fav.mealDetails?.chefName}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary">৳{fav.mealDetails?.price}</div>
                </div>

                <div className="flex items-center text-sm text-foreground/50 gap-2">
                  <FaMapMarkerAlt className="text-secondary/70" />
                  <span className="truncate">{fav.mealDetails?.deliveryArea}</span>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-auto">
                  <span className="text-xs text-foreground/40 italic">Added {new Date(fav.created_at).toLocaleDateString()}</span>
                  <Button
                    onClick={() => handleDelete(fav._id)}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <FaTrash className="text-xs" /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface/30 rounded-3xl border border-dashed border-white/10 max-w-2xl mx-auto">
          <div className="text-7xl mb-6">💖</div>
          <h3 className="text-2xl font-bold text-foreground">Nothing here yet</h3>
          <p className="text-foreground/50 mt-2 max-w-sm mx-auto">
            You haven't saved any meals yet. Start exploring and click the heart icon on any meal you like!
          </p>
          <Button to="/meals" variant="primary" className="mt-8 shadow-xl shadow-primary/20">
            Browse Meals
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavMeals;
