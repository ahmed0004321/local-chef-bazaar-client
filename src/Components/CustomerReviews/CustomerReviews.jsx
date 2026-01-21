import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import useAxiosSecure from "../../Hooks/AxiosSecure";
import Loading from "../Loading/Loading";

const CustomerReviews = () => {
  const axiosSecure = useAxiosSecure();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="py-12 bg-transparent w-full max-w-6xl mx-auto px-4">
      {/* Subtle Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Community Feedback
          </h2>
          <p className="text-sm text-neutral-500">
            Latest reviews from our diners
          </p>
        </div>
        <div className="hidden md:block text-xs font-medium text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
          {reviews.length} total reviews
        </div>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination, Autoplay]}
        className="pb-12"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>
            <div className="h-full bg-[#161926] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* USER PROFILE SECTION AT TOP */}
                <div className="flex items-center gap-3 mb-6">
                  {review.userImage ? (
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="size-10 rounded-full object-cover border border-white/10 shadow-sm"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold border border-indigo-500/20">
                      {review.userName?.charAt(0)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-medium text-white truncate">
                      {review.userName}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      {review.mealName}
                    </p>
                  </div>
                </div>

                {/* RATING */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < review.rating ? "text-amber-400" : "text-neutral-700"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* FEEDBACK TEXT */}
                <p className="text-neutral-300 text-sm leading-relaxed line-clamp-4 italic">
                  "{review.feedback || review.text}"
                </p>
              </div>

              {/* VERIFIED FOOTER */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">
                  Verified Review
                </span>
                <span className="text-[10px] text-neutral-600">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-pagination-bullet { background: #3f3f46 !important; opacity: 1; }
        .swiper-pagination-bullet-active { background: #6366f1 !important; }
      `,
        }}
      />
    </div>
  );
};

export default CustomerReviews;
