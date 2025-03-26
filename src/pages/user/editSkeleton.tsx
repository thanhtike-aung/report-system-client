import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonEditForm = () => (
  <Card className="w-full max-w-3xl mx-auto">
    <CardHeader className="space-y-2">
      <Skeleton className="h-8 w-48" /> {/* Title skeleton */}
      <Skeleton className="h-4 w-64" /> {/* Description skeleton */}
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {/* Name and Email fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Input skeleton */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Input skeleton */}
          </div>
        </div>

        {/* Role, Leader, Project fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Select skeleton */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Select skeleton */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Select skeleton */}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-md" /> {/* Button skeleton */}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SkeletonEditForm;
