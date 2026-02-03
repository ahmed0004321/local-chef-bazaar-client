import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Button, Container } from "../UI";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Hero = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2670&auto=format&fit=crop",
      title: "Discover Local Flavors",
      description: "Experience the authentic taste of homemade meals prepared by trusted local chefs in your community.",
      primaryAction: { text: "Explore Meals", to: "/meals" },
      secondaryAction: { text: "Learn More", to: "/about" },
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2600&auto=format&fit=crop",
      title: "Share Your Culinary Art",
      description: "Turn your kitchen into a business. Join our network of chefs, manage orders, and grow your brand.",
      primaryAction: { text: "Join as Chef", to: "/register" },
      secondaryAction: { text: "How it Works", to: "/about" },
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop",
      title: "Freshness Delivered",
      description: "From the chef's kitchen to your dining table. Enjoy quick, secure, and hassle-free food delivery.",
      primaryAction: { text: "Order Now", to: "/meals" },
      secondaryAction: { text: "Reviews", to: "/reviews" },
    },
  ];

  return (
    <div className="w-full relative group">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="h-[85vh] min-h-[600px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-105 group-hover:scale-110"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                <Container className="w-full">
                  <div className="max-w-2xl text-white space-y-8 pl-4 border-l-4 border-primary/80 animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-200 font-light leading-relaxed max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <Button
                        to={slide.primaryAction.to}
                        size="lg"
                        variant="primary"
                        className="rounded-full px-8"
                      >
                        {slide.primaryAction.text}
                      </Button>
                      <Button
                        to={slide.secondaryAction.to}
                        variant="outline"
                        size="lg"
                        className="text-white border-white hover:bg-white hover:text-black rounded-full px-8"
                      >
                        {slide.secondaryAction.text}
                      </Button>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
    </div>
  );
};

export default Hero;
