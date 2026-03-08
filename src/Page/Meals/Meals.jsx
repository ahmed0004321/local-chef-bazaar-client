import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router";
import { Button, Card, Container, Input, Skeleton } from "../../Components/UI";
import { FaStar, FaMapMarkerAlt, FaUser, FaSearch, FaFilter } from "react-icons/fa";
import MealCard from "../../Components/Meals/MealCard";
import MealCardSkeleton from "../../Components/Meals/MealCardSkeleton";

const Meals = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // asc or desc
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: mealData = {}, isLoading, refetch } = useQuery({
    queryKey: ["meals", page, sortOrder, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals`, {
        params: {
          page,
          limit,
          sort: sortOrder,
          searchTerm,
        }
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const meals = mealData.meals || [];
  const totalMeals = mealData.totalMeals || 0;
  const totalPages = Math.ceil(totalMeals / limit);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1); // Reset to first page on sort change
  };

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen py-12 md:py-16 bg-background">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <Skeleton className="h-12 w-64" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-60" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Container>
        {/* Header Section */}
        <div className="relative z-10 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 trekking-tight">
                Global <span className="text-primary italic">Bazaar.</span>
              </h1>
              <p className="text-foreground/50 text-lg font-medium">
                Sift through local treasures. Search by flavors or sort by investment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Sort Order */}
              <select
                className="select select-bordered h-14 bg-surface/50 backdrop-blur-md border-white/10 rounded-2xl font-bold focus:border-primary transition-all pr-10 min-w-[200px]"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="">Sort: Default</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>

              {/* Search */}
              <div className="relative grow sm:w-80">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                  <FaSearch />
                </div>
                <Input
                  placeholder="Search flavors..."
                  className="pl-12 h-14 rounded-2xl bg-surface/50 backdrop-blur-md border-white/10 focus:border-primary"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <MealCardSkeleton key={i} />
              ))}
            </div>
          ) : meals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal._id} meal={meal} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className="rounded-2xl px-10 h-14 font-bold border-white/10 hover:border-primary transition-all"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-8 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/10 font-bold text-foreground">
                    {page} <span className="mx-2 text-foreground/30">/</span> {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(old => (old < totalPages ? old + 1 : old))}
                    disabled={page === totalPages}
                    className="rounded-2xl px-10 h-14 font-bold border-white/10 hover:border-primary transition-all"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-surface/20 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl text-primary animate-pulse">
                <FaSearch />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4">No treasures found</h3>
              <p className="text-foreground/40 text-lg font-medium max-w-md mx-auto">We couldn't find any matches for your current selection. Try broadening your horizon or searching for different flavors.</p>
              <Button
                variant="ghost"
                className="mt-10 font-bold text-primary underline underline-offset-8"
                onClick={() => {
                  setSearchTerm("");
                  setSortOrder("");
                  setPage(1);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Meals;
