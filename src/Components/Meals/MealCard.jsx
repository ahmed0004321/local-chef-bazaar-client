import React from 'react';
import { Card, Button, Badge } from '../UI';
import { FaStar, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router';

const MealCard = ({ meal }) => {
    const {
        foodName,
        foodImage,
        chefName,
        deliveryArea,
        price,
        rating,
        description,
        _id
    } = meal;

    return (
        <Card
            className="p-0 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full bg-surface dark:bg-neutral-900 border border-neutral-100 dark:border-white/5"
            compact
            hoverEffect
        >
            {/* Image Section */}
            <div className="relative overflow-hidden h-52 rounded-2xl m-2">
                <img loading="lazy"
                    src={foodImage}
                    alt={foodName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                    <Badge variant="success" size="sm" className="bg-white/90 backdrop-blur-md border-0 text-black shadow-sm font-bold flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        {rating || 0}
                    </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                        ৳{price}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {foodName}
                    </h3>
                </div>

                {/* Short Description */}
                <p className="text-sm text-foreground/60 line-clamp-2 mb-4 h-10">
                    {description || "No description available for this delicious meal."}
                </p>

                <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center text-sm text-foreground/70 gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                            <FaUser />
                        </div>
                        <span className="truncate font-medium">{chefName}</span>
                    </div>
                    <div className="flex items-center text-sm text-foreground/70 gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] text-orange-500">
                            <FaMapMarkerAlt />
                        </div>
                        <span className="truncate font-medium">{deliveryArea}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button
                        to={`/mealDetails/${_id}`}
                        variant="primary"
                        className="w-full h-12 rounded-2xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all font-bold"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MealCard;
