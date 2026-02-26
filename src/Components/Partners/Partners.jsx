import React from 'react';
import Marquee from 'react-fast-marquee';

const restaurants = [
    { name: "The Spice Route", cuisine: "Indian", logo: "https://ui-avatars.com/api/?name=SR&background=f38b0c&color=fff&bold=true&size=128" },
    { name: "Bella Italia", cuisine: "Italian", logo: "https://ui-avatars.com/api/?name=BI&background=e63946&color=fff&bold=true&size=128" },
    { name: "Dragon Palace", cuisine: "Chinese", logo: "https://ui-avatars.com/api/?name=DP&background=2d6a4f&color=fff&bold=true&size=128" },
    { name: "Le Petit Bistro", cuisine: "French", logo: "https://ui-avatars.com/api/?name=LB&background=457b9d&color=fff&bold=true&size=128" },
    { name: "Casa Mexicana", cuisine: "Mexican", logo: "https://ui-avatars.com/api/?name=CM&background=6a0572&color=fff&bold=true&size=128" },
    { name: "Tokyo Garden", cuisine: "Japanese", logo: "https://ui-avatars.com/api/?name=TG&background=d62828&color=fff&bold=true&size=128" },
    { name: "Mama's Kitchen", cuisine: "American", logo: "https://ui-avatars.com/api/?name=MK&background=1d3557&color=fff&bold=true&size=128" },
    { name: "Saffron House", cuisine: "Persian", logo: "https://ui-avatars.com/api/?name=SH&background=e9c46a&color=222&bold=true&size=128" },
    { name: "The Greek Corner", cuisine: "Greek", logo: "https://ui-avatars.com/api/?name=GC&background=0077b6&color=fff&bold=true&size=128" },
    { name: "Naan & Curry", cuisine: "Bangladeshi", logo: "https://ui-avatars.com/api/?name=NC&background=04a777&color=fff&bold=true&size=128" },
];

const RestaurantCard = ({ restaurant }) => (
    <div className="mx-4 flex flex-col items-center gap-3 px-6 py-4 bg-surface border border-white/10 rounded-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 w-44 shrink-0">
        <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-14 h-14 rounded-2xl shadow-md"
        />
        <div className="text-center">
            <p className="font-bold text-sm leading-tight">{restaurant.name}</p>
            <p className="text-[11px] text-foreground/40 mt-0.5">{restaurant.cuisine}</p>
        </div>
    </div>
);

const Partners = () => {
    return (
        <section className="py-20 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-12 px-4">
                <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">
                    Our Network
                </p>
                <h2 className="text-4xl font-extrabold">Restaurants We've Worked With</h2>
                <p className="text-foreground/40 mt-2 text-sm">
                    Trusted by {restaurants.length}+ local food businesses
                </p>
            </div>

            {/* Marquee with fog edges */}
            <div style={{
                maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}>
                <Marquee speed={35} gradient={false} pauseOnHover>
                    {restaurants.map((r) => (
                        <RestaurantCard key={r.name} restaurant={r} />
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default Partners;
