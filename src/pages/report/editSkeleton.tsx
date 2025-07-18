import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";

const TaskCardSkeleton = () => (
  <Card className="overflow-hidden pt-0 shadow-md">
    <div className="h-1 rounded-t-md bg-gray-200"></div>
    <CardContent className="px-5 py-2">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="md:col-span-5 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-1 w-full mt-1" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ReportEditSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Preview */}
      <div className="sticky top-4 z-10 mb-8">
        <div className="bg-gradient-to-r from-[#5b87ff] to-[#3b6ae8] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <Skeleton className="h-8 w-48 bg-white/30" />
            </h2>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <Skeleton className="h-5 w-32 bg-white/30" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-24 bg-white/30" />
              <Skeleton className="h-4 w-24 bg-white/30" />
            </div>
            <Skeleton className="h-2 w-full bg-white/30" />
          </div>
        </div>
      </div>

      <div className="space-y-7">
        {[1, 2, 3].map((index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
};

export default ReportEditSkeleton;
