import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceListSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto ml-auto space-y-3">
      {/* Top bar skeleton (Date, Search, Buttons) */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[80px]" />
      </div>

      {/* Table skeleton */}
      <div className="border rounded-md divide-y divide-border">
        {/* Header Row */}
        <div className="grid grid-cols-7 gap-2 px-4 py-2 bg-muted text-sm font-medium">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[150px]" />
        </div>

        {/* 4 loading rows */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 gap-2 px-4 py-3 items-center"
          >
            {Array(7)
              .fill(0)
              .map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
          </div>
        ))}
      </div>

      {/* Pagination footer */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-[200px]" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceListSkeleton;
