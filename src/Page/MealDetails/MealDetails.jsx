import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { Button, Container, Card, Input } from "../../Components/UI";
import { FaStar, FaMapMarkerAlt, FaUser, FaClock, FaShoppingCart, FaHeart, FaCommentAlt, FaTimes } from "react-icons/fa";

const MealDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [userAddress, setUserAddress] = useState("");
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["mealReviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mealReviews?mealId=${id}`);
      return res.data;
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: mealDetails = {}, isLoading } = useQuery({
    queryKey: ["mealDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mealDetails/${id}`);
      return res.data;
    },
  });

  const totalPrice = (mealDetails.price * quantity).toFixed(2);

  const submitReview = async (e) => {
    e.preventDefault();
    const reviewText = e.target.review.value;
    let rating = Number(e.target.rating.value);
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
      setIsModalOpen(false);
      e.target.reset();
      Swal.fire({
        icon: "success",
        title: "Review submitted!",
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'bg-surface text-foreground' }
      });
      refetchReviews();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to submit review",
        text: error.message,
      });
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!userAddress.trim()) {
      Swal.fire({ icon: "warning", title: "Address Required", text: "Please enter your delivery address" });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Order",
      text: `Total: ৳${totalPrice}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f38b0c",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Confirm!",
      background: 'var(--surface)',
      color: 'var(--foreground)'
    });

    if (result.isConfirmed) {
      const orderData = {
        foodId: mealDetails._id,
        mealName: mealDetails.foodName,
        price: totalPrice,
        quantity: quantity,
        chefId: mealDetails.chefId,
        paymentStatus: "Pending",
        userEmail: user?.data?.email,
        userAddress: userAddress,
        orderStatus: "pending",
      };

      try {
        await axiosSecure.post("/myOrders", orderData);
        Swal.fire({
          icon: "success",
          title: "Order placed successfully!",
          showConfirmButton: false,
          timer: 1500,
          background: 'var(--surface)',
          color: 'var(--foreground)'
        });
        setIsOrderModalOpen(false);
        setQuantity(1);
        setUserAddress("");
      } catch (error) {
        Swal.fire({ icon: "error", title: "Failed to place order", text: error.message });
      }
    }
  };


  const handleFavoriteMeal = async () => {
    try {
      await axiosSecure.post(`/favMeal/${id}`, { email: user?.data?.email });
      Swal.fire({
        title: "Favorite Added!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#f38b0c",
        background: 'var(--surface)',
        color: 'var(--foreground)'
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({ title: "Already added!", text: "This meal is already in your favorites.", icon: "info", confirmButtonColor: "#f38b0c", background: 'var(--surface)', color: 'var(--foreground)' });
      }
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="min-h-screen py-10 md:py-16 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20 group">
              <img
                src={mealDetails.foodImage}
                alt={mealDetails.foodName}
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-surface/90 backdrop-blur text-foreground px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <FaStar className="text-yellow-500" /> {mealDetails.rating || 0}
                </span>
              </div>
            </div>

            <Card className="glass !bg-surface/50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><FaCommentAlt /></div>
                Reviews ({reviews.length})
              </h3>

              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review._id} className="p-4 rounded-2xl bg-surface/80 border border-neutral-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={review.userImage || "https://ui-avatars.com/api/?name=User"} alt="" />
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">{review.userName}</h5>
                        <div className="flex text-yellow-500 text-xs">
                          {Array.from({ length: review.rating }, (_, i) => <FaStar key={i} />)}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-foreground/50">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed">{review.text}</p>
                  </div>
                )) : (
                  <div className="text-center py-8 text-foreground/50">No reviews yet. Be the first to review!</div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-white/10">
                <Button onClick={() => setIsModalOpen(true)} variant="outline" className="w-full">Write a Review</Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Order Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{mealDetails.foodName}</h1>
                <div className="flex items-center gap-4 text-foreground/70 mb-6">
                  <span className="flex items-center gap-2"><FaUser className="text-primary" /> {mealDetails.chefName}</span>
                  <span className="w-1 h-1 bg-foreground/30 rounded-full"></span>
                  <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> {mealDetails.deliveryArea}</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-8">৳{mealDetails.price}</div>
              </div>

              <Card className="glass !bg-surface/50 border-primary/20 shadow-xl shadow-primary/5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-background/50 border border-neutral-200 dark:border-white/5 text-center">
                    <FaClock className="mx-auto text-primary mb-2 text-xl" />
                    <div className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Time</div>
                    <div className="font-semibold">{mealDetails.estimatedDeliveryTime}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-neutral-200 dark:border-white/5 text-center">
                    <FaStar className="mx-auto text-yellow-500 mb-2 text-xl" />
                    <div className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Rating</div>
                    <div className="font-semibold">{mealDetails.rating || 'New'}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsOrderModalOpen(true)}
                    size="lg"
                    className={`w-full text-lg shadow-xl py-6 ${user?.data?.status === 'fraud' ? 'opacity-50 grayscale' : 'shadow-primary/20'}`}
                    disabled={user?.data?.status === 'fraud'}
                  >
                    {user?.data?.status === 'fraud' ? 'Account Restricted' : <><FaShoppingCart className="mr-2" /> Order Now</>}
                  </Button>
                  <Button onClick={handleFavoriteMeal} variant="ghost" size="lg" className="w-full">
                    <FaHeart className="mr-2" /> Add to Favorites
                  </Button>
                </div>
              </Card>

              <Card className="!bg-surface/30">
                <h4 className="font-bold mb-3 flex items-center gap-2"><div className="w-2 h-6 bg-primary rounded-full"></div> Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {mealDetails.ingredients?.map((ing, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-background border border-neutral-200 dark:border-white/10 text-sm">
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><div className="w-2 h-6 bg-secondary rounded-full"></div> Chef Experience</h4>
                  <p className="text-foreground/70 leading-relaxed">{mealDetails.chefExperience}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>

      {/* Reusable Modal Wrappers */}
      {(isModalOpen || isOrderModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          {isModalOpen && (
            <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-slide-up relative border border-white/10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors"><FaTimes /></button>
              <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <Input name="rating" type="number" min="1" max="5" label="Rating (1-5)" required />
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Review</span></label>
                  <textarea name="review" className="textarea textarea-bordered h-32 bg-background" placeholder="Share your experience..." required></textarea>
                </div>
                <Button type="submit" className="w-full">Submit Review</Button>
              </form>
            </div>
          )}

          {isOrderModalOpen && (
            <div className="bg-surface w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slide-up relative border border-white/10 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-neutral-200 dark:border-white/10 flex justify-between items-center bg-background/50">
                <h3 className="text-xl font-bold flex items-center gap-2"><FaShoppingCart /> Your Order</h3>
                <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full"><FaTimes /></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <div className="bg-background/50 p-4 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{mealDetails.foodName}</h4>
                    <p className="text-primary font-bold">৳{mealDetails.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-surface rounded-lg p-1 border border-neutral-200 dark:border-white/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/10 rounded">-</button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/10 rounded">+</button>
                  </div>
                </div>

                <form id="orderForm" onSubmit={handleOrderSubmit} className="space-y-4">
                  <Input label="Delivery Address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required placeholder="Enter full address" />
                  <Input label="Email" value={user?.data?.email} readOnly className="opacity-70" />
                </form>
              </div>

              <div className="p-6 border-t border-neutral-200 dark:border-white/10 bg-background/50 mt-auto">
                <div className="flex justify-between items-center mb-4 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{totalPrice}</span>
                </div>
                <Button type="submit" form="orderForm" size="lg" className="w-full">Confirm Order</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealDetails;
