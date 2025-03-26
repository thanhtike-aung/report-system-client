import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-sm space-y-6">
      {/* Title Skeleton */}
      <Skeleton className="h-6 w-1/3" />

      {/* Description Skeleton */}
      <Skeleton className="h-4 w-2/3" />

      {/* Name Input Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Email Input Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Project Dropdown Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Save Button Skeleton */}
      <Skeleton className="h-10" />
    </div>
  );
};

export default ProfileSkeleton;
