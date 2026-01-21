import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const MiniHero = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-[220px] rounded-lg overflow-hidden shadow-md"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1543353071-873f17a7a088')",
            }}
          >
            <div className="bg-black/40 w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-semibold">
                Welcome to the Dashboard
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1551218808-94e220e084d2')",
            }}
          >
            <div className="bg-black/40 w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-semibold">
                Manage Your Orders
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521305916504-4a1121188589')",
            }}
          >
            <div className="bg-black/40 w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-semibold">
                Quick Stats & Insights
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MiniHero;
