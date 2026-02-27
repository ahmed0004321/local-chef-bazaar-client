import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router";
import { Button, Card, Container } from "../../Components/UI";
import { FaStar, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const MealForHome = () => {
  const axiosSecure = useAxiosSecure();
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/mealForHome");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <section className="py-16 md:py-24 relative bg-background">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Featured Kitchens
          </h2>
          <p className="text-foreground/70 text-lg">
            Explore top-rated meals from our finest local chefs. Fresh, hot, and ready to deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(meals) && meals.map((meal) => (
            <Card
              key={meal._id}
              className="p-0 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full bg-surface dark:bg-neutral-900 border border-neutral-100 dark:border-white/5"
              compact
            >
              <div className="relative overflow-hidden h-52 rounded-2xl m-2">
                <img
                  src={meal.foodImage}
                  alt={meal.foodName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-black text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  {meal.rating || 0}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {meal.foodName}
                  </h3>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center text-sm text-foreground/70 gap-2">
                    <FaUser className="text-primary/70 text-xs" />
                    <span className="truncate">{meal.chefName}</span>
                  </div>
                  <div className="flex items-center text-sm text-foreground/70 gap-2">
                    <FaMapMarkerAlt className="text-primary/70 text-xs" />
                    <span className="truncate">{meal.deliveryArea}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/10 mt-auto">
                  <span className="text-xl font-bold text-primary">
                    ৳{meal.price}
                  </span>
                  <Button
                    to={`/mealDetails/${meal._id}`}
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all rounded-full px-6"
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button to="/meals" variant="primary" size="lg" className="rounded-full shadow-xl shadow-primary/20">
            See All Meals
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default MealForHome;
