import { Construction } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center to-muted p-4">
      <div className="w-full max-w-md mx-auto space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Construction className="h-16 w-16 text-primary" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          We're Building Something Awesome
        </h1>

        <p className="text-muted-foreground text-lg">
          This page is currently under construction. We're working hard to bring
          you a great experience.
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium">Progress</p>
          <Progress value={61} className="h-2" />
          <p className="text-xs text-muted-foreground">61% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
