import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ListSkeleton: React.FC = () => {
  return (
    <Card className="max-w-5xl w-full mx-auto">
      <CardHeader className="text-xl font-bold">Projects List</CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="relative p-4 shadow-md w-[300px]">
              <CardHeader>
                <Skeleton className="h-5 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-10 rounded-full absolute right-2 top-7" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListSkeleton;
