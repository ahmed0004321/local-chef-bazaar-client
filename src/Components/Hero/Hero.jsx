import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Hero = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="h-[80vh]"
      >
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1543353071-873f17a7a088')",
            }}
          >
            <div className="bg-black/60 w-full h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Discover Local Chefs
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-xl">
                  Fresh homemade meals prepared by trusted local chefs near you.
                </p>
                <button className="btn btn-primary">Explore Meals</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1551218808-94e220e084d2')",
            }}
          >
            <div className="bg-black/60 w-full h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Become a Chef
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-xl">
                  Upload menus, manage orders, and grow your food business.
                </p>
                <button className="btn btn-secondary">Join as Chef</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521305916504-4a1121188589')",
            }}
          >
            <div className="bg-black/60 w-full h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Easy Ordering & Fast Delivery
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-xl">
                  Order delicious meals with secure payments and quick delivery.
                </p>
                <button className="btn btn-accent">Order Now</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;
