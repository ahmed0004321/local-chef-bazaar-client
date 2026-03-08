import React from 'react';
import { Card, Skeleton } from '../UI';

const MealCardSkeleton = () => {
    return (
        <Card
            className="p-0 border-0 shadow-lg group flex flex-col h-full bg-surface dark:bg-neutral-900 border border-neutral-100 dark:border-white/5"
            compact
        >
            {/* Image Skeleton */}
            <div className="m-2">
                <Skeleton className="h-52 w-full rounded-2xl" />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                    <Skeleton variant="text" className="h-3 w-full" />
                    <Skeleton variant="text" className="h-3 w-5/6" />
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-6 h-6" />
                        <Skeleton variant="text" className="h-3 w-1/2" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-6 h-6" />
                        <Skeleton variant="text" className="h-3 w-2/3" />
                    </div>
                </div>

                <div className="mt-auto">
                    <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
            </div>
        </Card>
    );
};

export default MealCardSkeleton;
