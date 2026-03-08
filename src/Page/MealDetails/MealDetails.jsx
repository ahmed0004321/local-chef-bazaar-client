import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { Button, Container, Card, Input, Badge } from "../../Components/UI";
import { FaStar, FaMapMarkerAlt, FaUser, FaClock, FaShoppingCart, FaHeart, FaCommentAlt, FaTimes, FaLayerGroup } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MealCard from "../../Components/Meals/MealCard";

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

  const { data: relatedMeals = [] } = useQuery({
    queryKey: ["relatedMeals", mealDetails.category, id],
    enabled: !!mealDetails.category,
    queryFn: async () => {
      // Fetch meals of the same category, excluding the current one
      const res = await axiosSecure.get(`/meals?category=${mealDetails.category}&limit=5`);
      return res.data.meals.filter(m => m._id !== id).slice(0, 4);
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
      await axiosSecure.post(`/mealReviews/${id}`, reviewData);
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

  // Assume mealDetails.gallery might exist or fallback to single foodImage in an array
  const imageGallery = mealDetails.gallery && mealDetails.gallery.length > 0
    ? mealDetails.gallery
    : [mealDetails.foodImage];

  return (
    <div className="min-h-screen py-10 md:py-16 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Image Gallery & Reviews */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 group border border-white/5 bg-surface">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="w-full h-[400px] md:h-[550px]"
              >
                {imageGallery.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img loading="lazy"
                      src={img}
                      alt={`${mealDetails.foodName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-6 left-6 z-20">
                <Badge variant="success" className="bg-surface/90 backdrop-blur-md border-0 px-4 py-2 rounded-2xl font-bold shadow-lg flex items-center gap-2">
                  <FaStar className="text-yellow-500" /> {mealDetails.rating || 0}
                </Badge>
              </div>
              <div className="absolute top-6 right-6 z-20">
                <Badge className="bg-primary/90 backdrop-blur-md border-0 text-white px-4 py-2 rounded-2xl font-bold shadow-lg">
                  {mealDetails.category || "General"}
                </Badge>
              </div>
            </div>

            {/* Description Section */}
            <Card className="!bg-surface/50 border-white/5 backdrop-blur-xl p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary text-xl"><FaLayerGroup /></div>
                About this Meal
              </h3>
              <p className="text-foreground/70 text-lg leading-relaxed">
                {mealDetails.description || "The chef has meticulously prepared this meal using authentic local recipes and the freshest ingredients available. Every bite promised a journey through the rich heritage of homemade flavors."}
              </p>
            </Card>

            <Card className="glass !bg-surface/50 p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 text-xl"><FaCommentAlt /></div>
                Guest Experiences ({reviews.length})
              </h3>

              <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review._id} className="p-6 rounded-3xl bg-surface/80 border border-neutral-100 dark:border-white/5 shadow-sm group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-primary/10">
                          <img loading="lazy" src={review.userImage || "https://ui-avatars.com/api/?name=User"} alt="" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-base">{review.userName}</h5>
                        <div className="flex text-yellow-500 text-xs mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FaStar key={i} className={i < review.rating ? "fill-yellow-500" : "fill-neutral-300 dark:fill-white/10"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-foreground/70 text-sm leading-relaxed">{review.text}</p>
                  </div>
                )) : (
                  <div className="text-center py-12 text-foreground/30 font-bold bg-white/5 rounded-3xl border border-dashed border-white/10">
                    No reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-white/10">
                <Button onClick={() => setIsModalOpen(true)} className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/10">Write Your Review</Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Order Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.1]">{mealDetails.foodName}</h1>
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-foreground/60 mb-8 font-bold">
                  <span className="flex items-center gap-2.5"><FaUser className="text-primary" /> {mealDetails.chefName}</span>
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full"></span>
                  <span className="flex items-center gap-2.5"><FaMapMarkerAlt className="text-primary" /> {mealDetails.deliveryArea}</span>
                </div>
                <div className="text-5xl font-bold text-primary mb-10">৳{mealDetails.price}</div>
              </div>

              <Card className="glass !bg-surface/50 border-white/10 shadow-3xl shadow-primary/5 p-8 rounded-[2.5rem]">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-3xl bg-background/50 border border-neutral-200 dark:border-white/5 text-center group hover:border-primary/20 transition-all">
                    <FaClock className="mx-auto text-primary mb-3 text-2xl group-hover:scale-110 transition-transform" />
                    <div className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold mb-1">Wait Time</div>
                    <div className="font-bold text-lg">{mealDetails.estimatedDeliveryTime}</div>
                  </div>
                  <div className="p-5 rounded-3xl bg-background/50 border border-neutral-200 dark:border-white/5 text-center group hover:border-yellow-500/20 transition-all">
                    <FaStar className="mx-auto text-yellow-500 mb-3 text-2xl group-hover:scale-110 transition-transform" />
                    <div className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold mb-1">Avg Rating</div>
                    <div className="font-bold text-lg">{mealDetails.rating || 'New'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => setIsOrderModalOpen(true)}
                    size="lg"
                    className={`w-full h-16 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95 ${user?.data?.status === 'fraud' ? 'opacity-50 grayscale' : ''}`}
                    disabled={user?.data?.status === 'fraud'}
                  >
                    {user?.data?.status === 'fraud' ? 'Account Restricted' : <><FaShoppingCart className="mr-3" /> Secure Order</>}
                  </Button>
                  <Button onClick={handleFavoriteMeal} variant="ghost" className="w-full h-14 rounded-2xl font-bold text-foreground/60 hover:text-primary transition-colors">
                    <FaHeart className="mr-3" /> Add to Favorites
                  </Button>
                </div>
              </Card>

              <Card className="!bg-surface/30 p-8 rounded-[2.5rem] border-white/5">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-3"><div className="w-2.5 h-6 bg-primary rounded-full"></div> Ingredients</h4>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {mealDetails.ingredients?.map((ing, i) => (
                    <span key={i} className="px-5 py-2 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-foreground/80">
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-3"><div className="w-2.5 h-6 bg-orange-500 rounded-full"></div> Chef History</h4>
                  <p className="text-foreground/60 leading-relaxed">{mealDetails.chefExperience || "This chef has established a reputation for maintaining high hygiene standards and delivering heartwarming local flavors for years."}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Meals Section */}
        {relatedMeals.length > 0 && (
          <div className="mt-24 space-y-12">
            <div className="flex items-end justify-between px-4">
              <div>
                <h2 className="text-4xl font-bold text-foreground">You May Also <span className="text-primary">Appreciate.</span></h2>
                <p className="text-foreground/50 mt-2">More treasures from the {mealDetails.category} bazaar.</p>
              </div>
              <Button to="/meals" variant="ghost" className="font-bold text-primary hover:gap-3 transition-all flex items-center gap-2">View All Bazaar <FaShoppingCart className="text-sm" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMeals.map(meal => (
                <MealCard key={meal._id} meal={meal} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Reusable Modal Wrappers */}
      {(isModalOpen || isOrderModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          {isModalOpen && (
            <div className="bg-surface w-full max-w-lg rounded-[2.5rem] p-8 shadow-3xl animate-slide-up relative border border-white/10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-3 hover:bg-white/5 rounded-2xl transition-all text-foreground/40 hover:text-foreground"><FaTimes /></button>
              <h3 className="text-3xl font-bold mb-8">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-6">
                <Input name="rating" type="number" min="1" max="5" label="Star Rating (1-5)" required className="h-14 rounded-2xl font-bold" />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Your Narrative</label>
                  <textarea name="review" className="textarea w-full h-40 bg-white/5 border-white/10 rounded-3xl p-5 focus:border-primary transition-all text-lg" placeholder="Share your experience..." required></textarea>
                </div>
                <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-lg">Post Experience</Button>
              </form>
            </div>
          )}

          {isOrderModalOpen && (
            <div className="bg-surface w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-3xl animate-slide-up relative border border-white/10 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-xl">
                <h3 className="text-2xl font-bold flex items-center gap-4"><FaShoppingCart className="text-primary" /> Confirm Selection</h3>
                <button onClick={() => setIsOrderModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-foreground/40 hover:text-foreground transition-all"><FaTimes /></button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between shadow-inner">
                  <div>
                    <h4 className="font-bold text-xl">{mealDetails.foodName}</h4>
                    <p className="text-primary font-bold text-lg mt-1">৳{mealDetails.price}</p>
                  </div>
                  <div className="flex items-center gap-5 bg-surface rounded-[1.2rem] p-1.5 border border-white/10 shadow-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl font-bold text-xl transition-colors">-</button>
                    <span className="font-bold text-xl w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl font-bold text-xl transition-colors">+</button>
                  </div>
                </div>

                <form id="orderForm" onSubmit={handleOrderSubmit} className="space-y-6">
                  <Input label="Direct Delivery Address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required placeholder="House, Road, Area..." className="h-14 rounded-2xl font-bold" />
                  <Input label="Registered Identity" value={user?.data?.email} readOnly className="opacity-40 h-14 rounded-2xl font-bold bg-white/5" />
                </form>
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6 text-2xl font-bold">
                  <span className="text-foreground/40">Investment</span>
                  <span className="text-primary text-3xl">৳{totalPrice}</span>
                </div>
                <Button type="submit" form="orderForm" className="w-full h-16 rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-primary/20">Finalize Order</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealDetails;
