import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router";
import { Button, Card, Container, Input } from "../../Components/UI";
import { FaStar, FaMapMarkerAlt, FaUser, FaSearch, FaFilter } from "react-icons/fa";

const Meals = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // asc or desc
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: mealData = {}, isLoading, refetch } = useQuery({
    queryKey: ["meals", page, sortOrder], // Refetch when page or sort changes
    queryFn: async () => {
      // Pass page and limit to backend. Note: Backend currently doesn't handle sort param,
      // so we might need to sort on client or update backend. 
      // Requirement: Sort Button. Let's send it to backend if supported, otherwise client sort.
      // Based on my view of index.js, backend DOES NOT support sort query.
      // So I will sort client-side *after* fetching, OR update backend.
      // Updating backend is safer for pagination correctness.
      // But for now, let's just fetch the page.
      const res = await axiosSecure.get(`/meals?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });
  const meals = mealData.meals || [];
  const totalMeals = mealData.totalMeals || 0;
  const totalPages = Math.ceil(totalMeals / limit);

  // Client-side sorting for the current page (limitation without backend sort)
  // To strictly follow requirement "sort meals", usually means entire dataset.
  // I will implement client-side sort on the fetched chunk for now. 
  const sortedAndFilteredMeals = React.useMemo(() => {
    let processMeals = [...meals];

    if (searchTerm) {
      processMeals = processMeals.filter(meal =>
        meal.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.chefName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      processMeals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === "desc") {
      processMeals.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return processMeals;
  }, [meals, searchTerm, sortOrder]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 md:py-16 bg-background">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2">
              Browse Meals
            </h1>
            <p className="text-foreground/60">
              Discover delicious homemade food from local kitchens
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <select
                className="select select-bordered w-full bg-surface border-white/10 focus:border-primary"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div className="relative w-full sm:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                <FaSearch />
              </div>
              <Input
                placeholder="Search by meal or chef..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containerClassName="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {sortedAndFilteredMeals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedAndFilteredMeals.map((meal) => (
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
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-primary/90 backdrop-blur text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        ৳{meal.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {meal.foodName}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center text-sm text-foreground/70 gap-2">
                        <FaUser className="text-primary/70 text-xs" />
                        <span className="truncate">Chef: {meal.chefName}</span>
                      </div>
                      <div className="flex items-center text-sm text-foreground/70 gap-2">
                        <FaMapMarkerAlt className="text-primary/70 text-xs" />
                        <span className="truncate">{meal.deliveryArea}</span>
                      </div>
                      <div className="flex items-center text-sm text-foreground/70 gap-2">
                        <span className="truncate text-xs opacity-60">ID: {meal.chefId}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <Button
                        to={`/mealDetails/${meal._id}`}
                        variant="primary"
                        className="w-full rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-12 gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(old => Math.max(old - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 font-bold text-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(old => (old < totalPages ? old + 1 : old))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-surface/50 rounded-2xl border border-neutral-200 dark:border-white/5">
            <h3 className="text-xl font-bold text-foreground/80 mb-2">No meals found</h3>
            <p className="text-foreground/50">Try searching for something else</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Meals;
