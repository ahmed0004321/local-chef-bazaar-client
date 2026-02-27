import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Marquee from 'react-fast-marquee';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import axios from 'axios';

const fetchAllReviews = async () => {
    const { data } = await axios.get('https://local-chef-bazaar-server-iota.vercel.app/reviews');
    return Array.isArray(data) ? data : [];
};

const StarRating = ({ rating }) => {
    const stars = Number(rating) || 0;
    return (
        <div className="flex gap-0.5 text-yellow-400">
            {[1, 2, 3, 4, 5].map((s) =>
                s <= stars
                    ? <FaStar key={s} className="text-xs" />
                    : <FaRegStar key={s} className="text-xs opacity-40" />
            )}
        </div>
    );
};

const ReviewCard = ({ review }) => (
    <div className="mx-3 w-72 shrink-0 bg-surface border border-white/10 rounded-3xl p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <FaQuoteLeft className="text-primary/30 text-xl" />
        <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
            {review.review || review.comment || review.text || 'Great experience!'}
        </p>
        <StarRating rating={review.rating} />
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <img
                src={review.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'U')}&background=random`}
                alt={review.userName || 'User'}
                className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=U&background=random'; }}
            />
            <div>
                <p className="font-bold text-sm leading-tight">
                    {review.userName || (review.userEmail ? review.userEmail.split('@')[0] : 'Anonymous')}
                </p>
                {review.mealName && (
                    <p className="text-[11px] text-foreground/40">
                        on <span className="text-primary">{review.mealName}</span>
                    </p>
                )}
            </div>
        </div>
    </div>
);

const SkeletonCard = () => (
    <div className="mx-3 w-72 shrink-0 bg-surface/50 border border-white/10 rounded-3xl p-6 animate-pulse space-y-4">
        <div className="h-4 bg-foreground/10 rounded-full w-1/4" />
        <div className="space-y-2">
            <div className="h-2 bg-foreground/10 rounded-full" />
            <div className="h-2 bg-foreground/10 rounded-full w-5/6" />
            <div className="h-2 bg-foreground/10 rounded-full w-3/4" />
        </div>
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 bg-foreground/10 rounded-full" />)}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <div className="w-9 h-9 rounded-full bg-foreground/10" />
            <div className="space-y-1 flex-1">
                <div className="h-2 bg-foreground/10 rounded-full w-1/2" />
                <div className="h-2 bg-foreground/10 rounded-full w-1/3" />
            </div>
        </div>
    </div>
);

const AllReviews = () => {
    const { data: reviews = [], isLoading, isError } = useQuery({
        queryKey: ['allReviews'],
        queryFn: fetchAllReviews,
        retry: 1,
    });

    if (isError) {
        return null; // Silently fail — don't crash the page
    }

    return (
        <section className="py-20 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-12 px-4">
                <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">
                    What People Say
                </p>
                <h2 className="text-4xl font-extrabold">Customer Reviews</h2>
                {!isLoading && reviews.length > 0 && (
                    <p className="text-foreground/40 mt-2 text-sm">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''} from our community
                    </p>
                )}
            </div>

            {/* Skeleton */}
            {isLoading && (
                <div className="flex overflow-hidden">
                    {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Marquee rows */}
            {!isLoading && reviews.length > 0 && (
                <div style={{
                    maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                }}>
                    <Marquee speed={40} gradient={false} pauseOnHover>
                        {reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </Marquee>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && reviews.length === 0 && (
                <div className="text-center py-16 text-foreground/40">
                    <FaStar className="text-5xl mx-auto mb-4 opacity-20" />
                    <p className="font-semibold">No reviews yet.</p>
                    <p className="text-sm mt-1">Be the first to share your experience!</p>
                </div>
            )}
        </section>
    );
};

export default AllReviews;