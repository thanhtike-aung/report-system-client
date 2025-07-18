import { Skeleton } from "@/components/ui/skeleton";

const LayoutViewSkeleton = () => {
  // Create an array of 3 items for teams
  const teamSkeletons = Array(3).fill(null);
  // Create an array of 6 items for members
  const memberSkeletons = Array(6).fill(null);

  return (
    <div className="space-y-6">
      {/* Teams Skeleton */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {teamSkeletons.map((_, index) => (
          <Skeleton
            key={index}
            className="h-[100px] w-full rounded-lg bg-gray-200"
          />
        ))}
      </div>

      {/* Member List Skeleton */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        {/* Header */}
        <Skeleton className="mb-4 h-6 w-48" />

        {/* Members Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {memberSkeletons.map((_, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report View Skeleton */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <Skeleton className="mb-4 h-6 w-40" />
          {/* Report Items */}
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="mt-2.5 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutViewSkeleton;
