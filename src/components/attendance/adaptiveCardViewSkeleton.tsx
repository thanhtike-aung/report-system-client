import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AdaptiveCardViewSkeleton: React.FC = () => {
  const rows = Array.from({ length: 21 });

  return (
    <div className="mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-48" /> {/* Title */}
        <Skeleton className="h-4 w-32" /> {/* Timestamp */}
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Office Section */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" /> {/* Section Header */}
        {rows.map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-2">
            <Skeleton className="h-4 w-48" /> {/* Name */}
            <Skeleton className="h-4 w-20" /> {/* Role */}
          </div>
        ))}
      </div>

      {/* Remote section */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Footer */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
};

export default AdaptiveCardViewSkeleton;
