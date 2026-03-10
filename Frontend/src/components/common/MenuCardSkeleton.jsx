import React from "react";
import Skeleton from "./Skeleton";

const MenuCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex flex-col h-full">
      {/* Image Skeleton */}
      <Skeleton height="180px" borderRadius="1.5rem" className="mb-4" />

      {/* Content Skeleton */}
      <div className="px-2 space-y-3 flex-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            {/* Category */}
            <Skeleton width="40%" height="0.75rem" />
            {/* Name */}
            <Skeleton width="80%" height="1.25rem" />
          </div>
          {/* Price */}
          <Skeleton width="60px" height="1.25rem" />
        </div>

        {/* Action button skeleton */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton width="32px" height="32px" borderRadius="9999px" />
          <Skeleton width="40px" height="24px" />
          <Skeleton width="32px" height="32px" borderRadius="9999px" />
        </div>
      </div>
    </div>
  );
};

export default MenuCardSkeleton;
