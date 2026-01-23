import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";

const MealDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [userAddress, setUserAddress] = useState("");
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  console.log(reviews, user);
  console.log(user?.data?.email);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: mealDetails = {}, isLoading } = useQuery({
    queryKey: ["mealDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mealDetails/${id}`);
      return res.data;
    },
  });

  // Calculate total price based on quantity
  const totalPrice = (mealDetails.price * quantity).toFixed(2);

  //for review
  const submitReview = async (e) => {
    e.preventDefault();

    const reviewText = e.target.review.value;
    let rating = Number(e.target.rating.value);

    // Ensure rating is between 1 and 5
    if (rating < 1) rating = 1;
    if (rating > 5) rating = 5;

    const reviewData = {
      text: reviewText,
      rating: rating,
      userName: user?.data?.displayName,
      userEmail: user?.data?.email,
      userImage: user?.data?.photoURL,
    };

    try {
      const res = await axiosSecure.post(`/mealReviews/${id}`, reviewData);
      console.log(res.data);
      setIsModalOpen(false);
      e.target.reset();
      Swal.fire({
        icon: "success",
        title: "Review submitted!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Update reviews list immediately
      setReviews((prev) => [
        ...prev,
        { ...reviewData, _id: res.data.insertedId, created_at: new Date() },
      ]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to submit review",
        text: error.message,
      });
    }
  };

  // Handle order submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!userAddress.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Address Required",
        text: "Please enter your delivery address",
      });
      return;
    }

    // Show confirmation
    const result = await Swal.fire({
      title: "Confirm Order",
      html: `
        <p>Your total price is <strong>৳${totalPrice}</strong></p>
        <p>Do you want to confirm the order?</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Confirm!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const orderData = {
        foodId: mealDetails._id,
        mealName: mealDetails.foodName,
        price: totalPrice,
        quantity: quantity,
        chefId: mealDetails.chefId,
        paymentStatus: "unpaid",
        userEmail: user?.data?.email,
        userAddress: userAddress,
        orderStatus: "pending",
      };
      console.log(orderData);
      try {
        const res = await axiosSecure.post("/myOrders", orderData);
        console.log(res.data);

        Swal.fire({
          icon: "success",
          title: "Order placed successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset and close modal
        setIsOrderModalOpen(false);
        setQuantity(1);
        setUserAddress("");
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Failed to place order",
          text: error.message,
        });
      }
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get(`/mealReviews?mealId=${id}`);
        console.log(res.data);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [axiosSecure, id]);

  const handleFavoriteMeal = async () => {
    try {
      const res = await axiosSecure.post(`/favMeal/${id}`, {
        email: user?.data?.email,
      });
      console.log("Favorite added:", res.data.message);
      Swal.fire({
        title: "Favorite Meal Added!",
        text: "Your comment has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#ffffff",
      });
    } catch (error) {
      // Check if the error is a duplicate (409)
      if (error.response && error.response.status === 409) {
        console.log("Meal already exists in favorites");
      } else {
        Swal.fire({
          title: "sorry!",
          text: "Favorite meal already exist.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#ffffff",
        });
        console.error("Error adding favorite");
      }
    }
  };

  const handleDisabledButtonForOrder = () => {
    Swal.fire({
      title: "sorry!",
      text: "You are Fraud. You can't Order anything!.",
      icon: "error",
      confirmButtonText: "OK",
      background: "#1f2937",
      color: "#ffffff",
    });
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Image and Quick Info */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Large Image */}
            <div className="lg:col-span-3 p-6">
              <div className="relative">
                <img
                  src={mealDetails.foodImage}
                  alt={mealDetails.foodName}
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute top-4 right-4 backdrop-blur-md bg-yellow-500/30 px-4 py-2 rounded-xl border border-yellow-500/50 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-2xl font-bold text-white">
                      {mealDetails.rating || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Sidebar */}
            <div className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                  {mealDetails.foodName}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    ${mealDetails.price}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-400">Delivery Time</p>
                        <p className="text-lg font-semibold text-white">
                          {mealDetails.estimatedDeliveryTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-400">Delivery Area</p>
                        <p className="text-lg font-semibold text-white">
                          {mealDetails.deliveryArea}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {user?.data?.status !== "fraud" ? (
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                     Order Now
                  </button>
                ) : (
                  <div
                    onClick={handleDisabledButtonForOrder}
                    className="w-full cursor-not-allowed"
                  >
                    <button
                      disabled
                      className="w-full py-4 rounded-xl bg-gray-400 text-white text-lg font-bold opacity-70 pointer-events-none shadow-none"
                    >
                       Order Now (Disabled)
                    </button>
                  </div>
                )}
                <button
                  onClick={handleFavoriteMeal}
                  className="w-full py-4 rounded-xl backdrop-blur-md bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                >
                  ❤️ Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chef Information Card */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                👨‍🍳
              </div>
              <div>
                <p className="text-sm text-gray-400">Prepared by</p>
                <h3 className="text-xl font-bold text-white">
                  {mealDetails.chefName}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Chef ID</p>
                <p className="text-white font-mono font-semibold">
                  {mealDetails.chefId}
                </p>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Experience</p>
                <p className="text-white text-sm leading-relaxed">
                  {mealDetails.chefExperience}
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients Card */}
          <div className="lg:col-span-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl"></div>
              <div>
                <h3 className="text-2xl font-bold text-white">Ingredients</h3>
                <p className="text-sm text-gray-400">
                  Fresh & Quality ingredients
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mealDetails.ingredients?.map((ingredient, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 px-4 py-3 rounded-xl text-center border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <p className="text-white font-medium text-sm">{ingredient}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Information */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl"></div>
              <h3 className="text-2xl font-bold text-white">
                Delivery Details
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-xs text-gray-400">Service Area</p>
                    <p className="text-white font-semibold">
                      {mealDetails.deliveryArea}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="text-xs text-gray-400">Estimated Time</p>
                    <p className="text-white font-semibold">
                      {mealDetails.estimatedDeliveryTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-white font-semibold text-xl">
                      ৳{mealDetails.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Quality */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-white">
                Quality & Rating
              </h3>
            </div>

            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                <p className="text-sm text-gray-400 mb-2">Overall Rating</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    {mealDetails.rating || 0}
                  </span>
                  <span className="text-3xl">⭐</span>
                </div>
                <p className="text-xs text-gray-400">out of 5.0</p>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Chef Rating</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {mealDetails.chefExperience}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Customer Reviews
                </h2>
                <p className="text-sm text-gray-400">
                  See what others are saying
                </p>
              </div>
            </div>
            {/* Open modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              Write a Review
            </button>
          </div>

          {/* Map all reviews */}
          {reviews.map((review) => (
            <div
              key={review._id}
              className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 mb-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.userImage || "https://i.pravatar.cc/150?img=1"}
                  alt={review.userName}
                  className="w-14 h-14 rounded-full border-2 border-white/30 shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-white text-lg">
                        {review.userName}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i} className="text-yellow-300 text-lg">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed mt-3">
                    {review.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:hover:text-white text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Write a Review
            </h2>

            <form onSubmit={submitReview}>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                min={1}
                max={5}
                placeholder="Enter rating (1-5)"
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />

              <textarea
                name="review"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={5}
                placeholder="Write your review here..."
                required
              ></textarea>

              <button
                type="submit"
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal - Cart Style */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🛒 Your Cart
                </h2>
                <button
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    setQuantity(1);
                    setUserAddress("");
                  }}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold transition"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Cart Item Section */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Order Details
                </h3>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                        {mealDetails?.foodName}
                      </h4>
                      <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
                        ৳{mealDetails?.price} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) =>
                          setQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-16 text-center p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal ({quantity} items)</span>
                    <span className="font-semibold">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      FREE
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ৳{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information Form */}
              <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Delivery Information
                </h3>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.data?.email}
                    readOnly
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  />
                </div>

                {/* Delivery Address (Required Input) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    rows={3}
                    placeholder="Enter your full delivery address..."
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✅ Place Order - ৳{totalPrice}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealDetails;
